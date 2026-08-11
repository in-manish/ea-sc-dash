import React from 'react';
import { Loader2, Building2 } from 'lucide-react';

const CoExhibitorsTable = ({ companies, loading, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          {['Company', 'Details', 'Stall', 'Category', 'Badges'].map((h) => (
            <th
              key={h}
              className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center p-12 text-text-secondary">
              <Loader2 className="animate-spin text-accent mx-auto" size={24} />
            </td>
          </tr>
        ) : companies.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center p-12 text-text-secondary text-sm">
              No co-exhibitors registered under this exhibitor.
            </td>
          </tr>
        ) : (
          companies.map((company) => (
            <tr
              key={company.id}
              className="cursor-pointer transition-colors duration-200 hover:bg-bg-secondary [&>td]:border-b [&>td]:border-border group"
              onClick={() => onRowClick(company.id)}
            >
              <td className="py-4 px-6 align-middle group-last:border-b-0">
                <div className="flex items-center gap-4">
                  {company.company_logo ? (
                    <img
                      src={company.company_logo}
                      alt={company.company_name}
                      className="w-10 h-10 object-contain bg-white rounded-sm border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-bg-tertiary rounded-sm flex items-center justify-center text-text-secondary">
                      <Building2 size={16} />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-text-primary text-sm flex items-center gap-2">
                      {company.company_name}
                      <span className="text-[10px] font-mono text-text-tertiary opacity-40">
                        #{company.id}
                      </span>
                    </div>
                    {company.company_slug && (
                      <div className="text-xs text-text-tertiary mt-0.5">
                        {company.company_slug}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 align-middle group-last:border-b-0">
                <div className="flex flex-col gap-1 text-[0.8125rem] text-text-secondary">
                  <div>OBF: {company.obf_number || '-'}</div>
                  {company.sales_person && <div>Sales: {company.sales_person}</div>}
                </div>
              </td>
              <td className="py-4 px-6 align-middle group-last:border-b-0">
                <div className="font-mono font-semibold bg-bg-tertiary py-1 px-2 rounded-sm inline-block text-[0.8125rem] text-text-primary">
                  {company.stall_number || '-'}
                </div>
              </td>
              <td className="py-4 px-6 align-middle group-last:border-b-0">
                {company.category ? (
                  <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 tracking-wide">
                    {company.category}
                  </span>
                ) : (
                  <span className="text-text-tertiary text-sm">-</span>
                )}
              </td>
              <td className="py-4 px-6 align-middle group-last:border-b-0">
                <div className="flex flex-col gap-1 text-xs text-text-secondary">
                  <span>Limit: {company.badge_limit ?? '-'}</span>
                  <span>Issued: {company.badge_issued ?? '-'}</span>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default CoExhibitorsTable;
