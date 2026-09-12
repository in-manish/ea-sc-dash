export function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return Boolean(target.isContentEditable);
}

export function nextLayerName(type, count) {
  const labels = {
    image: 'Image',
    text: 'Text',
    shape: 'Shape',
    drawing: 'Drawing',
    sticker: 'Sticker',
    redaction: 'Redaction',
    artboard: 'Background',
  };
  return `${labels[type] || 'Layer'} ${count + 1}`;
}

export function visibleEditorObjects(canvas) {
  if (!canvas) return [];
  return canvas.getObjects().filter((obj) => !obj.isCropGuide && !obj.isGuide);
}

export function findMainImage(canvas) {
  if (!canvas) return null;
  return canvas.getObjects().find((obj) => obj.isMainImage)
    || canvas.getObjects().find((obj) => obj.type === 'image' && obj.layerType === 'image')
    || null;
}

export function findArtboard(canvas) {
  return canvas?.getObjects().find((obj) => obj.isArtboard) || null;
}

export function stampObjectMeta(obj, type, name) {
  obj.layerType = type;
  obj.layerName = name;
  obj.layerId = `${type}-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
  obj.locked = false;
  obj.objectCaching = true;
  return obj;
}

export function sceneBox(obj) {
  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();
  const left = obj.originX === 'center' ? obj.left - width / 2 : obj.left;
  const top = obj.originY === 'center' ? obj.top - height / 2 : obj.top;
  return { left, top, width, height };
}
