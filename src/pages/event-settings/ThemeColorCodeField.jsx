import React from 'react';
import { FormField, getInputClass } from './components/SharedComponents';
import { contrastTextOn, parseThemeHex, toColorPickerValue } from './domain/themeColorCode';

const PICKER_CLASS =
    'h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5 ' +
    '[&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 ' +
    '[&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0';

const ThemeColorCodeField = ({ eventData, handleInputChange, isFieldModified }) => {
    const raw = eventData.theme_color_code || '';
    const parsed = parseThemeHex(raw);
    const modified = isFieldModified('theme_color_code');
    const previewColor = parsed || '#94A3B8';
    const onPreview = contrastTextOn(previewColor);

    const setValue = (value) => {
        handleInputChange({ target: { name: 'theme_color_code', value } });
    };

    const handleBlur = () => {
        if (!raw.trim()) return;
        if (parsed && parsed !== raw) setValue(parsed);
    };

    return (
        <FormField
            label="Theme Color Code"
            description="Brand accent hex (theme_color_code). Pick a color or type #RRGGBB."
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        aria-label="Pick theme color"
                        value={toColorPickerValue(raw)}
                        onChange={(e) => setValue(parseThemeHex(e.target.value) || e.target.value)}
                        className={PICKER_CLASS}
                    />
                    <input
                        type="text"
                        name="theme_color_code"
                        value={raw}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        spellCheck={false}
                        placeholder="#ED1D52"
                        className={`${getInputClass('theme_color_code', modified)} font-mono uppercase`}
                    />
                </div>
                <ThemeColorPreview
                    parsed={parsed}
                    previewColor={previewColor}
                    onPreview={onPreview}
                />
            </div>
        </FormField>
    );
};

const ThemeColorPreview = ({ parsed, previewColor, onPreview }) => (
    <div className="rounded-xl border border-border overflow-hidden bg-bg-secondary">
        <div
            className="h-14 flex items-center justify-between px-4"
            style={{ backgroundColor: previewColor, color: onPreview }}
        >
            <span className="text-sm font-semibold">Event portal preview</span>
            <span className="text-[11px] font-mono font-bold tracking-wide">
                {parsed || 'No color'}
            </span>
        </div>
        <div className="p-3 flex flex-wrap items-center gap-2.5">
            <button
                type="button"
                tabIndex={-1}
                className="px-3 py-1.5 rounded-md text-xs font-semibold border-none cursor-default"
                style={{ backgroundColor: previewColor, color: onPreview }}
            >
                Primary button
            </button>
            <span
                className="text-xs font-semibold"
                style={{ color: parsed || 'var(--color-text-secondary)' }}
            >
                Accent text
            </span>
            <span
                className="w-6 h-6 rounded-full border border-border shrink-0"
                style={{ backgroundColor: previewColor }}
                aria-hidden
            />
        </div>
    </div>
);

export default ThemeColorCodeField;
