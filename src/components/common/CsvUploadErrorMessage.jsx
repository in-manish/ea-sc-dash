/**
 * Parses the backend's "Missing header(s): ... Unexpected header(s): ..." CSV
 * header-validation error into structured parts. Returns null if the message
 * doesn't match that shape, so callers can fall back to showing it as plain text.
 */
function parseHeaderError(message) {
    if (!message) return null;

    const missingMatch = message.match(/Missing header\(s\):\s*([^.]+)\./i);
    const unexpectedMatch = message.match(/Unexpected header\(s\):\s*([^.]+?)\.?\s*$/i);
    if (!missingMatch && !unexpectedMatch) return null;

    const splitList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

    const missing = missingMatch ? splitList(missingMatch[1]) : [];
    const unexpected = unexpectedMatch
        ? splitList(unexpectedMatch[1]).map((item) => {
            const m = item.match(/^'([^']+)'(?:\s*\(did you mean '([^']+)'\?\))?$/i);
            return m ? { name: m[1], suggestion: m[2] || null } : { name: item, suggestion: null };
        })
        : [];

    return { missing, unexpected };
}

function HeaderChip({ children }) {
    return (
        <code className="text-[11px] font-mono bg-status-danger/10 text-status-danger px-1.5 py-0.5 rounded">
            {children}
        </code>
    );
}

function JoinedChips({ items, getKey, render }) {
    return items.map((item, idx) => (
        <span key={getKey(item)}>
            {idx > 0 && ', '}
            {render(item)}
        </span>
    ));
}

/** Renders a CSV-upload error message, formatting header-mismatch errors into readable lines. */
export default function CsvUploadErrorMessage({ message }) {
    const parsed = parseHeaderError(message);
    if (!parsed) return <span>{message}</span>;

    return (
        <div className="space-y-1">
            <p className="font-medium">CSV column headers don&apos;t match the expected format.</p>
            {parsed.missing.length > 0 && (
                <p>
                    Missing: <JoinedChips items={parsed.missing} getKey={(h) => h} render={(h) => <HeaderChip>{h}</HeaderChip>} />
                </p>
            )}
            {parsed.unexpected.length > 0 && (
                <p>
                    Unexpected:{' '}
                    <JoinedChips
                        items={parsed.unexpected}
                        getKey={(h) => h.name}
                        render={(h) => (
                            <>
                                <HeaderChip>{h.name}</HeaderChip>
                                {h.suggestion && (
                                    <>
                                        {' '}
                                        (did you mean <HeaderChip>{h.suggestion}</HeaderChip>?)
                                    </>
                                )}
                            </>
                        )}
                    />
                </p>
            )}
        </div>
    );
}
