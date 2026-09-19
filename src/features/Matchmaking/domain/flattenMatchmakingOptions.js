export function flattenMatchmakingOptions(question) {
    const options = [];
    if (!question) return options;
    if (question.type === 'grouped_array') {
        question.options?.forEach((group) => {
            group.values?.forEach((val) => {
                options.push({ id: val.id, name: val.name, group: group.name });
            });
        });
        return options;
    }
    question.options?.forEach((opt) => options.push({ id: opt.id, name: opt.name }));
    return options;
}

export function matchmakingQuestionList(matchmakingData) {
    if (Array.isArray(matchmakingData?.questions)) return matchmakingData.questions;
    if (Array.isArray(matchmakingData)) return matchmakingData;
    return [];
}
