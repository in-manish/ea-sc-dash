import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { brandService } from '../../services/brandService';

const DEFAULT_WELCOME = 'Welcome to Exhibitor Portal';

const ExhibitorPortalLanding = () => {
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBrand = async () => {
            setLoading(true);
            setError(null);
            try {
                const host = window.location.hostname;
                const data = await brandService.getBrandByPortalHost(host);
                setBrand(data);
            } catch (err) {
                if (err.status === 404) {
                    setError('This exhibitor portal is not configured for this hostname.');
                } else if (err.status === 400) {
                    setError('Portal misconfiguration. Contact support.');
                } else {
                    setError(err.message || 'Unable to load portal.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadBrand();
    }, []);

    const landing = brand?.exhibitor_portal_landing;
    const welcomeTitle = landing?.welcome_title || DEFAULT_WELCOME;
    const brandLine = landing?.brand_line || [];

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <header className="border-b border-border bg-bg-secondary/30">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    {brand?.title && (
                        <p className="text-sm font-semibold text-text-secondary">{brand.title}</p>
                    )}
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 text-text-secondary">
                        <Loader2 size={40} className="animate-spin text-accent" />
                        <p className="text-sm font-medium">Loading portal…</p>
                    </div>
                ) : error ? (
                    <div className="max-w-md text-center space-y-4">
                        <div className="inline-flex p-4 rounded-full bg-danger/10 text-danger">
                            <AlertCircle size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-text-primary">{DEFAULT_WELCOME}</h1>
                        <p className="text-sm text-text-secondary">{error}</p>
                    </div>
                ) : (
                    <div className="max-w-2xl text-center space-y-8 animate-fade-in">
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
                            {welcomeTitle}
                        </h1>
                        {brandLine.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                                {brandLine.map((name, i) => (
                                    <React.Fragment key={name}>
                                        {i > 0 && (
                                            <span className="text-text-tertiary hidden sm:inline" aria-hidden="true">|</span>
                                        )}
                                        <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm font-semibold text-text-primary">
                                            {name}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        {brand?.description && (
                            <p className="text-text-secondary text-base max-w-lg mx-auto leading-relaxed">
                                {brand.description}
                            </p>
                        )}
                    </div>
                )}
            </main>

            {brand?.website && (
                <footer className="border-t border-border py-6 text-center">
                    <a
                        href={`https://${brand.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent font-medium hover:underline"
                    >
                        {brand.website}
                    </a>
                </footer>
            )}
        </div>
    );
};

export default ExhibitorPortalLanding;
