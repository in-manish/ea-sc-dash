export function parseCategoryTypeEmails(data) {
    const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];

    return rows
        .filter((row) => row && row.id != null)
        .map((row) => ({
            id: row.id,
            categoryName: row.category_name || 'General',
            emailName: row.email_name || 'Untitled email',
            email: row.email || '',
            subject: row.subject ?? null,
        }));
}

export function attendeeEmailSendMessage({ badge, categoryCount, templateCount = 0 }) {
    const parts = [];
    if (badge) parts.push('Badge email');
    if (categoryCount) parts.push(`${categoryCount} category ${categoryCount === 1 ? 'email' : 'emails'}`);
    if (templateCount) parts.push(`${templateCount} email ${templateCount === 1 ? 'template' : 'templates'}`);
    if (parts.length === 0) return 'Badge email sent to the selected attendees.';
    const text = parts.join(' and ');
    return `${text.charAt(0).toUpperCase()}${text.slice(1)} sent to the selected attendees.`;
}
