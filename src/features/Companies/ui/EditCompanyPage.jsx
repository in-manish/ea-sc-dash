import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useEditCompany } from '../hooks/useEditCompany';
import { useCompanyCountries } from '../hooks/useCompanyCountries';
import CreateCompanyBasicsFields from './CreateCompanyBasicsFields';
import CreateCompanyProfileFields from './CreateCompanyProfileFields';
import EditCompanyLimitsFields from './EditCompanyLimitsFields';

const EditCompanyPage = () => {
  const { selectedEvent, token } = useAuth();
  const { companyId } = useParams();
  const navigate = useNavigate();
  const eventId = selectedEvent?.id;

  const goBack = () => {
    if (eventId && companyId) {
      navigate(`/event/${eventId}/companies/${companyId}`);
      return;
    }
    navigate(eventId ? `/event/${eventId}/companies` : -1);
  };

  const onSaved = (updated) => {
    const id = updated?.id || companyId;
    if (eventId && id) {
      navigate(`/event/${eventId}/companies/${id}`, { replace: true });
    } else {
      goBack();
    }
  };

  const { form, setField, loading, saving, error, loadError, submit } = useEditCompany({
    eventId,
    companyId,
    token,
    onSaved,
  });

  const { countries, loading: countriesLoading } = useCompanyCountries(
    eventId,
    token,
    Boolean(eventId && token)
  );

  if (!selectedEvent) {
    return (
      <div className="text-center p-12 text-text-secondary">
        Select an event to edit a company.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p>Loading company…</p>
      </div>
    );
  }

  if (loadError || !form) {
    return (
      <div className="text-center p-12 text-text-secondary">
        <p className="mb-4">{loadError || 'Company not found.'}</p>
        <button type="button" className="btn btn-secondary" onClick={goBack}>
          Go back
        </button>
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
          Back to company
        </button>

        <div className="flex items-center gap-4 border-b border-border pb-6">
          {form.existingLogoUrl && !form.removeLogo ? (
            <img
              src={form.existingLogoUrl}
              alt={form.company_name}
              className="w-16 h-16 object-contain bg-white rounded-md border border-border shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-bg-tertiary rounded-md flex items-center justify-center text-accent shrink-0">
              <Building2 size={28} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-text-primary m-0">Edit company</h1>
            <p className="text-sm text-text-secondary mt-1">{form.company_name}</p>
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
          parentLocked={false}
          isEdit
          countries={countries}
          countriesLoading={countriesLoading}
        />

        <CreateCompanyProfileFields form={form} setField={setField} isEdit />

        <EditCompanyLimitsFields form={form} setField={setField} />

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
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyPage;
