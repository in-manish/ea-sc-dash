export function parseOtmFormList(data) {
    const rows = Array.isArray(data?.result) ? data.result : [];
    return rows.map((row) => row?.form_value).filter(Boolean);
}
