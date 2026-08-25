import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSubscriberList } from '../hooks/useSubscriberList';
import ListPagination from '../../Attendees/ui/ListPagination';
import SubscriberDetailDrawer from './SubscriberDetailDrawer';
import SubscriberTable from './SubscriberTable';
import SubscriberToolbar from './SubscriberToolbar';

export default function SubscribersTab() {
  const { token, logout } = useAuth();
  const list = useSubscriberList({ token, onUnauthorized: logout });
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div>
      <SubscriberToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        status={list.status}
        onStatusChange={list.setStatus}
        count={list.count}
        loading={list.loading}
        refreshing={list.refreshing}
        onRefresh={list.refresh}
      />

      {list.error ? (
        <div className="mb-4 text-sm text-danger bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2">
          {list.error}
        </div>
      ) : null}

      <SubscriberTable
        rows={list.results}
        loading={list.loading}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <ListPagination
        page={list.page}
        loading={list.loading}
        hasNext={list.hasNext}
        onPrev={() => list.setPage((p) => Math.max(1, p - 1))}
        onNext={() => list.setPage((p) => p + 1)}
      />

      {selectedId != null && (
        <SubscriberDetailDrawer
          token={token}
          subscriberId={selectedId}
          onClose={() => setSelectedId(null)}
          onUnauthorized={logout}
        />
      )}
    </div>
  );
}
