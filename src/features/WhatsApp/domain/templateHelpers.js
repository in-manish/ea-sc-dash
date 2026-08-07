import { STATUS_CHOICES, TEMPLATE_STATUS } from '../constants';

export const getStatusMeta = (status) => {
    const normalized = (status || TEMPLATE_STATUS.PENDING).toLowerCase();
    return STATUS_CHOICES.find((s) => s.value === normalized) || {
        value: normalized,
        label: status || 'Unknown',
        hint: '',
    };
};

export const normalizeContentVariables = (contentVariables = {}) => {
    const vars = {};
    Object.entries(contentVariables).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
            vars[key] = { type: value.type || 'text', value: value.value };
        } else {
            vars[key] = { type: 'text', value: value ?? '' };
        }
    });
    return vars;
};

export const detectVariablesInText = (text = '') => {
    const matches = [...String(text).matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]);
    return [...new Set(matches)];
};

export const buildContentVariablesPayload = (contentVariables = {}) => {
    const complexVars = {};
    Object.entries(contentVariables).forEach(([key, value]) => {
        const type = value?.type ? value.type : 'text';
        const resolved = value?.value !== undefined
            ? value.value
            : (typeof value === 'string' ? value : '');

        if (resolved && String(resolved).trim() !== '') {
            complexVars[key] = { type, value: resolved };
        }
    });
    return complexVars;
};

/** Returns HTML string with variables and *bold* markup resolved for preview. */
export const buildPreviewHtml = (text, variables = {}) => {
    if (!text) return '';

    let preview = text;
    const uniqueMatches = detectVariablesInText(preview);

    uniqueMatches.forEach((key) => {
        let value = '';
        if (variables[key]) {
            if (typeof variables[key] === 'object' && variables[key] !== null && 'value' in variables[key]) {
                value = variables[key].value;
            } else {
                value = variables[key];
            }
        }

        const replacement = value
            ? `<span class="font-semibold text-accent">${value}</span>`
            : `<span class="bg-bg-tertiary text-text-tertiary px-1 rounded text-[10px] font-bold uppercase tracking-wide">{{${key}}}</span>`;

        preview = preview.split(`{{${key}}}`).join(replacement);
    });

    return preview.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
};
