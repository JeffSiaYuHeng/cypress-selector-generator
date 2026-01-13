import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Trash2, Code2, AlertCircle, Wand2, Info, Settings, Key } from 'lucide-react';
import { generateSelector } from './services/geminiService';
import { Button } from './components/Button';
import { CodePreview } from './components/CodePreview';
import { ApiKeyModal } from './components/ApiKeyModal';
import { CYPRESS_ACTIONS, EXAMPLE_HTML, CATEGORY_ICONS } from './constants';
import { ACTION_CATEGORIES } from './types';
import { storage } from './utils/storage';

function App() {
  const [htmlInput, setHtmlInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatedSelector, setGeneratedSelector] = useState<string>('');
  const [appendedActions, setAppendedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // API Key State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  
  // Ref for auto-scrolling to results on mobile
  const resultRef = useRef<HTMLDivElement>(null);

  // Check for API key on mount
  useEffect(() => {
    setHasKey(storage.hasApiKey());
  }, []);

  const handleGenerate = async () => {
    setError(null);
    setGeneratedSelector('');
    setAppendedActions([]);

    // 1. Validation: Check if API key exists
    const apiKey = storage.getApiKey();
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // 2. Pass the retrieved key to the service
      const selector = await generateSelector(htmlInput, description, apiKey);
      setGeneratedSelector(selector);
      
      // On mobile, scroll to result
      if (window.innerWidth < 768) {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      // If unauthorized, prompt for key again
      if (err.message.includes('Invalid API Key')) {
        setIsSettingsOpen(true);
      }
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const addAction = (code: string) => {
    setAppendedActions(prev => [...prev, code]);
  };

  const clearActions = () => {
    setAppendedActions([]);
  };

  const clearAll = () => {
    setHtmlInput('');
    setDescription('');
    setGeneratedSelector('');
    setAppendedActions([]);
    setError(null);
  };

  const loadExample = () => {
    setHtmlInput(EXAMPLE_HTML);
    setDescription("The login button");
  };

  const handleKeySaved = () => {
    setHasKey(true);
    // If the user was trying to generate, we could auto-trigger here, 
    // but safer to let them click again to avoid unexpected behavior.
  };

  const fullCode = generatedSelector ? `${generatedSelector}${appendedActions.join('')}` : '';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cypress-green selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cypress-green p-1.5 rounded-lg shadow-lg shadow-cypress-green/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">Cypress Selector Generator</h1>
              <p className="text-xs text-slate-500 hidden sm:block">AI-Powered Test Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                hasKey 
                  ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'border-yellow-600/50 bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/30'
              }`}
            >
              {hasKey ? <Settings className="w-4 h-4" /> : <Key className="w-4 h-4" />}
              <span className="hidden sm:inline">{hasKey ? 'Settings' : 'Set API Key'}</span>
            </button>
            <a href="https://docs.cypress.io" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-cypress-green transition-colors font-medium ml-2">
              Docs
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Inputs */}
          <div className="flex flex-col gap-6">
            
            {/* HTML Input Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <span className="bg-slate-800 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold border border-slate-700">1</span>
                  HTML Snippet
                  <div className="group relative">
                    <Info className="w-4 h-4 text-slate-500 cursor-help" />
                    <div className="absolute left-0 bottom-6 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 hidden group-hover:block shadow-xl z-20 leading-relaxed">
                      Paste the HTML code of the component you want to test. The more context you provide, the better the selector.
                    </div>
                  </div>
                </label>
                <button onClick={loadExample} className="text-xs text-cypress-green hover:text-emerald-400 transition-colors hover:underline font-medium">
                  Load Example
                </button>
              </div>
              <div className="relative group">
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="<button class='btn'>Login</button>"
                  className="w-full h-64 lg:h-80 bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-cypress-green focus:border-transparent outline-none resize-none placeholder:text-slate-600 shadow-inner"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Description Input Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="bg-slate-800 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold border border-slate-700">2</span>
                Target Element
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder='e.g., "The submit button inside the login form"'
                  className="flex-1 bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-cypress-green focus:border-transparent outline-none shadow-sm placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4 pt-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !htmlInput || !description}
                className="flex-1 shadow-lg shadow-cypress-green/10"
                size="lg"
                icon={isLoading ? <Wand2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              >
                {isLoading ? 'Analyzing DOM...' : 'Generate Selector'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={clearAll}
                title="Reset All"
                className="w-12 h-12 !px-0 rounded-xl hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Output & Builder */}
          <div ref={resultRef} className="flex flex-col gap-6">
            
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <span className="bg-slate-800 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold border border-slate-700">3</span>
                  Generated Cypress Code
                </label>
                {appendedActions.length > 0 && (
                  <button 
                    onClick={clearActions}
                    className="text-xs text-red-400 hover:text-red-300 hover:underline font-medium transition-colors"
                  >
                    Clear Actions
                  </button>
                )}
               </div>
              <CodePreview 
                code={fullCode} 
                placeholder="The generated selector and commands will appear here."
              />
            </div>

            {/* Action Builder Panel */}
            <div className={`transition-all duration-500 mt-4 ${generatedSelector ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none blur-[1px] translate-y-2'}`}>
              <div className="flex items-center gap-3 mb-4">
                 <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <span className="bg-slate-800 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold border border-slate-700">4</span>
                    Append Actions
                 </h3>
                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              
              <div className="space-y-6 bg-slate-800/40 rounded-xl p-5 border border-slate-700/60 backdrop-blur-sm">
                {ACTION_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                      {CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS]}
                      {cat.label}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                      {CYPRESS_ACTIONS.filter(action => action.category === cat.id).map(action => (
                        <button
                          key={action.id}
                          onClick={() => addAction(action.code)}
                          className="relative text-left px-3.5 py-3 rounded-lg border border-slate-700/60 bg-slate-900/40 hover:bg-slate-800 hover:border-cypress-green hover:shadow-[0_4px_12px_-2px_rgba(0,191,136,0.1)] transition-all group flex flex-col gap-1.5 active:scale-[0.98]"
                          title={action.description}
                        >
                          <span className="font-medium text-slate-300 group-hover:text-white transition-colors text-xs sm:text-sm">{action.label}</span>
                          <span className="text-[10px] text-slate-500 font-mono group-hover:text-cypress-green transition-colors truncate w-full block">
                            {action.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
        {/* Settings Modal */}
        <ApiKeyModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onSave={handleKeySaved}
        />
      </main>
    </div>
  );
}

export default App;
