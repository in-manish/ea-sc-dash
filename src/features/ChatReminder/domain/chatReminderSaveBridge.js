let saveFn = null;

/** ChatReminderSettings registers its save while mounted on Meeting Diary. */
export function setChatReminderSave(fn) {
  saveFn = fn;
  return () => {
    if (saveFn === fn) saveFn = null;
  };
}

/** Called from Event Settings Save Changes. No-op if the tab is not mounted. */
export async function saveChatReminderIfNeeded() {
  if (!saveFn) return;
  await saveFn();
}
