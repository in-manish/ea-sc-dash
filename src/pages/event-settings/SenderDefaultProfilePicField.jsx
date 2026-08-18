import React, { useEffect, useState } from 'react';
import { Check, Copy, User } from 'lucide-react';
import { FormField, getInputClass } from './components/SharedComponents';

const SenderDefaultProfilePicField = ({ eventData, handleInputChange, isFieldModified }) => {
    const url = eventData.sender_default_profile_pic || '';
    const [copied, setCopied] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const showImage = Boolean(url.trim()) && !imgFailed;

    useEffect(() => {
        setImgFailed(false);
    }, [url]);

    const copyUrl = async () => {
        if (!url) return;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <FormField
            label="Default Sender Profile Pic"
            description="Round avatar used in meeting confirmation emails. Paste a public image URL, then save."
        >
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-secondary min-w-[220px]">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border bg-bg-tertiary flex items-center justify-center">
                        {showImage ? (
                            <img
                                src={url}
                                alt=""
                                onError={() => setImgFailed(true)}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={22} className="text-text-tertiary" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="m-0 text-sm font-semibold text-text-primary leading-tight">Preview</p>
                        <p className="m-0 mt-0.5 text-xs text-text-tertiary">
                            {showImage ? 'How the sender photo appears' : imgFailed ? 'Image failed to load' : 'No photo URL yet'}
                        </p>
                    </div>
                </div>

                <div className="flex-1 w-full flex items-center gap-2">
                    <input
                        type="url"
                        name="sender_default_profile_pic"
                        value={url}
                        onChange={handleInputChange}
                        className={getInputClass(
                            'sender_default_profile_pic',
                            isFieldModified('sender_default_profile_pic')
                        )}
                        placeholder="https://example.com/media/sender.jpg"
                    />
                    <button
                        type="button"
                        onClick={copyUrl}
                        disabled={!url}
                        title="Copy image URL"
                        className="btn btn-secondary p-2.5 flex items-center justify-center shrink-0 disabled:opacity-40"
                    >
                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </FormField>
    );
};

export default SenderDefaultProfilePicField;
