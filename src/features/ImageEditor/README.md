# Image Editor

Browser-only canvas editor. Images never leave the device.

**Route:** `/event/:id/image-editor`  
**Nav:** Event sidebar → Utils Config → Image Editor

Event id is only for the layout shell. Editing does not call event APIs.

Does **not** replace `src/components/imageEditor/` (upload crop/optimize modal).

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Tools, limits, accept types |
| `domain/` | Import, filters, crop, export, copy, stickers, alignment, `placeImage.js`, `viewportMath.js`, `shouldPan.js` |
| `hooks/EditorProvider.jsx` | Feature state |
| `hooks/useFabricCanvas.js` | Fabric.js canvas |
| `hooks/useEditorViewport.js` | Pan workspace, wheel/pinch zoom |
| `ui/ImageEditorPage.jsx` | Page orchestrator |
| `ui/ImageEditorShell.jsx` | Full-viewport shell; workspace is `absolute inset-0` so the Fabric host gets a real size |
| `ui/ExportDialog.jsx` | Download + copy edited image |
| `ui/CropBar.jsx` | Apply crop / Cancel overlay while the crop tool is active |
| `domain/exportCanvas.js` | Flatten at zoom 1, crop to artboard/image only (not the workspace) |
| `domain/encodeAvif.js` | AVIF export: try canvas encode, then libavif WASM. Chrome/Brave can *display* AVIF without `toBlob('image/avif')`. |
| `ui/imageEditor.css` | Checkerboard workspace; canvas stays transparent |

The canvas host must fill the flex workspace. Do not put `flex-1` on `EditorCanvas` unless its parent is `display: flex` — that collapsed the host to 0 height and left Fabric at 300×150.

## Wired from

- `src/pages/ImageEditor.jsx` — thin page
- `src/App.jsx` — `/event/:id/image-editor`
- `src/layouts/EventLayout.jsx` / `src/sc/layouts/EventLayout.jsx` — Utils Config
