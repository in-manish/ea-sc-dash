import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchAdminUser } from '../api/adminUsersApi';
import UserDetailsHeader from './UserDetailsHeader';
import UserDetailsInfoGrid from './UserDetailsInfoGrid';
import UserDetailsCardsSection from './UserDetailsCardsSection';
import UserProfileEditForm from './UserProfileEditForm';

/** Full-page SC user detail — same layout pattern as EA CompanyDetails. */
export default function UserDetailsPage() {
  const { userId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [cardsTab, setCardsTab] = useState('saved');
  const [selectedCard, setSelectedCard] = useState(null);
  const [activityStatus, setActivityStatus] = useState('');
  const [pendingDirection, setPendingDirection] = useState('sent');

  const loadUser = useCallback(async () => {
    if (!userId || !token) return;
    setError('');
    try {
      const data = await fetchAdminUser(token, userId);
      setUser(data);
    } catch (err) {
      setUser((prev) => (prev && String(prev.id) === String(userId) ? prev : null));
      setError(err.message || 'Failed to load user details.');
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    const fromNav =
      location.state?.user && String(location.state.user.id) === String(userId)
        ? location.state.user
        : null;
    setUser(fromNav);
    setLoading(!fromNav);
    setIsEditing(false);
    setDirty(false);
    setCardsTab('saved');
    setSelectedCard(null);
    setActivityStatus('');
    setPendingDirection('sent');
    loadUser();
  }, [userId, token, loadUser, location.state]);


  const goBack = () => {
    if (isEditing && dirty && !window.confirm('Discard unsaved changes?')) return;
    navigate('/users/manage');
  };

  const startEdit = () => {
    setSelectedCard(null);
    setIsEditing(true);
  };

  const handleSaved = (result) => {
    setUser((prev) => ({ ...prev, ...result }));
    setIsEditing(false);
    setDirty(false);
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p>Loading User Details...</p>
      </div>
    );
  }

  if ((error && !user) || !user) {
    return (
      <div className="text-center p-12 text-text-secondary">
        <p className="mb-4">{error || 'User not found.'}</p>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/users/manage')}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in">
      <UserDetailsHeader
        user={user}
        isEditing={isEditing}
        dirty={dirty}
        onBack={goBack}
        onEdit={startEdit}
      />

      {isEditing ? (
        <div className="bg-bg-primary border border-border rounded-lg shadow-sm overflow-hidden min-h-[420px] flex flex-col">
          <UserProfileEditForm
            user={user}
            token={token}
            isActive={isEditing}
            onSaved={handleSaved}
            onCancel={() => { setIsEditing(false); setDirty(false); }}
            onDirtyChange={setDirty}
            onSwitchUser={(u) => navigate(`/users/manage/${u.id}`, { state: { user: u } })}
          />
        </div>
      ) : (
        <>
          <UserDetailsInfoGrid user={user} />
          <UserDetailsCardsSection
            userId={user.id}
            token={token}
            tab={cardsTab}
            onTabChange={(t) => { setSelectedCard(null); setCardsTab(t); }}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
            activityStatus={activityStatus}
            onActivityStatusChange={setActivityStatus}
            pendingDirection={pendingDirection}
            onPendingDirectionChange={setPendingDirection}
          />
        </>
      )}
    </div>
  );
}
