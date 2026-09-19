const PAIR_TONES = [
    { wrap: 'bg-sky-50 border-sky-300', badge: 'bg-sky-500 text-white', label: 'text-sky-700' },
    { wrap: 'bg-violet-50 border-violet-300', badge: 'bg-violet-500 text-white', label: 'text-violet-700' },
    { wrap: 'bg-amber-50 border-amber-300', badge: 'bg-amber-500 text-white', label: 'text-amber-800' },
    { wrap: 'bg-rose-50 border-rose-300', badge: 'bg-rose-500 text-white', label: 'text-rose-700' },
    { wrap: 'bg-teal-50 border-teal-300', badge: 'bg-teal-500 text-white', label: 'text-teal-800' },
    { wrap: 'bg-orange-50 border-orange-300', badge: 'bg-orange-500 text-white', label: 'text-orange-800' },
    { wrap: 'bg-fuchsia-50 border-fuchsia-300', badge: 'bg-fuchsia-500 text-white', label: 'text-fuchsia-700' },
    { wrap: 'bg-lime-50 border-lime-300', badge: 'bg-lime-600 text-white', label: 'text-lime-800' },
    { wrap: 'bg-cyan-50 border-cyan-300', badge: 'bg-cyan-500 text-white', label: 'text-cyan-800' },
    { wrap: 'bg-indigo-50 border-indigo-300', badge: 'bg-indigo-500 text-white', label: 'text-indigo-700' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function norm(value) {
    return String(value || '').trim().toLowerCase();
}

function makePair(index, extra) {
    return {
        letter: LETTERS[index % 26],
        tone: PAIR_TONES[index % PAIR_TONES.length],
        ...extra,
    };
}

export function buildChoiceMatchLookup({ choiceMappings = {}, mmOptions = [], surveyChoices = [] }) {
    const mmById = Object.fromEntries(mmOptions.map((o) => [String(o.id), o]));
    const surveyByValue = Object.fromEntries(surveyChoices.map((c) => [String(c.value), c]));
    const byMmId = {};
    const bySurveyValue = {};
    const usedMm = new Set();
    const usedSurvey = new Set();
    let index = 0;

    const grouped = {};
    Object.entries(choiceMappings).forEach(([mmId, surveyValue]) => {
        if (surveyValue === '' || surveyValue == null) return;
        const key = String(surveyValue);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(String(mmId));
    });

    Object.entries(grouped).forEach(([surveyValue, mmIds]) => {
        const survey = surveyByValue[surveyValue];
        const mmNames = mmIds.map((id) => mmById[id]?.name).filter(Boolean);
        const pairForMm = makePair(index, { counterpart: survey?.text || surveyValue });
        const pairForSurvey = makePair(index, { counterpart: mmNames.join(', ') });
        mmIds.forEach((id) => {
            byMmId[id] = pairForMm;
            usedMm.add(id);
        });
        bySurveyValue[surveyValue] = pairForSurvey;
        usedSurvey.add(surveyValue);
        index += 1;
    });

    mmOptions.forEach((opt) => {
        const mmId = String(opt.id);
        if (usedMm.has(mmId)) return;
        const hit = surveyChoices.find((c) => {
            const sv = String(c.value);
            if (usedSurvey.has(sv)) return false;
            return norm(c.text) === norm(opt.name) || norm(c.value) === norm(opt.name);
        });
        if (!hit) return;
        const sv = String(hit.value);
        byMmId[mmId] = makePair(index, { counterpart: hit.text || hit.value, auto: true });
        bySurveyValue[sv] = makePair(index, { counterpart: opt.name, auto: true });
        usedMm.add(mmId);
        usedSurvey.add(sv);
        index += 1;
    });

    return { byMmId, bySurveyValue };
}
