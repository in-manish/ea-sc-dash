import { useMemo, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useDraggablePanel } from '../hooks/useDraggablePanel';
import { useFileUploadHistory } from '../hooks/useFileUploadHistory';
import { useGeneralFileUpload } from '../hooks/useGeneralFileUpload';
import FloatingFileUploadPanel from './FloatingFileUploadPanel';

const FloatingFileUploadTool = () => {
  const { token, currentEnv } = useAuth();
  const storagePrefix = useMemo(() => `file_upload_tool_${currentEnv || 'STAGE'}`, [currentEnv]);
  const { position, onDragStart, dragMovedRef } = useDraggablePanel(`${storagePrefix}_position`);
  const { history, pushEntry } = useFileUploadHistory(`${storagePrefix}_history`);
  const upload = useGeneralFileUpload({
    token,
    onUploaded: (entry) => {
      pushEntry({
        id: `${Date.now()}_${entry.fileName}`,
        ...entry,
        uploadedAt: new Date().toISOString(),
      });
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const onToggleButtonClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className="fixed z-[80]" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {!isOpen ? (
        <button
          type="button"
          onPointerDown={onDragStart}
          onClick={onToggleButtonClick}
          className="h-11 w-11 rounded-full border border-border bg-bg-primary/75 text-text-primary shadow-md backdrop-blur cursor-pointer hover:bg-bg-primary transition-colors"
          title="Open file upload utility"
        >
          <Upload size={18} className="mx-auto" />
        </button>
      ) : (
        <FloatingFileUploadPanel
          onDragStart={onDragStart}
          onClose={() => setIsOpen(false)}
          history={history}
          onCopy={upload.copyText}
          form={{
            selectedFile: upload.selectedFile,
            onFile: upload.setSelectedFile,
            keepName: upload.keepName,
            onKeepName: upload.setKeepName,
            isS3Link: upload.isS3Link,
            onIsS3Link: upload.onIsS3Link,
            replaceLink: upload.replaceLink,
            onReplaceLink: upload.setReplaceLink,
            isUploading: upload.isUploading,
            onUpload: upload.onUpload,
            activeUrl: upload.activeUrl,
            error: upload.error,
            successMessage: upload.successMessage,
            onReplace: upload.startReplace,
          }}
        />
      )}
    </div>
  );
};

export default FloatingFileUploadTool;
