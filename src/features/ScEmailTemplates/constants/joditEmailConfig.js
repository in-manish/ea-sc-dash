export const JODIT_EMAIL_CONFIG = {
  readonly: false,
  height: '100%',
  minHeight: 500,
  toolbarAdaptive: false,
  enter: 'BR',
  iframe: true,
  editHTMLDocumentMode: true,
  cleanHTML: {
    fillEmptyParagraph: false,
    replaceNBSP: false,
    cleanOnPaste: false,
  },
  buttons:
    'source,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,eraser,copyformat,|,symbol,print,about',
  style: { fontFamily: 'Inter, system-ui, sans-serif' },
};
