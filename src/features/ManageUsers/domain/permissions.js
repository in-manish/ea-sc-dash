/** Known manage-user permission codenames (Django User model). */
export const MANAGE_USER_PERMISSIONS = [
    { value: 'org_perms', label: 'Organiser' },
    { value: 'visitor_perms', label: 'Visitor' },
    { value: 'print_perms', label: 'Print' },
    { value: 'scan_perms', label: 'Scan' },
    { value: 'kiosk_perms', label: 'Kiosk' },
    { value: 'exhibitor_perms', label: 'Exhibitor' },
    { value: 'coexhibitor_perms', label: 'Co-exhibitor' },
    { value: 'general_attendee_perms', label: 'Attendee' },
    { value: 'staff_readonly_perms', label: 'Staff readonly' },
    { value: 'staff_writereadonly_perms', label: 'Staff write/readonly' },
    { value: 'contractor_perms', label: 'Contractor' },
];

export const ALL_PERMISSION_VALUES = MANAGE_USER_PERMISSIONS.map((p) => p.value);

export const PERMISSION_LABEL_BY_VALUE = Object.fromEntries(
    MANAGE_USER_PERMISSIONS.map((p) => [p.value, p.label])
);

/** Parse URL permissions param. Missing/empty → all selected (default). `__none__` → cleared. */
export function parsePermissionsParam(raw) {
    if (raw == null || raw === '') return [...ALL_PERMISSION_VALUES];
    if (raw === '__none__') return [];
    const selected = raw.split(',').map((s) => s.trim()).filter(Boolean);
    const known = selected.filter((v) => ALL_PERMISSION_VALUES.includes(v));
    return known;
}

/** Serialize for URL. All selected → omit (empty string). None → __none__. */
export function serializePermissionsParam(selected) {
    if (!selected || selected.length === 0) return '__none__';
    if (selected.length === ALL_PERMISSION_VALUES.length
        && ALL_PERMISSION_VALUES.every((v) => selected.includes(v))) {
        return '';
    }
    return selected.join(',');
}

export function isAllPermissionsSelected(selected) {
    return Array.isArray(selected)
        && selected.length === ALL_PERMISSION_VALUES.length
        && ALL_PERMISSION_VALUES.every((v) => selected.includes(v));
}
