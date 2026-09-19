export function parseSurveyMappingResponse(data) {
    if (!data?.questions) return {};

    const mappings = {};
    data.questions.forEach((q) => {
        const first = q.choices?.[0];
        const isMappedMode = q.choices?.length > 0 && typeof first === 'object' && first.choice_id;

        if (isMappedMode) {
            const choiceMappings = {};
            q.choices.forEach((c) => {
                choiceMappings[c.choice_id] = c.sj_value;
            });
            mappings[q.surveyjs_name] = {
                mmQuestionId: q.question_id,
                mode: 'mapped',
                choiceMappings,
            };
            return;
        }

        mappings[q.surveyjs_name] = {
            mmQuestionId: q.question_id,
            mode: 'direct',
            choiceMappings: {},
        };
    });
    return mappings;
}
