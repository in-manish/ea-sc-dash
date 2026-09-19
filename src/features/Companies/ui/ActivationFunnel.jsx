import ActivationFunnelStep from './ActivationFunnelStep';
import LoggedInPocsCard from './LoggedInPocsCard';

export default function ActivationFunnel({
  title,
  steps,
  totalExhibitors,
  loggedInPocs,
  loggedInExhibitorPocs,
  loggedInCoexhibitorPocs,
}) {
  if (!steps.length) {
    return (
      <section className="bg-bg-primary border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-text-primary m-0">{title}</h2>
        <p className="mt-4 mb-0 text-sm text-text-secondary">No activation steps yet.</p>
      </section>
    );
  }

  const cards = steps.flatMap((step, index) => {
    const stepCard = (
      <ActivationFunnelStep key={step.key} step={step} totalExhibitors={totalExhibitors} />
    );
    if (index !== 0) return [stepCard];
    return [
      stepCard,
      <LoggedInPocsCard
        key="logged-in-pocs"
        loggedInPocs={loggedInPocs}
        loggedInExhibitorPocs={loggedInExhibitorPocs}
        loggedInCoexhibitorPocs={loggedInCoexhibitorPocs}
        totalExhibitors={totalExhibitors}
      />,
    ];
  });

  return (
    <section className="bg-bg-primary border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-text-primary m-0 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 xl:gap-8">
        {cards}
      </div>
    </section>
  );
}
