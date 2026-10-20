export default function SendEmailReviewStep({ types, templates, templateByType, recipientCount, selectAll, maxCompanies }) {
  const templateOf = (id) => templates.find((item) => String(item.id) === String(id));
  return (
    <div className="flex flex-col gap-3 text-sm text-text-primary">
      <p className="m-0">
        The email will be sent to <strong>{recipientCount}</strong>{' '}
        {selectAll ? 'attendees matching the filter' : 'selected attendees'}. Attendees without an email are skipped.
      </p>
      <ul className="m-0 pl-5 list-disc">
        {types.map((type) => (
          <li key={type.id}>
            {type.name}: <strong>{templateOf(templateByType[type.id])?.name || '—'}</strong>
            {templateOf(templateByType[type.id])?.subject && (
              <span className="text-text-secondary"> (subject: {templateOf(templateByType[type.id]).subject})</span>
            )}
          </li>
        ))}
      </ul>
      <p className="m-0 text-text-secondary">Up to {maxCompanies} requesting company names are shown in the email body.</p>
    </div>
  );
}
