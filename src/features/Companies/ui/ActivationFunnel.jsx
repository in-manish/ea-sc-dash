import { formatCount, isWeakestStep } from '../domain/exhibitorEngagement';
import ActivationFunnelChart from './ActivationFunnelChart';
import ActivationFunnelStep from './ActivationFunnelStep';

export default function ActivationFunnel({ title, steps, totalExhibitors }) {
  if (!steps.length) {
    return (
      <section className="bg-bg-primary border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-text-primary m-0">{title}</h2>
        <p className="mt-4 mb-0 text-sm text-text-secondary">No activation steps yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-bg-primary border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-text-primary m-0">{title}</h2>
        <p className="m-0 mt-1 text-sm text-text-secondary">
          Share of {formatCount(totalExhibitors)} parent exhibitors who completed each
          action. Steps are independent — a later step can be higher than an earlier one.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        {steps.map((step) => (
          <ActivationFunnelStep
            key={step.key}
            step={step}
            totalExhibitors={totalExhibitors}
            isWeakest={isWeakestStep(step, steps)}
          />
        ))}
      </div>

      <ActivationFunnelChart steps={steps} totalExhibitors={totalExhibitors} />
    </section>
  );
}
