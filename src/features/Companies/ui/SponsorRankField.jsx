const fieldClass =
  'w-full py-2.5 px-3.5 border border-yellow-300 rounded-md text-sm bg-white outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200';

/** Top-of-form control for sponsored companies. */
export default function SponsorRankField({ form, setField }) {
  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 space-y-2">
      <p className="text-xs font-semibold text-yellow-900 uppercase tracking-wide m-0">
        Sponsored company
      </p>
      <div className="space-y-1.5 max-w-xs">
        <label className="text-xs font-medium text-text-secondary" htmlFor="sponsor-rank">
          Sponsor rank
        </label>
        <input
          id="sponsor-rank"
          className={fieldClass}
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={form.sponsor_rank}
          onChange={(e) => setField('sponsor_rank', e.target.value)}
          placeholder="Blank if not sponsored"
        />
        <p className="text-xs text-yellow-900/80 m-0">
          Positive whole number. Sponsored companies are highlighted on the company list.
        </p>
      </div>
    </div>
  );
}
