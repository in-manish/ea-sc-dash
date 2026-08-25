import { useSearchParams } from 'react-router-dom';
import ImportsTab from './ImportsTab';
import SubscribersTab from './SubscribersTab';
import VisiqTabs from './VisiqTabs';

const VALID = new Set(['subscribers', 'imports']);

export default function VisiqPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab') || 'subscribers';
  const activeTab = VALID.has(raw) ? raw : 'subscribers';

  const setActiveTab = (tab) => {
    setSearchParams((params) => {
      params.set('tab', tab);
      return params;
    });
  };

  return (
    <div className="visiq-page animate-fade-in max-w-[1400px]">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-text-primary tracking-tight m-0">Visiq</h1>
        <p className="text-sm text-text-secondary mt-1 mb-0">
          Manage subscriber contacts and CSV imports.
        </p>
      </header>

      <VisiqTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="bg-bg-primary border border-border rounded-lg shadow-sm p-4 sm:p-5 overflow-hidden">
        {activeTab === 'subscribers' && <SubscribersTab />}
        {activeTab === 'imports' && <ImportsTab />}
      </div>
    </div>
  );
}
