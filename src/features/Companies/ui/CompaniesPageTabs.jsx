import { ShoppingCart, Settings, Upload, Building2, Bell } from 'lucide-react';

const tabClass = (active) =>
  `pb-2 px-1 font-medium text-sm transition-colors relative ${
    active ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'
  }`;

const pillClass = (active) =>
  `px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
    active ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
  }`;

function SubNav({ children }) {
  return (
    <div className="mb-6 flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg inline-flex">
      {children}
    </div>
  );
}

export default function CompaniesPageTabs({
  activeTab,
  exhView,
  arView,
  onTabChange,
  onExhViewChange,
  onArViewChange,
}) {
  return (
    <>
      <div className="flex flex-wrap gap-4 border-b border-border mb-6">
        <button type="button" className={tabClass(activeTab === 'exhibitors')} onClick={() => onTabChange('exhibitors')}>
          Exhibitors
        </button>
        <button
          type="button"
          className={tabClass(activeTab === 'product_matchmaking')}
          onClick={() => onTabChange('product_matchmaking')}
        >
          Product Matchmaking
        </button>
        <button
          type="button"
          className={tabClass(activeTab === 'additional_requirements')}
          onClick={() => onTabChange('additional_requirements')}
        >
          Additional Requirements
        </button>
        <button
          type="button"
          className={tabClass(activeTab === 'exhibitor_engagement')}
          onClick={() => onTabChange('exhibitor_engagement')}
        >
          Exhibitor Engagement
        </button>
      </div>

      {activeTab === 'exhibitors' && (
        <SubNav>
          <button type="button" className={pillClass(exhView === 'list')} onClick={() => onExhViewChange('list')}>
            <Building2 size={16} />
            Exhibitors
          </button>
          <button
            type="button"
            className={pillClass(exhView === 'upload_status')}
            onClick={() => onExhViewChange('upload_status')}
          >
            <Upload size={16} />
            Upload Status
          </button>
          <button
            type="button"
            className={pillClass(exhView === 'checklist_reminder')}
            onClick={() => onExhViewChange('checklist_reminder')}
          >
            <Bell size={16} />
            Checklist Reminder
          </button>
        </SubNav>
      )}

      {activeTab === 'additional_requirements' && (
        <SubNav>
          <button type="button" className={pillClass(arView === 'orders')} onClick={() => onArViewChange('orders')}>
            <ShoppingCart size={16} />
            Requirement Orders
          </button>
          <button type="button" className={pillClass(arView === 'setup')} onClick={() => onArViewChange('setup')}>
            <Settings size={16} />
            Requirement Setup
          </button>
        </SubNav>
      )}
    </>
  );
}
