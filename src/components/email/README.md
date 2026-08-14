# EA Email (Communication)

Event organizer email templates under Communication → Email. Category Emails and Templates share the body editor and file import.

| Path | Role |
|------|------|
| `EmailCategoryTypes.jsx` | Category emails list + editor modal |
| `EmailTemplates.jsx` | Reusable templates list + editor modal |
| `EmailCampaigns.jsx` | Campaign list |
| `category/components/PreviewCanvas.jsx` | Category preview / edit canvas |
| `templates/components/TemplatePreviewCanvas.jsx` | Template preview / edit canvas |
| `templates/components/EmailTemplateFilters.jsx` | Event / name / type / status filters |
| `templates/domain/parseTemplateFilters.js` | Parse list `filters.events`, `template_types`, `names` |
| `templates/domain/contentVariables.js` | Extract `{{name}}` tokens → `content_variables` map |
| `templates/domain/buildEmailTemplatePayload.js` | Create/update body including `content_variables` |
| `templates/components/TemplateVariablePlaceholders.jsx` | Sidebar chips for body placeholders |
| `templates/hooks/usePlaceholderHighlight.js` | Hover / pin highlight between chips and body |
| `shared/placeholderHighlight.js` | Wrap/strip `{{token}}` marks and highlight CSS |
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

## Content variables

`{{name}}` tokens in the body (and subject) show as sidebar placeholders.
Create/update sends `content_variables: { name: "", event_name: "", ... }`.
Hover or click a chip to highlight every match in the body, and vice versa.
