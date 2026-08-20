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

export function attendeeEmailSendMessage({ badge, categoryCount }) {
    if (badge && categoryCount) {
        const noun = categoryCount === 1 ? 'category email' : 'category emails';
        return `Badge email and ${categoryCount} ${noun} sent to the selected attendees.`;
    }
    if (categoryCount) {
        const noun = categoryCount === 1 ? 'Category email' : 'Category emails';
        return `${noun} sent to the selected attendees.`;
    }
    return 'Badge email sent to the selected attendees.';
}
