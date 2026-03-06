import React from 'react';

const DeviceToggle = ({ previewDevice, setPreviewDevice, deviceDimensions }) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-white flex justify-center sticky top-0 z-10 shadow-sm">
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                {Object.entries(deviceDimensions).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                        <button
                            key={key}
                            onClick={() => setPreviewDevice(key)}
                            title={config.label}
                            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${previewDevice === key ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                        >
                            <Icon size={18} />
                            <span className="hidden md:inline">{config.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DeviceToggle;
