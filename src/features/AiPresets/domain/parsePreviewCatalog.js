/** Parse `Q {id} | title` / `- {id} | name` catalog text from the preview API. */

export function parsePreviewCatalog(text) {
  if (!text || text === '(no matchmaking options)') return [];
  const questions = [];
  let current = null;
  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const question = line.match(/^Q\s+(\d+)\s*\|\s*(.*)$/i);
    if (question) {
      current = { questionId: Number(question[1]), title: question[2], options: [] };
      questions.push(current);
      continue;
    }
    const option = line.match(/^-\s+(\d+)\s*\|\s*(.*)$/);
    if (option && current) {
      current.options.push({ id: Number(option[1]), name: option[2] });
    }
  }
  return questions;
}

export function catalogStats(questions) {
  const optionCount = questions.reduce((n, q) => n + q.options.length, 0);
  return { questionCount: questions.length, optionCount };
}

export function filterCatalogQuestions(questions, query) {
  const needle = (query || '').trim().toLowerCase();
  if (!needle) return questions;
  return questions
    .map((item) => {
      const titleHit =
        `q ${item.questionId}`.includes(needle) || item.title.toLowerCase().includes(needle);
      const options = titleHit
        ? item.options
        : item.options.filter(
            (opt) => String(opt.id).includes(needle) || opt.name.toLowerCase().includes(needle)
          );
      return { ...item, options, titleHit };
    })
    .filter((item) => item.titleHit || item.options.length > 0)
    .map((item) => ({
      questionId: item.questionId,
      title: item.title,
      options: item.options,
    }));
}
