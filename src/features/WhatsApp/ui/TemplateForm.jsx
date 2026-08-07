import React from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import {
    CATEGORY_OPTIONS,
    MSG91_VAR_TYPES,
    PROVIDER_OPTIONS,
    STATUS_CHOICES,
} from '../constants';
import { getStatusMeta } from '../domain/templateHelpers';

const labelClass = 'block text-[11px] font-bold text-text-tertiary mb-1.5 uppercase tracking-wider';
const inputClass =
    'w-full rounded-xl border border-border bg-bg-secondary px-3.5 py-2.5 text-sm text-text-primary font-medium outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all';
const inputErrorClass = 'border-danger focus:ring-danger/10 focus:border-danger';

const TemplateForm = ({
    formData,
    errors,
    isLoading,
    isEditing,
    detectedVariables,
    manualVariables,
    newVarName,
    onNewVarNameChange,
    onAddManualVariable,
    onRemoveManualVariable,
    onInputChange,
    onVariableChange,
    onSubmit,
    readOnly = false,
}) => {
    const statusMeta = getStatusMeta(formData.status);
    const allVars = [...detectedVariables, ...manualVariables];

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass} htmlFor="wa-provider">Provider</label>
                    <select
                        id="wa-provider"
                        name="provider"
                        value={formData.provider}
                        onChange={onInputChange}
                        disabled={readOnly}
                        className={inputClass}
                    >
                        {PROVIDER_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClass} htmlFor="wa-category">Category</label>
                    <select
                        id="wa-category"
                        name="category"
                        value={formData.category}
                        onChange={onInputChange}
                        disabled={readOnly}
                        className={inputClass}
                    >
                        {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass} htmlFor="wa-status">Status</label>
                <select
                    id="wa-status"
                    name="status"
                    value={formData.status || 'pending'}
                    onChange={onInputChange}
                    disabled={readOnly}
                    className={inputClass}
                >
                    {STATUS_CHOICES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                {statusMeta.hint && (
                    <p className="mt-1.5 text-xs text-text-tertiary">{statusMeta.hint}</p>
                )}
                {errors.status && (
                    <p className="text-xs text-danger mt-1.5 font-medium">{errors.status[0]}</p>
                )}
            </div>

            <div>
                <label className={labelClass} htmlFor="wa-name">Template name</label>
                <input
                    id="wa-name"
                    type="text"
                    name="template_name"
                    value={formData.template_name}
                    onChange={onInputChange}
                    disabled={readOnly}
                    className={`${inputClass} ${errors.template_name ? inputErrorClass : ''}`}
                    placeholder="e.g. Welcome Message"
                    required
                />
                {errors.template_name && (
                    <p className="text-xs text-danger mt-1.5 font-medium">{errors.template_name[0]}</p>
                )}
            </div>

            <div>
                <label className={labelClass} htmlFor="wa-description">Description</label>
                <textarea
                    id="wa-description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    disabled={readOnly}
                    rows={2}
                    className={`${inputClass} resize-y`}
                    placeholder="Optional note for your team (not sent to recipients)"
                />
            </div>

            {formData.provider === 'TWILIO' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-bg-secondary/40">
                    <div>
                        <label className={labelClass} htmlFor="wa-service-sid">Service SID</label>
                        <input
                            id="wa-service-sid"
                            type="text"
                            name="service_sid"
                            value={formData.service_sid}
                            onChange={onInputChange}
                            disabled={readOnly}
                            className={inputClass}
                            placeholder="MG…"
                        />
                    </div>
                    <div>
                        <label className={labelClass} htmlFor="wa-content-sid">Content SID</label>
                        <input
                            id="wa-content-sid"
                            type="text"
                            name="content_sid"
                            value={formData.content_sid}
                            onChange={onInputChange}
                            disabled={readOnly}
                            className={inputClass}
                            placeholder="HX…"
                        />
                    </div>
                </div>
            )}

            {formData.provider === 'MSG91' && (
                <div>
                    <label className={labelClass} htmlFor="wa-msg91">MSG91 template slug</label>
                    <input
                        id="wa-msg91"
                        type="text"
                        name="msg91_template_name"
                        value={formData.msg91_template_name}
                        onChange={onInputChange}
                        disabled={readOnly}
                        className={inputClass}
                        placeholder="template_slug"
                    />
                </div>
            )}

            <div>
                <label className={labelClass} htmlFor="wa-msg">Message text</label>
                <textarea
                    id="wa-msg"
                    name="msg_text"
                    value={formData.msg_text}
                    onChange={onInputChange}
                    disabled={readOnly}
                    rows={8}
                    className={`${inputClass} font-mono text-[13px] bg-bg-tertiary/40 resize-y`}
                    placeholder={'Hello {{1}}, welcome to {{2}}!'}
                    required
                />
                <p className="text-[11px] text-text-tertiary mt-1.5">
                    Use {'{{variable}}'} for dynamic fields. Wrap text in *asterisks* for bold.
                </p>
                {errors.msg_text && (
                    <p className="text-xs text-danger mt-1.5 font-medium">{errors.msg_text[0]}</p>
                )}
            </div>

            <div className="rounded-xl border border-border bg-bg-secondary/40 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                        Map variables
                    </h4>
                    {!readOnly && (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newVarName}
                                onChange={(e) => onNewVarNameChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        onAddManualVariable();
                                    }
                                }}
                                placeholder="Custom key (e.g. header_1)"
                                className="rounded-lg border border-border bg-bg-primary px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent text-text-primary w-[180px]"
                            />
                            <button
                                type="button"
                                onClick={onAddManualVariable}
                                disabled={!newVarName.trim()}
                                className="btn btn-sm btn-primary py-1.5 px-3 text-[10px] uppercase font-bold inline-flex items-center gap-1"
                            >
                                <Plus size={12} />
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {allVars.map((v) => {
                        const currentVar = formData.content_variables[v] || { type: 'text', value: '' };
                        const vartype = typeof currentVar === 'string' ? 'text' : (currentVar.type || 'text');
                        const varval = typeof currentVar === 'string' ? currentVar : (currentVar.value || '');
                        const isManual = manualVariables.includes(v);

                        return (
                            <div key={v} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                <span
                                    className="w-full sm:w-24 shrink-0 text-center text-[10px] font-bold text-accent bg-bg-primary px-2 py-2 rounded-lg border border-border truncate"
                                    title={v}
                                >
                                    {isManual ? v : `{{${v}}}`}
                                </span>
                                {formData.provider === 'MSG91' && (
                                    <select
                                        value={vartype}
                                        onChange={(e) => onVariableChange(v, 'type', e.target.value)}
                                        disabled={readOnly}
                                        className="w-full sm:w-[120px] shrink-0 rounded-xl border border-border bg-bg-primary px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-accent/15"
                                    >
                                        {MSG91_VAR_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                )}
                                <input
                                    type="text"
                                    value={varval}
                                    onChange={(e) => onVariableChange(v, 'value', e.target.value)}
                                    disabled={readOnly}
                                    placeholder={isManual ? 'e.g. badge_url' : 'e.g. name, event.name'}
                                    className="flex-1 min-w-[140px] rounded-xl border border-border bg-bg-primary px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent"
                                />
                                {isManual && !readOnly && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveManualVariable(v)}
                                        className="text-text-tertiary hover:text-danger p-1.5 rounded-lg hover:bg-danger/5 transition-colors"
                                        title="Remove custom variable"
                                        aria-label={`Remove ${v}`}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {allVars.length === 0 && (
                        <p className="text-xs text-text-tertiary text-center py-3">
                            No variables yet. Add {'{{1}}'} in the message, or a custom header key above.
                        </p>
                    )}
                </div>
                {errors.content_variables && (
                    <p className="text-xs text-danger mt-3 font-medium">{errors.content_variables[0]}</p>
                )}
            </div>

            {!readOnly && (
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full py-3.5 text-sm rounded-xl shadow-md shadow-accent/15 flex justify-center items-center gap-2 font-bold uppercase tracking-wider"
                >
                    {isLoading && <Loader2 className="animate-spin" size={18} />}
                    {isLoading
                        ? (isEditing ? 'Updating…' : 'Creating…')
                        : (isEditing ? 'Update template' : 'Create template')}
                </button>
            )}
        </form>
    );
};

export default TemplateForm;
