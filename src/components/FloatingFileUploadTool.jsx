import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, GripHorizontal, Link2, Upload, X } from 'lucide-react';
import { fileUploadService } from '../services/fileUploadService';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_POSITION = { x: 0, y: 80 };
const HISTORY_LIMIT = 20;

const clampPosition = (position, panelWidth = 360, panelHeight = 420) => {
  const maxX = Math.max(8, window.innerWidth - panelWidth - 8);
  const maxY = Math.max(8, window.innerHeight - panelHeight - 8);

  return {
    x: Math.min(Math.max(position.x, 8), maxX),
    y: Math.min(Math.max(position.y, 8), maxY)
  };
};

const FloatingFileUploadTool = () => {
  const { token, currentEnv } = useAuth();
  const storagePrefix = useMemo(() => `file_upload_tool_${currentEnv || 'STAGE'}`, [currentEnv]);
  const positionKey = `${storagePrefix}_position`;
  const historyKey = `${storagePrefix}_history`;

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const dragRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0, pointerId: null });
  const dragMovedRef = useRef(false);

  useEffect(() => {
    const rawPosition = localStorage.getItem(positionKey);
    if (rawPosition) {
      try {
        setPosition(clampPosition(JSON.parse(rawPosition)));
      } catch {
        setPosition(clampPosition({ x: window.innerWidth - 368, y: DEFAULT_POSITION.y }));
      }
    } else {
      setPosition(clampPosition({ x: window.innerWidth - 368, y: DEFAULT_POSITION.y }));
    }

    const rawHistory = localStorage.getItem(historyKey);
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory);
        setHistory(Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : []);
      } catch {
        setHistory([]);
      }
    }
  }, [historyKey, positionKey]);

  useEffect(() => {
    localStorage.setItem(positionKey, JSON.stringify(position));
  }, [position, positionKey]);

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify(history));
  }, [history, historyKey]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragRef.current.isDragging) return;
      if (dragRef.current.pointerId !== null && event.pointerId !== dragRef.current.pointerId) return;
      const x = event.clientX - dragRef.current.offsetX;
      const y = event.clientY - dragRef.current.offsetY;
      dragMovedRef.current = true;
      setPosition(clampPosition({ x, y }));
    };

    const onPointerUp = (event) => {
      if (dragRef.current.pointerId !== null && event.pointerId !== dragRef.current.pointerId) return;
      dragRef.current.isDragging = false;
      dragRef.current.pointerId = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const onDragStart = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragMovedRef.current = false;
    dragRef.current.isDragging = true;
    dragRef.current.offsetX = event.clientX - position.x;
    dragRef.current.offsetY = event.clientY - position.y;
    dragRef.current.pointerId = event.pointerId;
  };

  const onToggleButtonClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    setIsOpen(true);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage('URL copied to clipboard.');
      setError('');
    } catch {
      setError('Copy failed. Please copy manually.');
    }
  };

  const onUpload = async () => {
    if (!selectedFile) {
      setError('Select a file first.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await fileUploadService.uploadFile(selectedFile, token);
      const url = result.fileUrl || '';
      const entry = {
        id: `${Date.now()}_${selectedFile.name}`,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileUrl: url,
        filePath: result.filePath,
        contentType: result.contentType,
        contentGroup: result.contentGroup,
        uploadedAt: new Date().toISOString()
      };

      setActiveUrl(url);
      setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
      setSelectedFile(null);
      setSuccessMessage('File uploaded successfully.');
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleString();
  };

  return (
    <div
      className="fixed z-[80]"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {!isOpen ? (
        <button
          onPointerDown={onDragStart}
          onClick={onToggleButtonClick}
          className="h-11 w-11 rounded-full border border-border bg-bg-primary/75 text-text-primary shadow-md backdrop-blur cursor-pointer hover:bg-bg-primary transition-colors"
          title="Open file upload utility"
        >
          <Upload size={18} className="mx-auto" />
        </button>
      ) : (
        <div className="w-[360px] rounded-xl border border-border bg-bg-primary shadow-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-3 py-2 bg-bg-secondary border-b border-border cursor-move"
            onPointerDown={onDragStart}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <GripHorizontal size={16} className="text-text-secondary" />
              File Upload Utility
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="border-none bg-transparent text-text-secondary hover:text-text-primary cursor-pointer p-1 rounded"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-3 space-y-3">
            <input
              type="file"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="w-full text-sm text-text-primary file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-bg-secondary file:text-text-primary"
            />
            <button
              onClick={onUpload}
              disabled={isUploading}
              className="w-full py-2 px-3 text-sm rounded-md border-none bg-accent text-white cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload file'}
            </button>

            {activeUrl ? (
              <div className="rounded-md border border-border p-2 bg-bg-secondary">
                <p className="text-xs text-text-secondary mb-1">Latest URL</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-primary truncate flex-1">{activeUrl}</span>
                  <button
                    onClick={() => copyText(activeUrl)}
                    className="border-none bg-transparent text-accent cursor-pointer p-1"
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            ) : null}

            {error ? <p className="text-xs text-danger">{error}</p> : null}
            {successMessage ? <p className="text-xs text-success">{successMessage}</p> : null}

            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Upload history</h4>
                <span className="text-xs text-text-tertiary">Last {HISTORY_LIMIT}</span>
              </div>

              {history.length === 0 ? (
                <p className="text-xs text-text-tertiary">No uploads yet.</p>
              ) : (
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                  {history.map((entry) => (
                    <div key={entry.id} className="rounded-md border border-border p-2 bg-bg-secondary">
                      <p className="text-xs font-medium text-text-primary truncate">{entry.fileName}</p>
                      <p className="text-[11px] text-text-secondary">{formatDate(entry.uploadedAt)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Link2 size={12} className="text-text-secondary shrink-0" />
                        <span className="text-[11px] text-text-primary truncate flex-1">{entry.fileUrl || 'No URL returned'}</span>
                        {entry.fileUrl ? (
                          <button
                            onClick={() => copyText(entry.fileUrl)}
                            className="border-none bg-transparent text-accent cursor-pointer p-1"
                            title="Copy URL"
                          >
                            <Copy size={13} />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingFileUploadTool;
