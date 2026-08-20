import { useEffect, useState } from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { whatsappService } from '../api/whatsappTemplateApi';
import { DEFAULT_FORM_DATA, TEMPLATE_STATUS } from '../constants';
import {
    buildContentVariablesPayload,
    detectVariablesInText,
    normalizeContentVariables,
} from '../domain/templateHelpers';

const emptyForm = () => ({ ...DEFAULT_FORM_DATA });

export default function useWhatsAppTemplateEditor(token) {
    const { showAlert } = useAlert();
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [detectedVariables, setDetectedVariables] = useState([]);
    const [manualVariables, setManualVariables] = useState([]);
    const [newVarName, setNewVarName] = useState('');

    useEffect(() => {
        const uniqueMatches = detectVariablesInText(formData.msg_text);
        setDetectedVariables(uniqueMatches);
        setFormData((prev) => {
            const nextVars = { ...prev.content_variables };
            [...uniqueMatches, ...manualVariables].forEach((v) => {
                if (!nextVars[v]) nextVars[v] = { type: 'text', value: '' };
                if (typeof nextVars[v] === 'string') {
                    nextVars[v] = { type: 'text', value: nextVars[v] };
                }
            });
            return { ...prev, content_variables: nextVars };
        });
    }, [formData.msg_text, manualVariables]);

    const reset = () => {
        setPreviewTemplate(null);
        setEditingId(null);
        setErrors({});
        setManualVariables([]);
        setNewVarName('');
        setFormData(emptyForm());
    };

    const populateFormFromTemplate = (template) => {
        const vars = normalizeContentVariables(template.content_variables);
        const detected = detectVariablesInText(template.msg_text || '');
        const manualVarsFound = Object.keys(vars).filter((k) => !detected.includes(k));
        setManualVariables(manualVarsFound);
        setFormData({
            template_name: template.template_name || '',
            category: template.category || 'attendee',
            description: template.description || '',
            status: (template.status || TEMPLATE_STATUS.PENDING).toLowerCase(),
            provider: template.provider || 'TWILIO',
            msg_text: template.msg_text || '',
            service_sid: template.service_sid || '',
            content_sid: template.content_sid || '',
            msg91_template_name: template.msg91_template_name || '',
            content_variables: vars,
        });
    };

    const startEdit = (template) => {
        setEditingId(template.id);
        setPreviewTemplate(template);
        setErrors({});
        populateFormFromTemplate(template);
    };

    const startPreview = (template) => {
        setPreviewTemplate(template);
        populateFormFromTemplate(template);
    };

    const handleAddManualVariable = () => {
        const name = newVarName.trim();
        if (!name || detectedVariables.includes(name) || manualVariables.includes(name)) return;
        setManualVariables((prev) => [...prev, name]);
        setNewVarName('');
    };

    const handleRemoveManualVariable = (varName) => {
        setManualVariables((prev) => prev.filter((v) => v !== varName));
        setFormData((prev) => {
            const nextVars = { ...prev.content_variables };
            delete nextVars[varName];
            return { ...prev, content_variables: nextVars };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleVariableChange = (variable, key, val) => {
        setFormData((prev) => {
            const currentVar = prev.content_variables[variable] || { type: 'text', value: '' };
            const updatedVar = typeof currentVar === 'string'
                ? { type: 'text', value: currentVar }
                : { ...currentVar };
            updatedVar[key] = val;
            return {
                ...prev,
                content_variables: { ...prev.content_variables, [variable]: updatedVar },
            };
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});
        try {
            const payload = {
                ...formData,
                status: formData.status || TEMPLATE_STATUS.PENDING,
                content_variables: buildContentVariablesPayload(formData.content_variables),
            };
            const response = editingId
                ? await whatsappService.updateTemplate(token, editingId, payload)
                : await whatsappService.createTemplate(token, payload);

            if (response.success || response.id) {
                await showAlert(
                    `Template ${editingId ? 'updated' : 'created'} successfully!`,
                    'success',
                );
                return true;
            }
            if (response.errors) {
                setErrors(response.errors);
                return false;
            }
            await showAlert(
                response.message || `Failed to ${editingId ? 'update' : 'create'} template`,
                'error',
            );
            return false;
        } catch (error) {
            console.error(error);
            await showAlert('An unexpected error occurred.', 'error');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const isActive = previewTemplate ? previewTemplate.is_active !== false : true;

    return {
        previewTemplate,
        editingId,
        errors,
        isSaving,
        formData,
        detectedVariables,
        manualVariables,
        newVarName,
        setNewVarName,
        isActive,
        reset,
        startEdit,
        startPreview,
        handleAddManualVariable,
        handleRemoveManualVariable,
        handleInputChange,
        handleVariableChange,
        submit,
    };
}
