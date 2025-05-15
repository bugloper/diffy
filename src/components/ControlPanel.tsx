import React from 'react';
import { ComparisonOptions, TextStats } from '../types';
import { Copy, Clipboard, X, ArrowLeftRight, Upload, Download } from 'lucide-react';

interface ControlPanelProps {
  options: ComparisonOptions;
  setOptions: React.Dispatch<React.SetStateAction<ComparisonOptions>>;
  leftText: string;
  rightText: string;
  leftStats: TextStats;
  rightStats: TextStats;
  diffPercentage: number;
  onClearLeft: () => void;
  onClearRight: () => void;
  onCopyLeft: () => void;
  onCopyRight: () => void;
  onPasteLeft: () => void;
  onPasteRight: () => void;
  onSwapTexts: () => void;
  onUploadLeft: (file: File) => void;
  onUploadRight: (file: File) => void;
  onDownloadResult: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  setOptions,
  leftText,
  rightText,
  leftStats,
  rightStats,
  diffPercentage,
  onClearLeft,
  onClearRight,
  onCopyLeft,
  onCopyRight,
  onPasteLeft,
  onPasteRight,
  onSwapTexts,
  onUploadLeft,
  onUploadRight,
  onDownloadResult,
}) => {
  // Handle file uploads
  const handleFileUpload = (side: 'left' | 'right') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (side === 'left') {
      onUploadLeft(file);
    } else {
      onUploadRight(file);
    }
    
    // Reset the input so the same file can be uploaded again
    e.target.value = '';
  };

  // Stats display
  const StatsDisplay = ({ side }: { side: 'left' | 'right' }) => {
    const stats = side === 'left' ? leftStats : rightStats;
    
    return (
      <div className="text-xs text-gray-600 dark:text-gray-400 flex space-x-4">
        <span>{stats.characters} chars</span>
        <span>{stats.words} words</span>
        <span>{stats.lines} lines</span>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col gap-4">
      {/* Options section */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ignoreCase"
              checked={options.ignoreCase}
              onChange={(e) => setOptions({ ...options, ignoreCase: e.target.checked })}
              className="mr-2 h-4 w-4 text-blue-500"
            />
            <label htmlFor="ignoreCase" className="text-sm text-gray-700 dark:text-gray-300">
              Ignore case
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ignoreWhitespace"
              checked={options.ignoreWhitespace}
              onChange={(e) => setOptions({ ...options, ignoreWhitespace: e.target.checked })}
              className="mr-2 h-4 w-4 text-blue-500"
            />
            <label htmlFor="ignoreWhitespace" className="text-sm text-gray-700 dark:text-gray-300">
              Ignore whitespace
            </label>
          </div>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="compareMode" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
            Compare by:
          </label>
          <select
            id="compareMode"
            value={options.compareMode}
            onChange={(e) => setOptions({ 
              ...options, 
              compareMode: e.target.value as ComparisonOptions['compareMode'] 
            })}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <option value="character">Character</option>
            <option value="word">Word</option>
            <option value="line">Line</option>
          </select>
        </div>
      </div>

      {/* Difference indicator */}
      <div className="text-center p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
        <span className="font-medium text-emerald-800 dark:text-emerald-200">
          Difference: {diffPercentage.toFixed(1)}%
        </span>
      </div>
      
      {/* Text controls - left and right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={onCopyLeft}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
            <button 
              onClick={onPasteLeft}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard size={16} />
              <span>Paste</span>
            </button>
            <button 
              onClick={onClearLeft}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
              title="Clear text"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
            <label 
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors cursor-pointer"
              title="Upload file"
            >
              <Upload size={16} />
              <span>Upload</span>
              <input
                type="file"
                onChange={handleFileUpload('left')}
                className="hidden"
                accept=".txt,.md,.js,.ts,.jsx,.tsx,.html,.css,.json,.py,.java,.c,.cpp,.h,.hpp,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.sql,.xml,.yaml,.yml,.ini,.conf,.log,.csv,.tsv,.mdx,.vue,.svelte"
              />
            </label>
          </div>
          <StatsDisplay side="left" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={onCopyRight}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
            <button 
              onClick={onPasteRight}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard size={16} />
              <span>Paste</span>
            </button>
            <button 
              onClick={onClearRight}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
              title="Clear text"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
            <label 
              className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors cursor-pointer"
              title="Upload file"
            >
              <Upload size={16} />
              <span>Upload</span>
              <input
                type="file"
                onChange={handleFileUpload('right')}
                className="hidden"
                accept=".txt,.md,.js,.ts,.jsx,.tsx,.html,.css,.json,.py,.java,.c,.cpp,.h,.hpp,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.sql,.xml,.yaml,.yml,.ini,.conf,.log,.csv,.tsv,.mdx,.vue,.svelte"
              />
            </label>
          </div>
          <StatsDisplay side="right" />
        </div>
      </div>
      
      {/* Swap and download buttons */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={onSwapTexts}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          title="Swap text contents"
        >
          <ArrowLeftRight size={18} />
          <span>Swap Texts</span>
        </button>
        
        <button 
          onClick={onDownloadResult}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
          title="Download comparison result"
          disabled={!leftText && !rightText}
        >
          <Download size={18} />
          <span>Download Result</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;