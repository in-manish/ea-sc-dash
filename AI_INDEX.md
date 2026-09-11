# AI Index — EA SC Dash

React organizer dashboard for event operations (attendees, companies, agenda, etc.).

**Canonical project map** (with `AI_FILE_MAP.yaml`). Do not add a third map file.

**How to use (mandatory):** Consult this index and `AI_FILE_MAP.yaml` *before* exploring the repo. Open the listed feature/task files. After you add, move, or rename modules/files, update this index, the YAML map, and `src/features/<Feature>/README.md` in the same change. Skill: `.agents/skills/project-map/SKILL.md`.

## Entry points

- `src/App.jsx` — routes; bare host (no `/ea`|`/sc`) resumes an existing token
- `src/layouts/EventLayout.jsx` — event shell / nav
- `src/services/` — HTTP clients
- `src/utils/formatDateTime.js` — dashboard dates (`en-IN`, `Asia/Kolkata`)
- `src/contexts/authSession.js` — token restore, last path, landing URL
- `src/contexts/useCrossTabAuthSync.js` — logout in one tab signs out the others
- `src/components/alert/` — themed app alert/confirm (`useAlert`)
- `src/components/imageEditor/` — reusable crop/resize/web-optimize modal for any image upload (`useImageEditor` + `ImageEditorProvider`)

## Feature map

| Feature | Path | Notes |
|---------|------|-------|
| Agenda | `src/features/Agenda/` | List + flat edit for speakers/moderators |
| Attendees | `src/features/Attendees/` | List, create, edit badge, WhatsApp, email drafts, e-badge, report, bulk CSV upload + dry-run validator, event upload history (Attendees tab) |
| Companies | `src/features/Companies/` | EA list (sort) + create/edit/detail + portal checklist + reminder tab + exhibitor CSV report + engagement funnel + engagement report CSV + company CSV upload history (Uploads page Companies tab) |
| ManageUsers | `src/features/ManageUsers/` | Staff users / permissions |
| ScManageUsers | `src/features/ScManageUsers/` | SC admin users + saved cards |
| ScAuth / Profile | `src/features/ScAuth/`, `src/features/ScProfile/` | SC ADMIN login gate + profile |
| ScEmailTemplates | `src/features/ScEmailTemplates/` | SC admin list; EA-like manage/edit modal |
| WhatsApp | `src/features/WhatsApp/` | Communication WhatsApp templates: archive (not delete), Active/Archived list |
| EaEmail | `src/components/email/` | Communication Email: category + templates; browse HTML into body |
| EmailCampaigns | `src/features/EmailCampaigns/` | History/Scheduled tab; row click or hover View details; hover View recipients; recipient hover View attendee |
| Matchmaking | `src/features/Matchmaking/` | GET 404 = create/copy; 200 = editor only |
| MeetingStats | `src/features/MeetingStats/` | Organizer meeting stats by event × attendee type (GET) + email CSV (POST) |
| Visiq | `src/features/Visiq/` | Tenant subscriber CRM: list/detail + CSV/Excel import jobs |

## Common tasks → files

| Task | Start here |
|------|------------|
| Event settings / theme color | `src/pages/event-settings/ThemeColorCodeField.jsx` (`theme_color_code`) |
| Event settings / support email | `src/pages/event-settings/CommunicationSettings.jsx` (`support_email`) |
| Event settings / sender profile pic | `src/pages/event-settings/SenderDefaultProfilePicField.jsx` (`sender_default_profile_pic`) |
| Event settings / branding images | `src/pages/event-settings/EventBrandingImages.jsx` + `EventImageUploadField.jsx` (`/event/:id/settings?tab=images`); size/dimensions + green **Web optimized** chip; **Edit image** opens the crop modal on the current file/URL; `domain/eventImageFields.js` (`meta_logo` first, then `logo`, `logo2`, …) `editorConfig` |
| Reusable crop/resize/web-optimize image upload | `src/components/imageEditor/` (`useImageEditor` + `ImageEditorModal`) — independent crop, compression slider, target KB, dimensions, web/mobile hints, live preview |
| Edit attendee / badge | `src/features/Attendees/ui/EditAttendeeModal.jsx` + `api/attendeeApi.js` + `domain/editAttendeeForm.js` |
| Attendee list row actions | `src/features/Attendees/ui/AttendeeTableRowMenu.jsx` + `AttendeeTableRow.jsx` |
| Attendee type email / SMS drafts | `src/pages/AttendeeTypes.jsx` + `EmailInvitationDraft.jsx` + `BadgeEmailVariablesRail.jsx` (badge tokens, `tv_referral_link` / `{title_slug}_referral_link`, calendar hrefs) |
| List attendee type email drafts | `ui/AttendeeSelectionBar.jsx` + `hooks/useAttendeeTypeEmails.js` + `api/attendeeTypeEmailsApi.js` |
| Send attendee emails | `ui/AttendeeEmailDraftsModal.jsx` (Badge Email + Categories Email toggles) + `hooks/useAttendeeTypeEmails.js` + `hooks/useCategoryTypeEmails.js` |
| Active badge status / create | `ui/ActiveBadgeToolbar.jsx` + `hooks/useActiveBadgeActions.js` + `api/activeBadgeApi.js` |
| Bulk attendee CSV upload + dry-run validate | `ui/AttendeeUploadModal.jsx` + `ui/AttendeeUploadRowIssues.jsx` + `hooks/useAttendeeUpload.js` + `api/attendeeUploadApi.js` (create-flow only, no replicate/update by Reg ID) |
| Event upload history (attendee + company tabs) | `src/pages/AttendeeUploads.jsx` + `ui/UploadsTabs.jsx` + `ui/AttendeeUploadHistoryPanel.jsx` + `ui/CompanyUploadHistoryPanel.jsx` + `src/components/uploadHistory/` |
| Create EA company / co-exhibitor | `src/features/Companies/ui/CreateCompanyPage.jsx` + `api/companyApi.js` |
| Edit EA company | `src/features/Companies/ui/EditCompanyPage.jsx` + `domain/buildCompanyPatchFormData.js` |
| Company Detail + Setup Progress | `src/features/Companies/ui/CompanyDetailsPage.jsx` + `SetupProgressSection.jsx` |
| Exhibitor overview / checklist | `api/companyApi.js` (`getExhibitorOverview`) + `hooks/useExhibitorOverview.js` |
| Checklist Reminder tab | `src/features/Companies/ui/ChecklistReminderTab.jsx` + `api/checklistReminderApi.js` |
| Checklist remind + progress poll | `hooks/useSetupChecklistRemind.js` + `ui/RemindSendProgress.jsx` |
| Reset exhibitor POC password | `src/features/Companies/ui/ExhibitorPasswordResetControl.jsx` + attendee bar: `ui/AttendeeSelectionBar.jsx` (single POC) |
| Bulk lock / feature companies | `src/features/Companies/ui/ExhibitorListActionsBar.jsx` + `ExhibitorListRowMenu.jsx` + `api/companyApi.js` (`bulkAction`) |
| Download / email exhibitor CSV report | `ui/CompaniesReportsMenu.jsx` + `ui/ExhibitorReportModal.jsx` + `hooks/useExhibitorReport.js` + `api/exhibitorReportApi.js` |
| Company Report metrics modal | `ui/CompanyReportModal.jsx` + `src/components/companies/CompanyComprehensiveReportPanel.jsx` + `CompanyReportMetricRow.jsx` |
| Exhibitor Engagement tab | `ui/ExhibitorEngagementTab.jsx` + `hooks/useExhibitorEngagement.js` + `api/exhibitorEngagementApi.js` |
| Download / email engagement report | `ui/ExhibitorEngagementReportModal.jsx` + `hooks/useExhibitorEngagementReport.js` + `api/exhibitorEngagementApi.js` (`format=csv` / `send_to_emails` / `include_matchmaking_questions` / `include_login_info`) |
| Exhibitor list sort | `domain/companyListSort.js` + `ui/ExhibitorListToolbar.jsx` + `ui/ExhibitorListActionsBar.jsx` |
| Company FormData / errors | `src/features/Companies/domain/buildCompanyFormData.js`, `parseCompanyError.js` |
| Agenda list / edit session | `src/features/Agenda/ui/AgendaListPage.jsx`, `AgendaEditPage.jsx` (`force_attendance` block slot) |
| Agenda API create/update | `src/services/agendaService.js` + `domain/buildAgendaFormData.js` |
| Speaker/moderator payload shape | `src/features/Agenda/domain/normalizePeople.js` |
| SC manage users / detail page | `src/features/ScManageUsers/ui/UserDetailsPage.jsx`, `ManageUsersPage.jsx` |
| SC ADMIN login / profile | `src/features/ScAuth/domain/scLoginUser.js`, `src/features/ScProfile/ui/ScProfilePage.jsx` |
| Auth restore / host URL | `src/contexts/authSession.js`, `src/storage/webStorage.js`, `src/App.jsx`, `src/components/ProtectedRoute.jsx` |
| Auth logout / other tabs | `src/contexts/useCrossTabAuthSync.js` + `AuthContext.jsx` + `webStorage.js` (`discardTabSessionIfLoggedOut`) |
| SC user pending requests | `src/features/ScManageUsers/ui/PendingCardsTab.jsx`, `hooks/useUserPendingCards.js` |
| SC user card activity | `src/features/ScManageUsers/ui/CardRequestActivityTab.jsx`, `hooks/useUserCardRequests.js` |
| SC saved cards Active/Archived | `src/features/ScManageUsers/ui/SavedCardsTab.jsx`, `hooks/useUserSavedCards.js` |
| SC restore / permanent delete card | `src/features/ScManageUsers/hooks/useSavedCardMutations.js`, `api/userCardsApi.js` |
| SC email templates | `src/features/ScEmailTemplates/ui/EmailTemplatesPage.jsx` + `api/emailTemplateApi.js` |
| SC email template create/edit content | `ui/EmailTemplateEditorLayout.jsx` + `EmailTemplatePreviewCanvas.jsx` + `EmailTemplateFormModalShell.jsx` |
| EA category / template body import | `src/components/email/shared/EmailBodyEditor.jsx` + `EmailFileImport.jsx` + `readHtmlFile.js` |
| Themed alert / confirm | `src/components/alert/AlertModal.jsx` + `src/contexts/AlertContext.jsx` (`useAlert`) |
| WhatsApp templates archive | `src/features/WhatsApp/hooks/useWhatsAppTemplateList.js` + `api/whatsappTemplateApi.js` |
| Email campaign history / scheduled | `src/features/EmailCampaigns/ui/EmailCampaignsPage.jsx` + `ui/CampaignListRow.jsx` (Date: Created + Updated) + `hooks/useEmailCampaignList.js` (`count` + list) + `ui/CampaignRowActions.jsx` |
| Dashboard datetime (en-IN, IST) | `src/utils/formatDateTime.js` + EmailCampaigns `domain/campaignHelpers.js` (`formatCampaignDate`, `campaignDateLines`) |
| EA template list filters | `src/components/email/templates/domain/parseTemplateFilters.js` + `EmailTemplateFilters.jsx` |
| EA template create by type | `templates/constants/emailTemplateTypes.js` + `CreateTemplateTypePicker.jsx` + `buildNewEmailTemplate.js` |
| EA template row actions | `src/components/email/templates/components/TemplateActionsModal.jsx` + `TemplateRowActions.jsx` + `EmailTemplates.jsx` |
| EA template content_variables | `src/components/email/templates/domain/contentVariables.js` + `TemplateSupportingVariables.jsx` + `usePlaceholderHighlight.js` |
| EA invitee type placeholders | `InviteeTypePlaceholderForm.jsx` + `inviteeLinkPlaceholder.js` + `useInviteeLinkPlaceholders.js` |
| Event settings AR tax list | `src/pages/event-settings/exhibitorPortalDefaults.js` + `ArTaxList.jsx` + `useAdditionalRequirement.js` |
| Event settings / exhibitor meeting diary | `src/pages/event-settings/CompanyAccessControlsSection.jsx` + `exhibitorPortalDefaults.js` (`exhibitor_portal_data.meeting_diary.is_meeting_option_active`) |
| Event settings / complimentary invitee links | `src/pages/event-settings/ComplimentaryInviteeLinkItem.jsx` (`is_active` enable/disable, `is_complementary`) |
| Matchmaking questions / copy | `src/features/Matchmaking/ui/MatchmakingQuestions.jsx` + `api/matchmakingFormApi.js` |
| Meeting stats report | `src/features/MeetingStats/ui/MeetingStatsReportTab.jsx` + `api/meetingStatsReportApi.js` |
| Visiq subscribers / imports | `src/features/Visiq/ui/VisiqPage.jsx` + `api/importApi.js` (preview/download) + `hooks/useImportFileActions.js` |

## Constraints

- Max **200 lines** per source file
- Feature code under `src/features/<Name>/`; thin pages in `src/pages/`
