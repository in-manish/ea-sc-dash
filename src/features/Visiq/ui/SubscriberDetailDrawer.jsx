import { Mail, X } from 'lucide-react';
import { formatDateTime } from '../domain/formatDate';
import { formatPropValue } from '../domain/subscriberRow';
import {
  subscriberDisplayName,
  subscriberStatusLabel,
  subscriberStatusTone,
} from '../domain/subscriberStatus';
import { useSubscriberDetail } from '../hooks/useSubscriberDetail';
import VisiqStatusBadge from './VisiqStatusBadge';

export default function SubscriberDetailDrawer({
  token,
  subscriberId,
  onClose,
  onUnauthorized,
}) {
  const { subscriber, loading, error } = useSubscriberDetail({
    token,
    subscriberId,
    onUnauthorized,
  });
  const name = subscriberDisplayName(subscriber);
  const props = subscriber?.properties || [];
  const tags = subscriber?.tags || [];

  return (
    <div
      className="fixed inset-0 z-[1200] flex justify-end bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="visiq-sub-detail"
        className="w-full max-w-md h-full bg-bg-primary border-l border-border shadow-xl overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur border-b border-border px-5 py-3.5 flex items-center justify-between">
          <h3 id="visiq-sub-detail" className="text-sm font-semibold text-text-primary m-0">
            Contact details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1.5 rounded-md hover:bg-bg-secondary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {loading && <p className="text-sm text-text-secondary">Loading…</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
          {subscriber && (
            <>
              <header className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary m-0 tracking-tight">
                    {name || subscriber.email}
                  </h2>
                  <a
                    href={`mailto:${subscriber.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mt-1"
                  >
                    <Mail size={14} />
                    {subscriber.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <VisiqStatusBadge
                    label={subscriberStatusLabel(subscriber.status)}
                    tone={subscriberStatusTone(subscriber.status)}
                  />
                  <span className="text-xs text-text-tertiary">#{subscriber.id}</span>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-y border-border py-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-text-tertiary">Created</div>
                  <div className="text-text-primary mt-0.5">{formatDateTime(subscriber.created_at)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-text-tertiary">Updated</div>
                  <div className="text-text-primary mt-0.5">{formatDateTime(subscriber.updated_at)}</div>
                </div>
              </div>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary m-0 mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {tags.length === 0 && (
                    <span className="text-sm text-text-tertiary">None</span>
                  )}
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs px-2 py-1 rounded-md bg-bg-secondary text-text-secondary border border-border"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary m-0 mb-2">
                  Properties
                </h4>
                {props.length === 0 ? (
                  <p className="text-sm text-text-tertiary m-0">No properties</p>
                ) : (
                  <dl className="m-0 divide-y divide-border border border-border rounded-lg overflow-hidden">
                    {props.map((prop) => (
                      <div
                        key={prop.key}
                        className="flex justify-between gap-3 px-3 py-2.5 bg-bg-primary"
                      >
                        <dt className="text-sm text-text-secondary shrink-0">
                          {prop.label || prop.key}
                        </dt>
                        <dd className="text-sm text-text-primary text-right m-0 break-all">
                          {formatPropValue(prop.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
