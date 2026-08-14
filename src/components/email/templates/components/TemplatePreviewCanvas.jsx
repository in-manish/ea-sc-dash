import React from 'react';
import { Mail } from 'lucide-react';
import EmailBodyEditor from '../../shared/EmailBodyEditor';

const TemplatePreviewCanvas = ({
    previewTemplate,
    isEditing,
    previewDevice,
    deviceDimensions,
    editFormData,
    setEditFormData
}) => {
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

                    <div className="flex-1 w-full bg-white relative border-t border-gray-100 min-h-[500px] flex flex-col">
                        {isEditing ? (
                            <EmailBodyEditor
                                value={editFormData.email_content || ''}
                                onChange={(email_content) => setEditFormData((prev) => ({ ...prev, email_content }))}
                            />
                        ) : (
                            <PreviewFrame html={previewTemplate.email_content || ''} />
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

function PreviewFrame({ html }) {
    return (
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
                      p, div, h1, h2, h3, h4, h5, h6, ul, ol, li, table {
                        white-space: normal;
                      }
                    </style>
                  </head>
                  <body>${html}</body>
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
    );
}

export default TemplatePreviewCanvas;
