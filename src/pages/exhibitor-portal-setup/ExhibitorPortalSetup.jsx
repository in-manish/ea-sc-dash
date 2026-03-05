import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { exhibitorService } from '../../services/exhibitorService';
import {
    Loader2, Plus, LayoutGrid, List, Search, Filter,
    AlertCircle, FileText, Settings as UtilsIcon
} from 'lucide-react';
import DocumentCard from './DocumentCard';
import DocumentModal from './DocumentModal';

const ExhibitorPortalSetup = () => {
    const { id: eventId } = useParams();
    const { token } = useAuth();

    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid, list

    useEffect(() => {
        if (eventId && token) {
            fetchDocuments();
        }
    }, [eventId, token]);

    const fetchDocuments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await exhibitorService.getExhibitorDocuments(eventId, token);
            // The API response structure matches the example: { id, event, documents: [...] }
            setDocuments(data.documents || []);
        } catch (err) {
            console.error('Fetch Documents Error:', err);
            setError('Failed to load exhibitor documents.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDocument = async (formData, docId) => {
        try {
            if (docId) {
                await exhibitorService.updateDocument(eventId, docId, token, formData);
                setMessage({ type: 'success', text: 'Document updated successfully.' });
            } else {
                await exhibitorService.createDocument(eventId, token, formData);
                setMessage({ type: 'success', text: 'Document created successfully.' });
            }
            fetchDocuments();
        } catch (err) {
            console.error('Save Document Error:', err);
            setMessage({ type: 'error', text: 'Failed to save document.' });
            throw err;
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        // Note: The user didn't provide a DELETE API, but usually there's one.
        // If not provided, I'll just show a message for now or check if UPDATE can be used to deactivate.
        // For now, I'll assume we can't truly delete without the endpoint, 
        // but maybe the user intended to manage via the list.
        setMessage({ type: 'error', text: 'Delete functionality not yet integrated (Endpoint missing).' });
    };

    const filteredDocuments = documents.filter(doc =>
        doc.doc_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full animate-fade-in pb-12">
            {/* Header section with Stats & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                            <UtilsIcon size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">Exhibitor Portal Setup</h1>
                    </div>
                    <p className="text-sm text-text-tertiary">Manage documents and resources shared with exhibitors</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-bg-secondary border border-border rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-text-tertiary hover:text-text-primary'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-text-tertiary hover:text-text-primary'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setEditingDocument(null);
                            setIsModalOpen(true);
                        }}
                        className="btn btn-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent/20"
                    >
                        <Plus size={20} />
                        Add Document
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {message.text && (
                <div className={`p-4 rounded-xl mb-8 flex justify-between items-center animate-fade-in border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="text-sm font-bold">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="text-inherit opacity-50 hover:opacity-100">
                        <Plus size={18} className="rotate-45" />
                    </button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="bg-bg-primary border border-border rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search documents by name..."
                        className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-transparent rounded-xl text-sm focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="btn btn-secondary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <Filter size={18} />
                    All Folders
                </button>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative">
                        <Loader2 className="animate-spin text-accent" size={48} />
                        <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
                    </div>
                    <span className="text-sm font-bold text-text-tertiary uppercase tracking-widest">Synchronizing Documents</span>
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="bg-bg-primary border-2 border-dashed border-border rounded-[2rem] p-20 flex flex-col items-center text-center gap-6">
                    <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary">
                        <FileText size={48} className="opacity-20" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-text-primary mb-2">No Documents Found</h3>
                        <p className="text-sm text-text-tertiary max-w-sm mx-auto">
                            {searchQuery ? "No documents match your search criteria." : "Start by adding the first document that exhibitors can access from their portal."}
                        </p>
                    </div>
                    {!searchQuery && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-secondary px-8 py-3 rounded-xl font-bold border-2"
                        >
                            Upload Document
                        </button>
                    )}
                </div>
            ) : (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                }>
                    {filteredDocuments.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            onEdit={(doc) => {
                                setEditingDocument(doc);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDeleteDocument}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <DocumentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDocument}
                editingDocument={editingDocument}
            />
        </div>
    );
};

export default ExhibitorPortalSetup;
