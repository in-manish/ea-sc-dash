export function sortMatchmakingQuestions(questions = []) {
    return [...questions].sort((a, b) => {
        const sortDiff = (a.sort_key ?? 0) - (b.sort_key ?? 0);
        if (sortDiff !== 0) return sortDiff;
        return (a.id ?? 0) - (b.id ?? 0);
    });
}
