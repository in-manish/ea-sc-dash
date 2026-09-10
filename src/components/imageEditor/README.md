# Image editor

Domain-agnostic crop / resize / preview modal for any image file upload.

Uses **Cropper.js** (MIT). Default crop is **free**: width and height are independent.

## Layout

| Path | Owns |
|------|------|
| `ImageEditorProvider.jsx` | App-level `editImage(fileOrUrl, config)` + modal host |
| `domain/fileFromSource.js` | File or saved URL → File (CORS fallback `/__image-file`) |
| `imageEditorContext.js` | `useImageEditor` context hook |
| `hooks/useImageEditor.jsx` | Session, apply / cancel / original |
| `hooks/useCropperSession.js` | Cropper.js lifecycle, live preview blob |
| `ui/ImageEditorModal.jsx` | Modal shell |
| `domain/editorPresets.js` | Per-field recommended web/mobile sizes |
| `ui/ImageEditorCompressControls.jsx` | Compression % slider + target KB |
| `domain/encodeImage.js` | Quality mapping + encode to target size |
| `domain/imageOutput.js` | Export mime (WebP / PNG / JPEG) + downscale |

## Usage

```jsx
const { editImage } = useImageEditor();
const edited = await editImage(fileOrUrl, EDITOR_PRESETS.logo);
if (edited) onFile(edited);
```

Cancel resolves `null`. Non-image files pass through unchanged. A saved image URL is fetched into a File so you can crop it without replacing first.

`config.enabled === false` skips the modal and returns the original file.
