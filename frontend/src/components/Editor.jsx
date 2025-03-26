import { useState, useRef, useEffect } from "react";
import { 
  Terminal, FileText, AlertTriangle, Moon, Sun, 
  Settings, Code, Type, Copy, Check, ChevronDown 
} from "lucide-react";

const Editor = ({ code, setCode }) => {
  // State for editor functionality
  const [output, setOutput] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  // Theme and settings states
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('monospace');
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Refs
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Theme classes
  const themeClasses = {
    background: isDarkTheme ? 'bg-slate-900 text-white' : 'bg-white text-black',
    editor: isDarkTheme 
      ? 'bg-slate-800 text-white border-slate-700' 
      : 'bg-gray-50 text-black border-gray-200',
    settingsDropdown: isDarkTheme 
      ? 'bg-slate-700 border-slate-600' 
      : 'bg-white border-gray-200 shadow-lg',
    lineNumbers: isDarkTheme 
      ? 'bg-slate-700 text-slate-400' 
      : 'bg-gray-100 text-gray-500'
  };

  // Synchronize line numbers scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (textarea && lineNumbers) {
      const syncScroll = () => {
        lineNumbers.scrollTop = textarea.scrollTop;
      };

      textarea.addEventListener('scroll', syncScroll);
      return () => textarea.removeEventListener('scroll', syncScroll);
    }
  }, []);

  // Dynamic textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to correctly calculate scroll height
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 80)}px`;
    }
  }, [code, fontSize]);

  // Line number generation
  const generateLineNumbers = () => {
    const lines = code.split('\n');
    return lines.length > 0 ? lines.map((_, index) => index + 1) : ['1'];
  };

  // Copy output to clipboard
  const handleCopyOutput = () => {
    const outputText = output.map(item => 
      `Function: ${item.function}\nResult: ${item.result}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(outputText);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  // Execution method
  const handleExecute = async () => {
    if (isExecuting) return;

    try {
      setIsExecuting(true);
      setErrors([]);
      setOutput([]);

      // Simulated API calls for demonstration
      const parseResponse = await fetch("http://localhost:3000/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const parseData = await parseResponse.json();

      if (parseData.errors?.length > 0) {
        setErrors(parseData.errors);
        return;
      }

      const semanticResponse = await fetch("http://localhost:3000/semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const semanticData = await semanticResponse.json();

      if (semanticData.errors?.length > 0) {
        setErrors(semanticData.errors);
        return;
      }

      const executeResponse = await fetch("http://localhost:3000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const executeData = await executeResponse.json();

      const resultOutput = Array.isArray(executeData.result)
        ? executeData.result
        : [{ function: "Error", result: executeData.error || "Execution failed" }];

      setOutput(resultOutput);
    } catch (error) {
      setErrors(["Error executing function"]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className={`flex h-screen ${themeClasses.background} p-4`}>
      <div className="w-full max-w-6xl mx-auto flex flex-col h-116"> 

        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FileText size={20} className="text-blue-400" />
            <h2 className="text-xl font-bold">Codespace</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="p-2 rounded-full hover:bg-gray-700/20 transition-colors"
            >
              {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-gray-700/20 transition-colors"
              >
                <Settings size={16} />
                <span className="text-sm">Settings</span>
                <ChevronDown size={14} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
              </button>

              {showSettings && (
                <div 
                  className={`absolute right-0 mt-2 w-64 rounded-lg border p-3 z-10 
                    ${themeClasses.settingsDropdown} shadow-xl`}
                >
                  <div className="space-y-3">
                    {/* Font Size Setting */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Type size={16} className="text-blue-400" />
                        <label className="text-sm">Font Size</label>
                      </div>
                      <input 
                        type="number" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        min="10" 
                        max="24" 
                        className={`w-16 p-1 rounded text-center text-sm
                          ${isDarkTheme ? 'bg-slate-600' : 'bg-gray-200'}`}
                      />
                    </div>
                    
                    {/* Font Family Setting */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Code size={16} className="text-green-400" />
                        <label className="text-sm">Font Family</label>
                      </div>
                      <select 
                        value={fontFamily} 
                        onChange={(e) => setFontFamily(e.target.value)}
                        className={`p-1 rounded text-sm
                          ${isDarkTheme ? 'bg-slate-600' : 'bg-gray-200'}`}
                      >
                        <option value="monospace">Monospace</option>
                        <option value="serif">Serif</option>
                        <option value="sans-serif">Sans-Serif</option>
                      </select>
                    </div>
                    
                    {/* Line Numbers Setting */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Code size={16} className="text-indigo-400" />
                        <label className="text-sm">Line Numbers</label>
                      </div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={showLineNumbers}
                          onChange={() => setShowLineNumbers(!showLineNumbers)}
                          className="form-checkbox rounded text-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Code Editor */}
          <div className={`rounded-lg border ${themeClasses.editor} flex flex-col`}>
            <div className="flex flex-1 overflow-hidden relative">
              {/* Line Numbers */}
              {showLineNumbers && (
                <div 
                  ref={lineNumbersRef}
                  className={`w-10 p-2 text-right select-none overflow-y-auto 
                    ${themeClasses.lineNumbers} absolute left-0 top-0 bottom-0`}
                  style={{ 
                    fontSize: `${fontSize}px`, 
                    fontFamily: fontFamily,
                    lineHeight: `${fontSize + 4}px`
                  }}
                >
                  {generateLineNumbers().map(num => (
                    <div key={num} className="text-right">{num}</div>
                  ))}
                </div>
              )}
              
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                className={`flex-1 p-2 bg-transparent resize-none focus:outline-none 
                  ${showLineNumbers ? 'pl-12' : ''}`}
                style={{ 
                  fontSize: `${fontSize}px`, 
                  fontFamily: fontFamily,
                  height: '80px', // Reduced initial height
                  minHeight: '80px',
                  maxHeight: '300px', // Prevent infinite growth
                  overflowY: 'auto'
                }}
              />
            </div>
            <div className="p-2 border-t">
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {isExecuting ? 'Executing...' : 'Execute Code'}
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className={`rounded-lg border ${themeClasses.editor} flex flex-col`}>
            <div className="flex justify-between items-center p-2 border-b">
              <div className="flex items-center space-x-2">
                <Terminal size={16} className="text-blue-400" />
                <h3 className="font-semibold text-sm">Output</h3>
              </div>
              {output.length > 0 && (
                <button 
                  onClick={handleCopyOutput}
                  className="flex items-center space-x-1 text-xs hover:bg-slate-700 p-1 rounded"
                >
                  {copiedOutput ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  <span>{copiedOutput ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {errors.length > 0 ? (
                <div className="text-red-400 space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle size={16} />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              ) : output.length > 0 ? (
                <div className="space-y-3">
                  {output.map((item, index) => (
                    <div 
                      key={index} 
                      className={`
                        p-2 rounded-lg text-sm
                        ${item.result === "Error" 
                          ? "bg-red-500/10 text-red-400" 
                          : "bg-green-500/10 text-green-400"
                        }
                      `}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{item.function}</span>
                        <span className="text-xs opacity-70">
                          {item.result === "Error" ? "Failed" : "Success"}
                        </span>
                      </div>
                      <pre className="text-xs whitespace-pre-wrap break-words">
                        {item.result}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-center">
                  <div>
                    <Terminal size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Execute your code to see output</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;