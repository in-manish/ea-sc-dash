import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, GitMerge, Package } from 'lucide-react';
import { useMatchmakingProductOptions } from '../hooks/useMatchmakingProductOptions';
import ProductMatchmakingGroupList from './ProductMatchmakingGroupList';

const ProductMatchmakingPanel = ({ eventId, token }) => {
  const navigate = useNavigate();
  const { productQuestions, hasProductQuestion, loading, error } = useMatchmakingProductOptions(
    eventId,
    token,
    Boolean(eventId && token),
  );

  const goCreate = () => navigate(`/event/${eventId}/matchmaking?create=product`);
  const goEdit = (questionId) => navigate(`/event/${eventId}/matchmaking?question=${questionId}`);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-tertiary py-12 justify-center">
        <Loader2 size={16} className="animate-spin" />
        Loading product matchmaking…
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-danger p-4">{error}</p>;
  }

  if (!hasProductQuestion) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-bg-secondary/40 p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
          <Package size={22} />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-primary">No product matchmaking yet</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
            This event has no Product matchmaking question. Create one with product groups prefilled, then exhibitors can pick products.
          </p>
        </div>
        <button type="button" className="btn btn-primary inline-flex items-center gap-1.5" onClick={goCreate}>
          <Plus size={16} />
          Create product matchmaking
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-sm btn-secondary inline-flex items-center gap-1.5"
          onClick={() => goEdit(productQuestions[0]?.id)}
        >
          <GitMerge size={14} />
          Edit in Matchmaking
        </button>
      </div>
      <ProductMatchmakingGroupList questions={productQuestions} />
    </div>
  );
};

export default ProductMatchmakingPanel;
