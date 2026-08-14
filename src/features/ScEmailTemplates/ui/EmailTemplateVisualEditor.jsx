import JoditEditor from 'jodit-react';
import { JODIT_EMAIL_CONFIG } from '../constants/joditEmailConfig';

export default function EmailTemplateVisualEditor({ value, onChange }) {
  return (
    <JoditEditor
      value={value || ''}
      config={JODIT_EMAIL_CONFIG}
      onBlur={(html) => onChange(html)}
      onChange={() => {}}
    />
  );
}
