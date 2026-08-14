import React from 'react';
import { productQuestionGroups } from '../domain/extractMatchmakingProductOptions';

const ProductMatchmakingGroupList = ({ questions = [] }) => (
  <div className="space-y-6">
    {questions.map((question) => (
      <div key={question.id} className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-bold text-text-primary">{question.title || 'Products'}</h3>
          <span className="text-[10px] font-mono text-text-tertiary">#{question.id}</span>
        </div>
        <div className="space-y-3">
          {productQuestionGroups(question).map((group, index) => (
            <div key={group.id || `${question.id}-${index}`} className="rounded-lg border border-border bg-bg-secondary/40 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-2">
                {group.name}
              </p>
              {group.products.length === 0 ? (
                <p className="text-xs text-text-tertiary">No products in this group yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {group.products.map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-bg-primary text-text-secondary"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ProductMatchmakingGroupList;
