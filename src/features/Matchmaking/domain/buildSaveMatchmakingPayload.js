function withoutNullId(question) {
    const next = { ...question };
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
