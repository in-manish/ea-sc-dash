/** List query for GET /wa/template/list/. Omit is_active for the default (active-only). */
export function buildTemplateListParams({
    category = 'attendee',
    search = '',
    page = 1,
    pageSize = 50,
    is_active,
} = {}) {
    const params = {
        category,
        page,
        page_size: pageSize,
    };
    if (search) params.search = search;

    if (is_active === false) params.is_active = false;
    else if (is_active === true) params.is_active = true;

    return params;
}
