import { useState, useEffect } from 'react';
import TextEditor from './components/TextEditor';
import ControlPanel from './components/ControlPanel';
import Header from './components/Header';
import { ComparisonOptions, ComparisonResult, TextStats } from './types';
import { compareTexts } from './utils/compareUtils';
import useDarkMode from './hooks/useDarkMode';
import useFileReader from './hooks/useFileReader';

const initialStats: TextStats = {
  characters: 0,
  words: 0,
  lines: 0,
};

const initialComparisonResult: ComparisonResult = {
  leftHighlights: [],
  rightHighlights: [],
  leftStats: initialStats,
  rightStats: initialStats,
  diffPercentage: 0,
};

function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [readFile] = useFileReader();
  
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult>(initialComparisonResult);
  
  const [options, setOptions] = useState<ComparisonOptions>({
    ignoreCase: false,
    ignoreWhitespace: false,
    compareMode: 'character',
  });

  // Update comparison results when texts or options change
  useEffect(() => {
    if (leftText === '' && rightText === '') {
      setComparisonResult(initialComparisonResult);
      return;
    }

    const result = compareTexts(leftText, rightText, options);
    setComparisonResult(result);
  }, [leftText, rightText, options]);

  // Clear text handlers
  const handleClearLeft = () => setLeftText('');
  const handleClearRight = () => setRightText('');

  // Copy text handlers
  const handleCopyLeft = () => {
    navigator.clipboard.writeText(leftText);
  };
  
  const handleCopyRight = () => {
    navigator.clipboard.writeText(rightText);
  };

  // Paste text handlers
  const handlePasteLeft = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLeftText(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error instanceof Error ? error.message : 'Unknown error');
    }
  };
  
  const handlePasteRight = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRightText(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Swap texts
  const handleSwapTexts = () => {
    const temp = leftText;
    setLeftText(rightText);
    setRightText(temp);
  };

  // File upload handlers
  const handleUploadLeft = async (file: File) => {
    try {
      const content = await readFile(file);
      setLeftText(content);
    } catch (error) {
      console.error('Error reading file:', error instanceof Error ? error.message : 'Unknown error');
    }
  };
  
  const handleUploadRight = async (file: File) => {
    try {
      const content = await readFile(file);
      setRightText(content);
    } catch (error) {
      console.error('Error reading file:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Download result
  const handleDownloadResult = () => {
    const { diffPercentage } = comparisonResult;
    
    const content = `
# Text Comparison Result

## Difference: ${diffPercentage.toFixed(1)}%

## Left Text
- Characters: ${comparisonResult.leftStats.characters}
- Words: ${comparisonResult.leftStats.words}
- Lines: ${comparisonResult.leftStats.lines}

## Right Text
- Characters: ${comparisonResult.rightStats.characters}
- Words: ${comparisonResult.rightStats.words}
- Lines: ${comparisonResult.rightStats.lines}

## Left Content
\`\`\`
${leftText}
\`\`\`

## Right Content
\`\`\`
${rightText}
\`\`\`
    `;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparison-result.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        <ControlPanel
          options={options}
          setOptions={setOptions}
          leftText={leftText}
          rightText={rightText}
          leftStats={comparisonResult.leftStats}
          rightStats={comparisonResult.rightStats}
          diffPercentage={comparisonResult.diffPercentage}
          onClearLeft={handleClearLeft}
          onClearRight={handleClearRight}
          onCopyLeft={handleCopyLeft}
          onCopyRight={handleCopyRight}
          onPasteLeft={handlePasteLeft}
          onPasteRight={handlePasteRight}
          onSwapTexts={handleSwapTexts}
          onUploadLeft={handleUploadLeft}
          onUploadRight={handleUploadRight}
          onDownloadResult={handleDownloadResult}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <TextEditor
            id="left-editor"
            label="Original Text"
            value={leftText}
            onChange={setLeftText}
            highlights={comparisonResult.leftHighlights}
            placeholder="Enter or paste text here..."
          />
          
          <TextEditor
            id="right-editor"
            label="Modified Text"
            value={rightText}
            onChange={setRightText}
            highlights={comparisonResult.rightHighlights}
            placeholder="Enter or paste text here to compare..."
          />
        </div>
      </main>
      
      <footer className="py-4 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Diffy - Compare text client-side with no server API calls</p>
        </div>
      </footer>
    </div>
  );
}

export default App;