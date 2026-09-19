export function buildSurveyMappingPayload(formValue, mappings, surveyQuestions) {
    return {
        form_value: formValue,
        questions: Object.entries(mappings).map(([surveyName, mapping]) => {
            if (!mapping.mmQuestionId) return null;
            const sq = surveyQuestions.find((q) => q.name === surveyName);

            if (mapping.mode === 'mapped') {
                const choices = Object.entries(mapping.choiceMappings || {}).map(
                    ([choiceId, surveyValue]) => ({
                        choice_id: parseInt(choiceId, 10),
                        surveyjs_value: surveyValue,
                    }),
                );
                return {
                    surveyjs_name: surveyName,
                    question_id: parseInt(mapping.mmQuestionId, 10),
                    choices,
                };
            }

            return {
                surveyjs_name: surveyName,
                question_id: parseInt(mapping.mmQuestionId, 10),
                choices: (sq?.choices || []).map((c) => c.value),
            };
        }).filter(Boolean),
    };
}
