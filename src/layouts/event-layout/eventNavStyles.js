export function eventNavLinkClass(isCollapsed) {
  return ({ isActive }) =>
    `flex items-center gap-3 text-sm transition-all duration-200 whitespace-nowrap rounded-md ${
      isActive
        ? 'text-accent bg-accent/10 font-semibold'
        : 'text-text-secondary font-medium hover:text-text-primary hover:bg-bg-secondary'
    } ${isCollapsed ? 'justify-center p-[10px]' : 'py-2.5 px-3'}`;
}

export function eventSubLinkClass(isActive) {
  return `text-[13px] py-1.5 px-2 rounded-md transition-all duration-200 ${
    isActive
      ? 'text-accent font-semibold bg-accent/5'
      : 'text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'
  }`;
}

export function eventTabActive(location, pathPart, tab, isDefault = false) {
  if (!location.pathname.includes(pathPart)) return false;
  const current = new URLSearchParams(location.search).get('tab');
  if (Array.isArray(tab)) return tab.includes(current);
  if (isDefault) return current === tab || !current;
  return current === tab;
}

export function isCommunicationNavPath(pathname) {
  return pathname.includes('/communication') || pathname.includes('/email-templates');
}
