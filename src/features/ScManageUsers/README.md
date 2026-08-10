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
| `ui/UserCardsSection.jsx` | Cards tab bodies |
| `ui/ManageUsersFilters.jsx` | Search + filters |
| `ui/ManageUsersResultsTable.jsx` | List table → navigates to detail |
| `ui/SavedCardsTab.jsx` | Saved contacts list |
| `ui/PendingCardsTab.jsx` | Paginated pending |
| `ui/SavedCardListItem.jsx` | Card list row |
| `ui/SavedCardDetail.jsx` | Nested card detail |
| `ui/CardRequestActivityTab.jsx` | Activity feed |
| `hooks/*` | List + cards data hooks |
| `api/userCardsApi.js` | Admin cards / pending / activity APIs |
