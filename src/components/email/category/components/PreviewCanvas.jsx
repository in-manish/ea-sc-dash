import React from 'react';
import { Mail } from 'lucide-react';
import EmailBodyEditor from '../../shared/EmailBodyEditor';

const PreviewCanvas = ({
    previewEmail,
    isEditing,
    previewDevice,
    deviceDimensions,
    editFormData,
    setEditFormData
}) => {
    return (
        <div className="flex-1 overflow-auto bg-[#fafafa] p-4 sm:p-8 flex justify-center items-start border-l border-gray-200 shadow-inner">
            {previewEmail?.email || isEditing ? (
                <div
                    className="bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0"
                    style={{
                        width: deviceDimensions[previewDevice].width,
                        maxWidth: '100%',
                        minHeight: '600px',
                        margin: '0 auto',
                    }}
                >
                    {!isEditing && <InboxHeader previewEmail={previewEmail} />}

                    <div className="flex-1 w-full bg-white relative border-t border-gray-100 min-h-[500px] flex flex-col">
                        {isEditing ? (
                            <EmailBodyEditor
                                value={editFormData.email || ''}
                                onChange={(email) => setEditFormData((prev) => ({ ...prev, email }))}
                            />
                        ) : (
                            <PreviewFrame html={previewEmail.email || ''} />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-gray-400 h-full w-full outline-none border-none">
                    <Mail size={48} className="mb-4 text-gray-300" />
                    <span className="italic">No email content available</span>
                </div>
            )}
        </div>
    );
};

function InboxHeader({ previewEmail }) {
    return (
        <>
            <div className="bg-white px-6 py-5 border-b border-gray-100 flex gap-4 justify-between items-start lg:items-center flex-col lg:flex-row">
                <div className="flex items-center gap-3">
                    <div className="text-[1.35rem] font-medium text-gray-900">
                        {previewEmail?.subject || '(No Subject)'}
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">Inbox</span>
                </div>
            </div>
            <div className="px-6 py-5 flex justify-between items-start lg:items-center">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-lg flex-shrink-0 shadow-sm">
                        E
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 flex flex-wrap items-center gap-1.5">
                            Event Organizer <span className="text-xs font-normal text-gray-500">&lt;noreply@event.com&gt;</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">to me</div>
                    </div>
                </div>
                <div className="text-xs text-gray-400 font-medium mt-2 lg:mt-0 flex-shrink-0">
                    {new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
            </div>
        </>
    );
}

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

export default PreviewCanvas;
