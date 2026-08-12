import { useEffect, useState } from 'react';
import { companyApi } from '../api/companyApi';

/** Flatten continent_countries into [{ key, name, flag }] for location select. */
export function useCompanyCountries(eventId, token, enabled = true) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !eventId || !token) return undefined;
    let active = true;
    setLoading(true);
    companyApi
      .getFilterOptions(eventId, token)
      .then((data) => {
        if (!active) return;
        const continent = data?.continent_countries || data?.data?.continent_countries || {};
        const list = [];
        Object.values(continent).forEach((group) => {
          (Array.isArray(group) ? group : []).forEach((c) => {
            if (c?.key || c?.name) {
              list.push({
                key: c.key || String(c.name).toLowerCase(),
                name: c.name || c.key,
                flag: c.flag || '',
              });
            }
          });
        });
        list.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(() => {
        if (active) setCountries([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [eventId, token, enabled]);

  return { countries, loading };
}
