import {
  EMAIL_TEMPLATE_TYPE_CUSTOM,
  EMAIL_TEMPLATE_TYPES,
  formatTemplateTypeLabel,
  isKnownEmailTemplateType,
} from '../constants/emailTemplateTypes';

export default function TemplateTypeField({
  isEditing,
  value,
  locked,
  onChange,
}) {
  const slug = value || '';
  const known = isKnownEmailTemplateType(slug);
  const selectValue = known ? slug : EMAIL_TEMPLATE_TYPE_CUSTOM;

  if (!isEditing) {
    return (
      <div className="text-xs font-medium text-gray-800 bg-white p-2.5 rounded-lg border border-gray-100 break-all">
        {formatTemplateTypeLabel(slug) || '-'}
        {slug ? <span className="block text-[10px] text-gray-400 mt-0.5">{slug}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <select
        name="template_type"
        value={selectValue}
        disabled={locked}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs font-medium text-gray-900 bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:bg-gray-100"
      >
        {EMAIL_TEMPLATE_TYPES.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
        <option value={EMAIL_TEMPLATE_TYPE_CUSTOM}>Custom type</option>
      </select>
      {!known ? (
        <input
          type="text"
          name="template_type"
          value={slug === EMAIL_TEMPLATE_TYPE_CUSTOM ? '' : slug}
          onChange={(e) => onChange(e.target.value || EMAIL_TEMPLATE_TYPE_CUSTOM)}
          disabled={locked}
          className="w-full text-xs font-medium text-gray-900 bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          placeholder="custom_type_slug"
        />
      ) : (
        <p className="text-[10px] text-gray-500 break-all">{slug}</p>
      )}
    </div>
  );
}
