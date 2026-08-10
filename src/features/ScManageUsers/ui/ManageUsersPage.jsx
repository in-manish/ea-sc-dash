import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import useScManageUsersList from '../hooks/useScManageUsersList';
import ManageUsersFilters from './ManageUsersFilters';
import ManageUsersResultsTable from './ManageUsersResultsTable';

export default function ManageUsersPage() {
  const { token } = useAuth();
  const list = useScManageUsersList(token);
  const navigate = useNavigate();

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <div className="mb-8 pb-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">Snapcard Administration</span>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Manage Users</h1>
          <p className="text-sm text-text-secondary">Click a user to open their detail page</p>
        </div>
        <div className="flex items-center gap-2 bg-bg-primary border border-border px-3 py-1.5 rounded-md shadow-sm">
          <input
            id="enable-highlighting"
            type="checkbox"
            checked={list.enableHighlighting}
            onChange={(e) => list.setEnableHighlighting(e.target.checked)}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
          />
          <label htmlFor="enable-highlighting" className="text-xs font-medium text-text-secondary cursor-pointer select-none">
            Highlight Verified Rows
          </label>
        </div>
      </div>

      <ManageUsersFilters
        filters={list.filters}
        isLoading={list.isLoading}
        showAdvancedFilters={list.showAdvancedFilters}
        onToggleFilters={() => list.setShowAdvancedFilters(!list.showAdvancedFilters)}
        onChange={list.handleInputChange}
        onSubmit={list.handleSearchSubmit}
        onReset={list.handleClear}
        onRefresh={list.fetchUsers}
      />

      {list.error && (
        <div className="bg-red-50 text-danger p-4 rounded-lg text-sm border border-red-100 mb-6 flex items-start gap-2.5 animate-fade-in">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-0.5">Error Fetching Users</h4>
            <p className="text-red-600">{list.error}</p>
          </div>
        </div>
      )}

      {list.isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-bg-primary rounded-lg border border-border shadow-sm">
          <Loader2 size={40} className="animate-spin text-accent mb-4" />
          <span className="text-text-secondary font-medium">Fetching administrative records...</span>
        </div>
      ) : list.results !== null ? (
        <ManageUsersResultsTable
          results={list.results}
          totalCount={list.totalCount}
          filters={list.filters}
          pagination={list.pagination}
          enableHighlighting={list.enableHighlighting}
          onLimitChange={list.handleLimitChange}
          onPageChange={list.handlePageChange}
          onSelectUser={(user) => navigate(`/users/manage/${user.id}`, { state: { user } })}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-bg-primary rounded-lg border border-border shadow-sm">
          <Info size={40} className="text-text-tertiary mb-3" />
          <h3 className="font-semibold text-text-secondary">Start Searching</h3>
          <p className="text-sm text-text-tertiary">Use the input filters above to query admin records.</p>
        </div>
      )}
    </div>
  );
}
