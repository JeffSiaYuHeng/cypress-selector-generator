import React, { useState, useEffect } from 'react';
import { Key, X, Save, ExternalLink, Lock, Check } from 'lucide-react';
import { Button } from './Button';
import { storage } from '../utils/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load existing key when modal opens
  useEffect(() => {
    if (isOpen) {
      const stored = storage.getApiKey();
      if (stored) setApiKey(stored);
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API Key cannot be empty');
      return;
    }

    storage.setApiKey(apiKey);
    setSuccess(true);
    
    if (onSave) onSave();
    
    // Short delay to show success state before closing
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleRemove = () => {
    storage.removeApiKey();
    setApiKey('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Key className="w-5 h-5 text-cypress-green" />
            <span>Configure API Key</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            This tool uses Google's Gemini API to analyze your HTML. 
            Your key is stored locally in your browser and never sent to our servers.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Google AI Studio Key
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-cypress-green focus:border-transparent outline-none transition-all"
                autoComplete="off"
              />
            </div>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-between pt-2">
             <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-cypress-green hover:underline flex items-center gap-1"
            >
              Get a free API key <ExternalLink className="w-3 h-3" />
            </a>
            
            {storage.hasApiKey() && (
              <button 
                onClick={handleRemove}
                className="text-xs text-red-400 hover:text-red-300 hover:underline"
              >
                Clear stored key
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/30 border-t border-slate-800 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave}
            disabled={success}
            icon={success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {success ? 'Saved!' : 'Save Key'}
          </Button>
        </div>
      </div>
    </div>
  );
};
