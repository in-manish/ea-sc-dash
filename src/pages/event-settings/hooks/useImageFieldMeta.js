import { useEffect, useState } from 'react';
import { measureImage } from '../../../components/imageEditor/domain/imageMeta';
import { typeFromUrl } from '../domain/imageFieldHints';

async function fetchByteSize(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const proxied = await fetch(`/__image-meta?url=${encodeURIComponent(url)}`, { signal: ctrl.signal });
    if (proxied.ok) {
      const data = await proxied.json();
      if (data?.bytes) return { bytes: data.bytes, type: data.type || '' };
    }
    const head = await fetch(url, { method: 'HEAD', signal: ctrl.signal });
    const len = Number(head.headers.get('content-length'));
    const type = head.headers.get('content-type') || '';
    if (Number.isFinite(len) && len > 0) return { bytes: len, type };
    const res = await fetch(url, { signal: ctrl.signal });
    const blob = await res.blob();
    return { bytes: blob.size || null, type: blob.type || type };
  } catch {
    return { bytes: null, type: '' };
  } finally {
    clearTimeout(timer);
  }
}

export function useImageFieldMeta(value, kind = 'image') {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!value) {
        setMeta(null);
        return;
      }

      if (value instanceof File) {
        let width = 0;
        let height = 0;
        if (kind !== 'video') {
          const url = URL.createObjectURL(value);
          const dims = await measureImage(url);
          URL.revokeObjectURL(url);
          width = dims.width;
          height = dims.height;
        }
        if (!cancelled) {
          setMeta({
            bytes: value.size,
            width,
            height,
            type: value.type || typeFromUrl(value.name),
          });
        }
        return;
      }

      if (typeof value !== 'string' || !value.trim()) {
        setMeta(null);
        return;
      }

      const url = value.trim();
      const [dims, remote] = await Promise.all([
        kind === 'video' ? Promise.resolve({ width: 0, height: 0 }) : measureImage(url),
        fetchByteSize(url),
      ]);
      if (!cancelled) {
        setMeta({
          bytes: remote.bytes,
          width: dims.width,
          height: dims.height,
          type: remote.type || typeFromUrl(url),
        });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [value, kind]);

  return meta;
}
