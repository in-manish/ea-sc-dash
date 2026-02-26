import React, { useState } from 'react';
import { Scan, Printer, Users } from 'lucide-react';
import ScanReports from '../components/reports/ScanReports';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('scan');

    return (
        <div className="reports-page animate-fade-in">
            <div className="mb-6 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Reports</h1>
                <p className="text-[0.925rem] text-text-secondary">View and export detailed reports for scans, prints, and meetings.</p>
            </div>

            <div className="flex border-b border-border mb-6 gap-2">
                <button
                    className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'scan'
                            ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg'
                        }`}
                    onClick={() => setActiveTab('scan')}
                >
                    <Scan size={18} className={activeTab === 'scan' ? 'text-accent' : 'text-text-tertiary'} />
                    Scan Reports
                </button>
                <button
                    className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'print'
                            ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg cursor-not-allowed opacity-50'
                        }`}
                    // onClick={() => setActiveTab('print')}
                    title="Coming Soon"
                    disabled
                >
                    <Printer size={18} className={activeTab === 'print' ? 'text-accent' : 'text-text-tertiary'} />
                    Print Reports
                </button>
                <button
                    className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'meeting'
                            ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg cursor-not-allowed opacity-50'
                        }`}
                    // onClick={() => setActiveTab('meeting')}
                    title="Coming Soon"
                    disabled
                >
                    <Users size={18} className={activeTab === 'meeting' ? 'text-accent' : 'text-text-tertiary'} />
                    Meeting Reports
                </button>
            </div>

            <div className="bg-bg-primary border border-border rounded-xl shadow-sm p-6 overflow-hidden">
                {activeTab === 'scan' && <ScanReports />}
                {activeTab === 'print' && <div className="text-text-secondary text-center py-12">Print Reports Coming Soon...</div>}
                {activeTab === 'meeting' && <div className="text-text-secondary text-center py-12">Meeting Reports Coming Soon...</div>}
            </div>
        </div>
    );
};

export default Reports;
