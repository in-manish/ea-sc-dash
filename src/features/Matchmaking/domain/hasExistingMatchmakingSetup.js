/** True when GET 200 returned a form and/or any questions. Copy must stay disabled. */
export function hasExistingMatchmakingSetup(form) {
    if (!form) return false;
    if (form.id != null && form.id !== '') return true;
    return Array.isArray(form.questions) && form.questions.length > 0;
}

export function canCopyMatchmakingIntoEvent({ notFound, form }) {
    return Boolean(notFound) && !hasExistingMatchmakingSetup(form);
}
