import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

/** Navigates to the create-company page (no modal). */
const CreateCompanyButton = ({
  eventId,
  label = 'Add company',
  className = 'btn btn-primary',
  initialParent = null,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const base = `/event/${eventId}/companies/new`;
    if (initialParent?.id) {
      const params = new URLSearchParams({
        parent_id: String(initialParent.id),
        parent_name: initialParent.company_name || '',
      });
      if (initialParent.obf_number) {
        params.set('parent_obf', initialParent.obf_number);
      }
      navigate(`${base}?${params}`);
      return;
    }
    navigate(base);
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      <Plus size={16} style={{ marginRight: '0.5rem' }} />
      {label}
    </button>
  );
};

export default CreateCompanyButton;
