export function normalizeQuestionTitle(title) {
    return String(title || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function findDestQuestionByTitle(sourceQuestion, destQuestions = []) {
    const key = normalizeQuestionTitle(sourceQuestion?.title);
    if (!key) return null;
    return destQuestions.find((dest) => normalizeQuestionTitle(dest.title) === key) || null;
}

export function copyableSourceQuestionIds(sourceQuestions = [], destQuestions = []) {
    return sourceQuestions
        .filter((question) => !findDestQuestionByTitle(question, destQuestions))
        .map((question) => question.id)
        .filter((id) => id != null);
}
