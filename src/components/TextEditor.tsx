import React, { useRef, useEffect } from 'react';

interface TextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  highlights?: number[];
  placeholder?: string;
  label: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  id,
  value,
  onChange,
  highlights = [],
  placeholder = '',
  label,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Update the highlighted text whenever value or highlights change
  useEffect(() => {
    if (!highlightRef.current) return;
    
    // Create a highlighted version of the text
    let highlightedText = '';
    const chars = [...value];
    
    let inHighlight = false;
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const isHighlighted = highlights.includes(i);
      
      if (isHighlighted && !inHighlight) {
        highlightedText += '<mark>';
        inHighlight = true;
      } else if (!isHighlighted && inHighlight) {
        highlightedText += '</mark>';
        inHighlight = false;
      }
      
      // Replace spaces with non-breaking spaces and newlines with <br>
      if (char === ' ') {
        highlightedText += '&nbsp;';
      } else if (char === '\n') {
        if (inHighlight) {
          highlightedText += '</mark><br><mark>';
        } else {
          highlightedText += '<br>';
        }
      } else if (char === '<') {
        highlightedText += '&lt;';
      } else if (char === '>') {
        highlightedText += '&gt;';
      } else {
        highlightedText += char;
      }
    }
    
    if (inHighlight) {
      highlightedText += '</mark>';
    }
    
    highlightRef.current.innerHTML = highlightedText || '<br>';
  }, [value, highlights]);

  // Synchronize scrolling between the textarea and the highlight overlay
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative h-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-3 font-mono text-transparent whitespace-pre-wrap overflow-auto pointer-events-none bg-white dark:bg-gray-800"
        />
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="absolute inset-0 p-3 font-mono w-full h-full resize-none bg-transparent text-gray-800 dark:text-gray-200 outline-none z-10"
          style={{ 
            caretColor: 'currentColor',
          }}
        />
      </div>
    </div>
  );
};

export default TextEditor;