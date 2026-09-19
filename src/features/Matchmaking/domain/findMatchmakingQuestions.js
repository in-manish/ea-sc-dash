export function findMatchmakingQuestions(obj, results = []) {
    if (!obj || typeof obj !== 'object') return results;

    if (obj.isMatchMaking === true) {
        results.push({
            title: obj.title || obj.name,
            name: obj.name,
            choices: obj.choices?.map((c) => (
                typeof c === 'object' ? { text: c.text, value: c.value } : { text: c, value: c }
            )) || [],
        });
    }

    Object.values(obj).forEach((val) => {
        if (typeof val === 'object') findMatchmakingQuestions(val, results);
    });

    return results;
}
