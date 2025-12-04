import React, { useState, useEffect } from 'react';
import { Upload, FileText, Search, Filter, MoreVertical, Plus, X, Loader2, Eye } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Document, DocCategory } from '../types';

const Passport: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: DocCategory.OTHER,
    expiryDate: ''
  });
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await dataService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Pre-fill title from filename
      const title = file.name.replace(/\.[^/.]+$/, '');
      setUploadForm(prev => ({ ...prev, title }));
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    if (!uploadForm.title.trim()) {
      alert('Please enter a document title');
      return;
    }

    setIsUploading(true);
    console.log('🚀 Starting upload process...');
    
    try {
      console.log('📋 Upload metadata:', {
        title: uploadForm.title,
        category: uploadForm.category,
        expiryDate: uploadForm.expiryDate
      });

      const newDoc = await dataService.addDocument(selectedFile, {
        title: uploadForm.title,
        category: uploadForm.category,
        expiryDate: uploadForm.expiryDate || undefined,
          tags: ['New']
      });
      
      console.log('✅ Upload complete! Document ID:', newDoc.id);
      
      // Refresh documents list
      await loadDocuments();
      console.log('✅ Documents list refreshed');
      
      // Reset form and close modal
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadForm({
        title: '',
        category: DocCategory.OTHER,
        expiryDate: ''
      });
      
      console.log('✅ Modal closed, form reset');
    } catch (error: any) {
      console.error('❌ Upload error caught:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Show user-friendly error
      const errorMsg = error.message || 'Failed to upload document. Check console for details.';
      alert(`Upload Failed:\n\n${errorMsg}\n\nPlease check the browser console (F12) for more details.`);
    } finally {
            setIsUploading(false);
      console.log('🏁 Upload process finished (isUploading set to false)');
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDocumentClick = async (doc: Document) => {
    setIsLoadingPreview(true);
    setPreviewDoc(doc);
    
    try {
      const url = await dataService.getDocumentUrl(doc.id);
      if (url) {
        setPreviewUrl(url);
      } else {
        alert('Failed to load document. Please try again.');
        setPreviewDoc(null);
      }
    } catch (error: any) {
      console.error('Error loading document:', error);
      alert(error.message || 'Failed to load document');
      setPreviewDoc(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const closePreview = () => {
    setPreviewDoc(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">My Passport</h1>
          <p className="text-slate-500">Securely store and manage your professional documents.</p>
        </div>
        <div className="relative">
           <input 
             type="file" 
             id="file-upload" 
             className="hidden" 
             accept=".pdf,.jpg,.jpeg,.png"
             onChange={handleFileSelect}
             disabled={isUploading}
           />
           <label 
             htmlFor="file-upload"
             className={`flex cursor-pointer items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
           >
             {isUploading ? (
               <>
                 <Loader2 className="animate-spin" size={18} />
                 Uploading...
               </>
             ) : (
               <>
                 <Plus size={18} />
                 Upload Document
               </>
             )}
           </label>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select 
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-8 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.values(DocCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id} 
            onClick={() => handleDocumentClick(doc)}
            className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-brand-primary"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <h3 className="line-clamp-1 font-semibold text-brand-charcoal">{doc.title}</h3>
            <p className="text-xs text-slate-500">{doc.category}</p>
            
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{doc.uploadDate}</span>
              <span className="uppercase">{doc.fileType} • {doc.size}</span>
            </div>

            {doc.expiryDate && (
               <div className="mt-2 text-xs font-medium text-brand-sand bg-brand-sand/10 px-2 py-1 rounded inline-block w-max">
                 Expires: {doc.expiryDate}
               </div>
            )}

            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDocumentClick(doc);
                }}
                className="text-slate-400 hover:text-brand-primary transition-colors"
                title="Preview document"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-slate-600"
                title="More options"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Search size={24} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-brand-charcoal">No documents found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or upload a new document.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-brand-charcoal">Upload Document</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadForm({ title: '', category: DocCategory.OTHER, expiryDate: '' });
                }}
                className="text-slate-400 hover:text-slate-600"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedFile && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-brand-primary" size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-charcoal truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g., Passport, DBS Certificate"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value as DocCategory }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  disabled={isUploading}
                >
                  {Object.values(DocCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={uploadForm.expiryDate}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  disabled={isUploading}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave blank if document doesn't expire
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadForm({ title: '', category: DocCategory.OTHER, expiryDate: '' });
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !uploadForm.title.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closePreview}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4 bg-slate-50">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-brand-charcoal truncate">{previewDoc.title}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {previewDoc.category} • {previewDoc.fileType.toUpperCase()} • {previewDoc.size}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="ml-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="relative w-full h-[calc(90vh-80px)] bg-slate-100 flex items-center justify-center">
              {isLoadingPreview ? (
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-primary" />
                  <p className="mt-2 text-sm text-slate-500">Loading document...</p>
                </div>
              ) : previewUrl ? (
                <>
                  {previewDoc.fileType === 'pdf' ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title={previewDoc.title}
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt={previewDoc.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </>
              ) : (
                <div className="text-center text-slate-500">
                  <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Failed to load document</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Uploaded: {previewDoc.uploadDate}
                {previewDoc.expiryDate && ` • Expires: ${previewDoc.expiryDate}`}
              </div>
              <a
                href={previewUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                Open in new tab
                <FileText size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passport;