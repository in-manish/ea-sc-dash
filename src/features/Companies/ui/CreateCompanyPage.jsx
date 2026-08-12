import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCreateCompany } from '../hooks/useCreateCompany';
import { useCompanyCountries } from '../hooks/useCompanyCountries';
import CreateCompanyBasicsFields from './CreateCompanyBasicsFields';
import CreateCompanyProfileFields from './CreateCompanyProfileFields';

const CreateCompanyPage = () => {
  const { selectedEvent, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const parentId = searchParams.get('parent_id');
  const parentName = searchParams.get('parent_name') || '';
  const parentObf = searchParams.get('parent_obf') || '';
  const initialParent = parentId
    ? {
        id: parentId,
        company_name: parentName || `#${parentId}`,
        obf_number: parentObf,
      }
    : null;
  const parentLocked = Boolean(parentId);

  const eventId = selectedEvent?.id;
  const goBack = () => {
    if (parentId && eventId) {
      navigate(`/event/${eventId}/companies/${parentId}`);
      return;
    }
    navigate(eventId ? `/event/${eventId}/companies` : -1);
  };

  const onCreated = (created) => {
    if (created?.id && eventId) {
      navigate(`/event/${eventId}/companies/${created.id}`, { replace: true });
    } else {
      goBack();
    }
  };

  const { form, setField, saving, error, submit } = useCreateCompany({
    eventId,
    token,
    initialParent,
    onCreated,
  });

  const { countries, loading: countriesLoading } = useCompanyCountries(
    eventId,
    token,
    Boolean(eventId && token)
  );

  if (!selectedEvent) {
    return (
      <div className="text-center p-12 text-text-secondary">
        Select an event to add a company.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in">
      <div className="mb-8">
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer p-0 mb-4"
          onClick={goBack}
          disabled={saving}
        >
          <ArrowLeft size={16} />
          {parentLocked ? 'Back to parent company' : 'Back to list'}
        </button>

        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="w-16 h-16 bg-bg-tertiary rounded-md flex items-center justify-center text-accent shrink-0">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary m-0">
              {parentLocked ? 'Add co-exhibitor' : 'Add company'}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {parentLocked
                ? `Under ${parentName || `company #${parentId}`}`
                : 'Create a parent exhibitor or co-exhibitor for this event'}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-bg-primary border border-border rounded-lg shadow-sm p-6 space-y-6"
      >
        {error && (
          <div className="p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        <CreateCompanyBasicsFields
          form={form}
          setField={setField}
          eventId={eventId}
          token={token}
          parentLocked={parentLocked}
          countries={countries}
          countriesLoading={countriesLoading}
        />

        <CreateCompanyProfileFields form={form} setField={setField} />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={goBack}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Creating…
              </>
            ) : (
              'Create company'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyPage;
