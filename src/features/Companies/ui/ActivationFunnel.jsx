import ActivationFunnelStep from './ActivationFunnelStep';

export default function ActivationFunnel({ title, steps }) {
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
      <h2 className="text-lg font-bold text-text-primary m-0 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
        {steps.map((step) => (
          <ActivationFunnelStep key={step.key} step={step} />
        ))}
      </div>
    </section>
  );
}
