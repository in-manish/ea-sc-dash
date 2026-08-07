import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Award, Clock, Power } from 'lucide-react';
import ExhibitorPortalSetup from '../exhibitor-portal-setup/ExhibitorPortalSetup';
import ExhibitorCertificate from '../exhibitor-certificate/ExhibitorCertificate';
import CeleryManage from '../celery-manage/CeleryManage';
import EmailKillSwitch from '../email-kill-switch/EmailKillSwitch';

const TABS = [
    { id: 'exhibitor_portal', label: 'Exhibitor Portal Setup', icon: LayoutGrid },
    { id: 'exhibitor_certificate', label: 'Exhibitor Certificate', icon: Award },
    { id: 'celery', label: 'Celery Manage', icon: Clock },
    { id: 'email_kill_switch', label: 'Email Kill Switch', icon: Power },
];

const UtilsConfig = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'exhibitor_portal';

    const handleTabChange = (tab) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        setSearchParams(params, { replace: true });
    };

    return (
        <div className="utils-config-page animate-fade-in">
            <div className="mb-6 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Utils Config</h1>
                <p className="text-[0.925rem] text-text-secondary">
                    Manage exhibitor portal, certificates, celery tasks, and email kill switches.
                </p>
            </div>

            <div className="flex border-b border-border mb-6 gap-2 overflow-x-auto">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 whitespace-nowrap ${
                            activeTab === id
                                ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg'
                        }`}
                        onClick={() => handleTabChange(id)}
                    >
                        <Icon size={18} className={activeTab === id ? 'text-accent' : 'text-text-tertiary'} />
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === 'exhibitor_portal' && <ExhibitorPortalSetup />}
            {activeTab === 'exhibitor_certificate' && <ExhibitorCertificate />}
            {activeTab === 'celery' && <CeleryManage />}
            {activeTab === 'email_kill_switch' && <EmailKillSwitch />}
        </div>
    );
};

export default UtilsConfig;
