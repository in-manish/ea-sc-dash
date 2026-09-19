---
name: screen-urls
description: Requires every dashboard screen, tab, and in-page view to have a URL that opens that screen and survives refresh. Use when adding pages, tabs, nested views, or fixing refresh that resets to the first tab.
---

# Screen URLs

Every visible screen must be addressable. Refresh, a pasted link, and host resume (`LastPathTracker` saves `pathname + search`) must open the same screen.

## Rule

Do **not** store the active screen only in `useState`. Read it from the router.

| Kind | Put it in |
|------|-----------|
| Distinct page | path (`/event/:id/matchmaking`) |
| Tab / panel on a page | query (`?tab=mapping`) |
| Nested view on a tab | extra query (`?tab=exhibitors&exh_view=list`) |

## Implement tabs

Copy Communication / Companies / Matchmaking:

```jsx
const TABS = ['questions', 'exhibitor', 'mapping'];
const [searchParams, setSearchParams] = useSearchParams();
const requested = searchParams.get('tab');
const activeTab = TABS.includes(requested) ? requested : 'questions';

const setTab = (tab) => {
  const params = new URLSearchParams(searchParams);
  params.set('tab', tab);
  setSearchParams(params, { replace: true });
};
```

Tab buttons call `setTab(id)`. Invalid `tab` values fall back to the default.

Keep unrelated query keys when switching tabs (unless they belong only to the old tab).

## Do not

```jsx
// ❌ Refresh always returns to the first tab
const [activeTab, setActiveTab] = useState('questions');
onClick={() => setActiveTab(id)}
```

Deep links that force a tab (`?create=product`) must also set `tab` in the URL.

## After the change

- List the URL in `AI_FILE_MAP.yaml` `routes` and the feature README.
- Click the screen, refresh: the same screen must still be open.
