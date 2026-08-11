import { normalizeQuestionType } from '../../Matchmaking/constants/questionTypes';

function flattenOptions(question) {
  if (question?.type === 'grouped_array') {
    return (question.options || []).flatMap((group) => group.values || []);
  }
  return question?.options || [];
}

function listQuestions(matchmakingData) {
  return (
    matchmakingData?.questions ||
    (Array.isArray(matchmakingData) ? matchmakingData : [])
  );
}

export function hasMatchmakingProductQuestion(matchmakingData) {
  return listQuestions(matchmakingData).some(
    (q) => normalizeQuestionType(q.question_type) === 'product',
  );
}

/** Option names from matchmaking questions with question_type "product". */
export function extractMatchmakingProductOptions(matchmakingData) {
  const names = [];
  const seen = new Set();

  listQuestions(matchmakingData)
    .filter((q) => normalizeQuestionType(q.question_type) === 'product')
    .forEach((question) => {
      flattenOptions(question).forEach((opt) => {
        const name = String(opt?.name || '').trim();
        if (!name) return;
        const key = name.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        names.push(name);
      });
    });

  return names;
}
