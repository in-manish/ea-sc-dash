import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_ADJUSTMENTS } from '../domain/adjustments';
import { revokeAll } from '../domain/memory';

const empty = {
  hasImage: false,
  fileName: '',
  fileSize: 0,
  width: 0,
  height: 0,
  type: '',
  warnLarge: false,
  scaled: false,
};

export function useEditorSession() {
  const urlsRef = useRef([]);
  const [meta, setMeta] = useState(empty);

  const trackUrls = useCallback((urls) => {
    urlsRef.current.push(...(urls || []));
  }, []);

  const reset = useCallback(() => {
    revokeAll(urlsRef.current);
    urlsRef.current = [];
    setMeta(empty);
  }, []);

  const applyLoaded = useCallback((loaded) => {
    trackUrls(loaded.urls);
    setMeta({
      hasImage: true,
      fileName: loaded.fileName,
      fileSize: loaded.fileSize,
      width: loaded.width,
      height: loaded.height,
      type: loaded.type,
      warnLarge: loaded.warnLarge,
      scaled: loaded.scaled,
    });
  }, [trackUrls]);

  useEffect(() => () => revokeAll(urlsRef.current), []);

  return { meta, setMeta, applyLoaded, reset, trackUrls };
}

export function useStyleState() {
  const [style, setStyle] = useState({
    color: '#0f172a',
    fill: '#ffffff',
    strokeWidth: 3,
    opacity: 1,
    fontFamily: 'Inter',
    fontSize: 36,
  });
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);
  const [presetId, setPresetId] = useState('original');
  const [intensity, setIntensity] = useState(100);
  return {
    style, setStyle, adjustments, setAdjustments, presetId, setPresetId, intensity, setIntensity,
  };
}
