import React, { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Mail, Code, Layout } from 'lucide-react';

const TemplatePreviewCanvas = ({
    previewTemplate,
    isEditing,
    previewDevice,
    deviceDimensions,
    editFormData,
    setEditFormData
}) => {
    const [editorMode, setEditorMode] = useState('visual'); // 'visual' or 'code'

    return (
        <div className="flex-1 overflow-auto bg-[#fafafa] p-4 sm:p-8 flex justify-center items-start border-l border-gray-200 shadow-inner">
            {previewTemplate?.email_content || isEditing ? (
                <div
                    className="bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0"
                    style={{
                        width: deviceDimensions[previewDevice].width,
                        maxWidth: '100%',
                        minHeight: '600px',
                        margin: '0 auto',
                    }}
                >
                    {/* Gmail-style Header & Sender info (Hidden in Edit Mode) */}
                    {!isEditing && (
                        <div className="bg-white px-6 py-5 border-b border-gray-100 flex gap-4 justify-between items-start lg:items-center flex-col lg:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="text-[1.35rem] font-medium text-gray-900">
                                    (Dynamic Subject)
                                </div>
                                <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">Template Info</span>
                            </div>
                        </div>
                    )}

                    {/* Toolbar for Editor Mode (Only in Edit Mode) */}
                    {isEditing && (
                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <button
                                    onClick={() => setEditorMode('visual')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${editorMode === 'visual'
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Layout size={14} />
                                    Visual
                                </button>
                                <button
                                    onClick={() => setEditorMode('code')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${editorMode === 'code'
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Code size={14} />
                                    Code
                                </button>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {editorMode === 'visual' ? 'Rich Text Editor' : 'Plain Text / HTML Source'}
                            </span>
                        </div>
                    )}

                    {/* Actual Email HTML OR Editor */}
                    <div className="flex-1 w-full bg-white relative border-t border-gray-100 min-h-[500px] flex flex-col">
                        {isEditing ? (
                            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                {editorMode === 'visual' ? (
                                    <JoditEditor
                                        value={editFormData.email_content || ''}
                                        config={{
                                            readonly: false,
                                            height: '100%',
                                            minHeight: 500,
                                            toolbarAdaptive: false,
                                            enter: "BR",
                                            iframe: true,
                                            editHTMLDocumentMode: true,
                                            cleanHTML: {
                                                fillEmptyParagraph: false,
                                                replaceNBSP: false,
                                                cleanOnPaste: false
                                            },
                                            buttons: "source,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,eraser,copyformat,|,symbol,print,about",
                                            style: {
                                                fontFamily: 'Inter, system-ui, sans-serif'
                                            }
                                        }}
                                        onBlur={newContent => setEditFormData(prev => ({ ...prev, email_content: newContent }))}
                                        onChange={() => { }}
                                    />
                                ) : (
                                    <div className="flex-1 p-4 bg-gray-50">
                                        <textarea
                                            value={editFormData.email_content || ''}
                                            onChange={e => setEditFormData(prev => ({ ...prev, email_content: e.target.value }))}
                                            className="w-full h-full p-6 text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none shadow-premium-sm"
                                            placeholder="Write your email content or HTML here..."
                                            style={{ minHeight: '500px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <iframe
                                title="Email Preview"
                                srcDoc={`
                                    <!DOCTYPE html>
                                    <html>
                                      <head>
                                        <style>
                                          body { 
                                            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
                                            line-height: 1.6; 
                                            color: #1a1a1a; 
                                            margin: 24px; 
                                            white-space: pre-wrap; 
                                            word-wrap: break-word; 
                                          }
                                          /* Override pre-wrap for HTML elements to avoid double spacing */
                                          p, div, h1, h2, h3, h4, h5, h6, ul, ol, li, table {
                                            white-space: normal;
                                          }
                                        </style>
                                      </head>
                                      <body>${previewTemplate.email_content || ''}</body>
                                    </html>
                                `}
                                className="w-full border-none transition-all duration-300"
                                sandbox="allow-same-origin allow-popups"
                                style={{ minHeight: '500px' }}
                                onLoad={(e) => {
                                    try {
                                        const height = e.target.contentWindow.document.documentElement.scrollHeight;
                                        e.target.style.height = `${Math.max(500, height)}px`;
                                    } catch (err) {
                                        console.warn('Could not auto-resize iframe:', err);
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-gray-400 h-full w-full">
                    <Mail size={48} className="mb-4 text-gray-300" />
                    <span className="italic">No email content available</span>
                </div>
            )}
        </div>
    );
};

export default TemplatePreviewCanvas;
