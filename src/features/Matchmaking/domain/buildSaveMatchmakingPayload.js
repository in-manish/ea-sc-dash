/**
 * GET `short_title` is a display value (falls back to the title), so sending it back would store the title.
 * Send the raw `short_title_offering` as `short_title` instead; omit it when absent so the backend keeps it.
 */
function withRawShortTitle(question) {
    const next = { ...question };
    if ('short_title_offering' in next) {
        next.short_title = next.short_title_offering;
        delete next.short_title_offering;
    } else {
        delete next.short_title;
    }
    return next;
}

function withoutNullId(question) {
    const next = withRawShortTitle(question);
    if (next.id == null) delete next.id;
    return next;
}

/** Create omits form_id. Edit always sends dest form_id. Never send source question ids. */
export function buildSaveMatchmakingPayload({ formId, formName, questions }) {
    const payload = {
        form_name: formName || 'Matchmaking',
        questions: (questions || []).map(withoutNullId),
    };
    if (formId != null && formId !== '') payload.form_id = formId;
    return payload;
}
