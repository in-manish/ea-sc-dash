export async function copyImageBlob(blob) {
  if (!blob) throw new Error('Nothing to copy.');
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Clipboard image copy is not supported in this browser.');
  }
  const type = blob.type === 'image/png' ? 'image/png' : blob.type;
  try {
    await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
    return;
  } catch {
    if (type !== 'image/png') {
      throw new Error('This browser can copy PNG images only. Export PNG, then copy.');
    }
    throw new Error('Clipboard permission was denied.');
  }
}

export async function copyEditedPng(canvas, exportEditedImage) {
  const { blob } = await exportEditedImage(canvas, {
    formatId: 'png',
    filename: 'edited-image',
    scale: 1,
    quality: 100,
  });
  await copyImageBlob(blob);
}
