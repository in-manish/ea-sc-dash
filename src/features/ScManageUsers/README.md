# ScManageUsers

SC admin Manage Users.

| Path | Role |
|------|------|
| `ui/ManageUsersPage.jsx` | List page (`/users/manage`) |
| `ui/UserDetailsPage.jsx` | Full-page detail (`/users/manage/:userId`) |
| `ui/UserDetailsHeader.jsx` | Back + identity + Edit (CompanyDetails-style) |
| `ui/UserDetailsInfoGrid.jsx` | 2×2 overview cards |
| `ui/UserDetailsCardsSection.jsx` | Lower Saved / Pending / Activity tabs |
| `ui/UserProfileEditForm.jsx` | Edit mode on detail page |
| `ui/UserCardsSection.jsx` | Cards tab bodies + delete confirm |
| `ui/ManageUsersFilters.jsx` | Search + filters |
| `ui/ManageUsersResultsTable.jsx` | List table → navigates to detail |
| `ui/SavedCardsTab.jsx` | Active / Archived saved contacts |
| `ui/SavedCardsScopeToggle.jsx` | Active ↔ Archived switch |
| `ui/PendingCardsTab.jsx` | Paginated pending |
| `ui/SavedCardListItem.jsx` | Card list row |
| `ui/SavedCardDetail.jsx` | Nested card detail |
| `ui/SavedCardDetailActions.jsx` | Restore / permanent delete |
| `ui/PermanentDeleteCardModal.jsx` | Type DELETE to confirm |
| `ui/CardRequestActivityTab.jsx` | Activity feed |
| `hooks/useUserSavedCards.js` | Active or `?archived=1` list |
| `hooks/useSavedCardMutations.js` | Restore + permanent delete |
| `hooks/*` | List + cards data hooks |
| `api/userCardsApi.js` | Admin cards / pending / activity APIs |
| `domain/savedCardHelpers.js` | card_id, delete reason labels, dates |

## Saved cards API

- `GET .../cards/` — active
- `GET .../cards/?archived=1` — archived (`deleted_at`, `delete_reason`)
- `POST .../cards/restore/` — `{ card_id }`
- `DELETE .../cards/` — `{ card_id }` (irreversible; confirm in UI)
