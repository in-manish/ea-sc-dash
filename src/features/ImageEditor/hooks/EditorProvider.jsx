import { useMemo, useRef, useState } from 'react';
import { DESKTOP_MQ, TOOLS } from '../constants';
import { EditorContext } from './editorContext';
import { useAdjustments } from './useAdjustments';
import { useEditorCrop } from './useEditorCrop';
import { useEditorDrawing } from './useEditorDrawing';
import { useEditorExport } from './useEditorExport';
import { useEditorHistory } from './useEditorHistory';
import { useEditorImport } from './useEditorImport';
import { useEditorKeyboard } from './useEditorKeyboard';
import { useEditorLayers } from './useEditorLayers';
import { useEditorSelection } from './useEditorSelection';
import { useEditorSession, useStyleState } from './useEditorSession';
import { useEditorViewport } from './useEditorViewport';
import { useEyedropper } from './useEyedropper';
import { useFabricCanvas } from './useFabricCanvas';

export default function EditorProvider({ children }) {
  const hostRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState(TOOLS.select);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [rightTab, setRightTab] = useState('adjust');
  const [mobilePanel, setMobilePanel] = useState(null);
  const [redactColor, setRedactColor] = useState('#000000');
  const [isDesktop] = useState(() => window.matchMedia(DESKTOP_MQ).matches);
  const canvas = useFabricCanvas(hostRef, setZoom);
  const session = useEditorSession();
  const styles = useStyleState();
  const history = useEditorHistory(canvas);
  const selection = useEditorSelection(canvas);
  const layers = useEditorLayers(canvas, history, selection.refresh);
  const importer = useEditorImport({
    canvas, hostRef, session, history, setError, setStatus, setZoom,
  });
  const exporter = useEditorExport(canvas, session, setError, setStatus);
  const viewport = useEditorViewport(canvas, tool, hostRef, setZoom);
  const crop = useEditorCrop({
    canvas, history, session, setTool, setStatus, setError, setRightTab, setMobilePanel, viewport,
  });
  const eyedropper = useEyedropper(canvas, styles.setStyle, setTool, setStatus, setError);
  const adj = useAdjustments(canvas, styles, history);
  useEditorDrawing(canvas, tool, styles.style, history, redactColor);
  useEditorKeyboard({ canvas, history, viewport, exporter, layers, setTool, tool, crop });

  const value = useMemo(() => ({
    hostRef, canvas, zoom, setZoom, tool, setTool, error, setError, status, setStatus,
    rightTab, setRightTab, mobilePanel, setMobilePanel, redactColor, setRedactColor,
    isDesktop, session, styles, history, selection, layers, importer, exporter,
    viewport, crop, eyedropper, adj,
  }), [
    adj, canvas, crop, error, exporter, eyedropper, history, importer, isDesktop,
    layers, mobilePanel, redactColor, rightTab, selection, session, status, styles,
    tool, viewport, zoom,
  ]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
