# EA Email (Communication)

Event organizer email templates under Communication → Email. Category Emails and Templates share the body editor and file import.

| Path | Role |
|------|------|
| `EmailCategoryTypes.jsx` | Category emails list + editor modal |
| `EmailTemplates.jsx` | Reusable templates list + type picker + editor modal |
| `templates/constants/emailTemplateTypes.js` | EA `EmailTemplateType` catalog (incl. exhibitor attendee welcome) |
| `templates/domain/buildNewEmailTemplate.js` | Prefill name/subject/body/type for a selected type |
| `templates/components/CreateTemplateTypePicker.jsx` | Create-by-type for the current event |
| `templates/components/TemplateTypeField.jsx` | Known-type dropdown + custom slug |
| `templates/hooks/useEmailTemplateEditor.js` | View / create-from-type / save / delete |
| `templates/components/EmailTemplateList.jsx` | Template grid/list (created date en-IN/IST) |
| `templates/components/TemplateRowActions.jsx` | ⋯ opens actions modal |
| `templates/components/TemplateActionsModal.jsx` | View template, Delete |
| `EmailConfigTabs.jsx` | Category / Templates / History/Scheduled |
| `emailConfigTabs.js` | Email tab ids, copy, URL parse |
| `EmailCampaigns.jsx` | Re-export of `src/features/EmailCampaigns` |
| `category/components/PreviewCanvas.jsx` | Category preview / edit canvas |
| `templates/components/TemplatePreviewCanvas.jsx` | Template preview / edit canvas |
| `templates/components/EmailTemplateFilters.jsx` | Event / name / type / status filters |
| `templates/domain/parseTemplateFilters.js` | Parse list `filters.events`, `template_types`, `names` |
| `templates/domain/contentVariables.js` | Extract `{{name}}` tokens → `content_variables` map |
| `templates/domain/buildEmailTemplatePayload.js` | Create/update body including `content_variables` |
| `templates/components/TemplateSupportingVariables.jsx` | Catalog of `supporting_variables` with descriptions |
| `templates/components/InviteeTypePlaceholderForm.jsx` | Title → `invitee_<title_slug>_link` (session persisted) |
| `templates/domain/inviteeLinkPlaceholder.js` | Same slug as EA `invitee_count_slug_from_title` |
| `templates/hooks/useInviteeLinkPlaceholders.js` | Session storage for generated invitee link tokens |
| `templates/hooks/usePlaceholderHighlight.js` | Hover / pin highlight between chips and body |
| `shared/placeholderHighlight.js` | Wrap/strip `{{token}}` marks and highlight CSS |
| `shared/insertAtCaret.js` | Jodit save/restore + overlay caret for visual insert |
| `shared/EmailPreviewFrame.jsx` | Preview iframe with placeholder highlight |
| `shared/EmailBodyEditor.jsx` | Visual / Code body editor |
| `shared/EmailFileImport.jsx` | Browse HTML/txt and insert into body |
| `shared/readHtmlFile.js` | Read file, extract `<body>` + `<style>` |

## File import

- Edit a category email or template → **Browse file** in the body toolbar.
- Accepts `.html`, `.htm`, `.txt` (max 1 MB).
- Full HTML documents: extract `<style>` blocks and `<body>` inner HTML into the body.
- Append (default when body has content) or Replace.

## Template list filters

List response `filters`: `{ events: [id], template_types: [unique], names: [] }`.
Dropdowns for Event, Name, and Template Type. Query: `event`, `name` (also `email_name`), `template_type`.
Type options always include known EA types (e.g. `exhibitor_attendee_added_welcome`), merged with values from the API.
Row ⋯ opens View template (editor modal) or Delete.

## Create by type

Create Template opens a type picker. EA allows one row per `(template_type, event)`.
Picking a known type prefills `template_type`, name, subject, description, and starter `{{placeholders}}`.
If that type already exists for the event, the picker opens the existing template instead.

## Content variables

`{{name}}` tokens in the body (and subject) show as sidebar placeholders.
Create/update sends `content_variables: { name: "", event_name: "", ... }`.
Hover or click a chip to highlight every match in the body, and vice versa.
`supporting_variables` (name + description) lists tokens you can insert at the cursor while editing.
Click in the body, then pick a catalog token to insert at that spot (visual uses Jodit selection markers; a caret overlay shows the insert point).
Invitee type titles generate `invitee_<title_slug>_link` (EA slug: lowercased, spaces → `_`). Tokens persist in session storage for the event until logout/tab clear. Add while editing also inserts at the cursor.

## History / Scheduled campaigns

See `src/features/EmailCampaigns/README.md`. EA list/detail/recipients only support `page` (10 per page); there is no search or status filter on those endpoints.
