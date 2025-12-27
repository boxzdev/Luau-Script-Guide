import React, { useState } from 'react';
import { getLuauHelp } from './services/gemini';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Variable & Stuff');
  const [summary, setSummary] = useState('');
  const [code, setCode] = useState('');
  const [scriptOutput, setScriptOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async () => {
    if (text.trim().length > 0) {
      setLoading(true);
      setSummary(''); 
      setCode('');
      setScriptOutput('');
      setIsError(false);
      
      const result = await getLuauHelp(text, category);
      
      if (result) {
        setSummary(result.summary);
        setCode(result.code);
        setScriptOutput(result.scriptOutput);
        if (result.isValid === false) {
          setIsError(true);
        }
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-200 font-sans gap-10">
      
      {/* Top Box: Input Area */}
      {/* Expanded max-width to accommodate the selection menu */}
      <div className="w-full max-w-md relative group">
        {/* Subtle glow effect behind the input box */}
        <div className={`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500 ${isError ? 'bg-red-900' : 'bg-gradient-to-r from-neutral-800 to-neutral-700'}`}></div>
        
        <div className={`relative bg-neutral-900 rounded-xl border shadow-xl overflow-hidden transition-colors duration-300 flex flex-row items-center ${isError ? 'border-red-900/50' : 'border-neutral-800'}`}>
          
          {/* Category Selector */}
          <div className="relative h-16 flex items-center">
             <select 
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               className="h-full bg-transparent text-neutral-400 pl-5 pr-2 outline-none cursor-pointer hover:text-neutral-200 transition-colors text-xs font-semibold uppercase tracking-wider appearance-none text-center"
               style={{textAlignLast: 'center'}}
             >
                <option value="Variable & Stuff" className="bg-neutral-900 text-neutral-300">Variable & Stuff</option>
                <option value="Value" className="bg-neutral-900 text-neutral-300">Value</option>
                <option value="Symbol" className="bg-neutral-900 text-neutral-300">Symbol</option>
             </select>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-[1px] bg-neutral-800 mx-2"></div>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (isError) setIsError(false); // Clear error state on typing
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type & Press Enter..."
            className="flex-1 h-16 px-4 py-5 bg-transparent text-sm text-center text-neutral-200 placeholder-neutral-600 focus:outline-none resize-none font-light leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Bottom Box: Output Area */}
      <div className={`w-full max-w-4xl bg-neutral-900 rounded-xl border shadow-xl min-h-[35rem] flex flex-col items-center p-8 relative overflow-hidden transition-all duration-500 ${isError ? 'border-red-900/30 shadow-red-900/10' : 'border-neutral-800'}`}>
        
        {/* Explanation Area (Top half) */}
        <div className={`w-full text-center mt-8 px-12 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
           {summary ? (
             <div className={`text-lg leading-relaxed tracking-wide transition-colors duration-300 ${isError ? 'text-red-400 font-normal' : 'text-neutral-300 font-light'}`}>
               <ReactMarkdown
                  components={{
                    // Style bold text to look like highlighted code terms
                    strong: ({node, ...props}) => (
                      <span className="font-semibold text-white bg-white/10 px-1.5 py-0.5 rounded mx-0.5" {...props} />
                    )
                  }}
               >
                 {summary}
               </ReactMarkdown>
             </div>
           ) : (
             <p className="text-neutral-700 font-light italic mt-10">
               {loading ? "Thinking..." : "Explanation will appear here..."}
             </p>
           )}
        </div>

        {/* Dual Box Container: Code (Left) & Output (Right) */}
        {/* Only show these boxes if there is code/output or if we are loading (placeholders). Hide on error. */}
        <div className={`flex w-full max-w-3xl gap-6 mt-auto mb-8 transition-opacity duration-500 ${isError && !loading ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Left: Code Box */}
            <div className="flex-1 h-48 bg-neutral-950 rounded-lg border border-neutral-800/50 shadow-inner flex flex-col relative group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 px-4 py-1 bg-neutral-900/50 border-b border-neutral-800/30 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold select-none">
                    Script
                </div>
                <div className="p-6 pt-8 w-full h-full flex items-center justify-center">
                    {code ? (
                        <pre className="w-full h-full text-xs text-neutral-400 font-mono overflow-auto whitespace-pre-wrap leading-5 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                        {code}
                        </pre>
                    ) : (
                        <p className="text-sm text-neutral-600 italic select-none">
                        {loading ? "Generating..." : "Script"}
                        </p>
                    )}
                </div>
                {code && <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/20 to-transparent blur-sm"></div>}
            </div>

            {/* Right: Output Box */}
            <div className="flex-1 h-48 bg-neutral-950 rounded-lg border border-neutral-800/50 shadow-inner flex flex-col relative group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 px-4 py-1 bg-neutral-900/50 border-b border-neutral-800/30 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold select-none">
                    Output
                </div>
                <div className="p-6 pt-8 w-full h-full flex items-center justify-center">
                    {scriptOutput ? (
                        <pre className="w-full h-full text-xs text-green-400/80 font-mono overflow-auto whitespace-pre-wrap leading-5 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                        {scriptOutput}
                        </pre>
                    ) : (
                        <p className="text-sm text-neutral-600 italic select-none">
                        {loading ? "Predicting..." : "Console"}
                        </p>
                    )}
                </div>
                {scriptOutput && <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500/20 to-transparent blur-sm"></div>}
            </div>

        </div>

      </div>

    </main>
  );
};

export default App;