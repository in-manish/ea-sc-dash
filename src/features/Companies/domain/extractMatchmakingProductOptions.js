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

export function getMatchmakingProductQuestions(matchmakingData) {
  return listQuestions(matchmakingData).filter(
    (q) => normalizeQuestionType(q.question_type) === 'product',
  );
}

export function productQuestionGroups(question) {
  if (!question) return [];
  if (question.type === 'grouped_array') {
    return (question.options || []).map((group) => ({
      id: group.id,
      name: group.name || 'Untitled group',
      products: (group.values || []).map((v) => String(v?.name || '').trim()).filter(Boolean),
    }));
  }
  return [{
    id: question.id,
    name: question.title || 'Products',
    products: (question.options || []).map((o) => String(o?.name || '').trim()).filter(Boolean),
  }];
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
