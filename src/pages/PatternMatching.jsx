import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle, Info } from 'lucide-react';

import AlgorithmSelector from '../components/controls/AlgorithmSelector';
import ControlPanel from '../components/controls/ControlPanel';
import TextVisualization from '../components/visualization/TextVisualization';
import PreprocessingTable from '../components/visualization/PreprocessingTable';
import PseudocodePanel from '../components/visualization/PseudocodePanel';

import { kmpSearch } from '../components/algorithms/KMPlogic.jsx';
import { boyerMooreSearch } from '../components/algorithms/BoyerMooreLogic';

// ---------- Local UI Components ----------

const Button = ({ children, onClick, className = '', size = 'md', ...props }) => (
  <button
    onClick={onClick}
    {...props}
    className={`rounded-xl font-medium transition-all ${size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'} ${className}`}
  >
    {children}
  </button>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  />
);

const Label = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white ${className}`}>{children}</div>
);

const Separator = ({ className = '' }) => (
  <div className={`border-t border-gray-200 ${className}`} />
);

const Alert = ({ variant = 'default', children, className = '' }) => {
  const variantClasses =
    variant === 'destructive'
      ? 'border-red-300 bg-red-50 text-red-800'
      : 'border-blue-300 bg-blue-50 text-blue-800';
  return <div className={`rounded-lg border p-4 flex items-start gap-3 ${variantClasses} ${className}`}>{children}</div>;
};

const AlertDescription = ({ children }) => <div className="text-sm">{children}</div>;

const Tabs = ({ value, onValueChange, children, defaultValue }) => {
  const [current, setCurrent] = useState(defaultValue || value);
  useEffect(() => {
    if (value !== undefined) setCurrent(value);
  }, [value]);
  const handleChange = (val) => {
    setCurrent(val);
    if (onValueChange) onValueChange(val);
  };
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { currentTab: current, onTabChange: handleChange })
  );
};

const TabsList = ({ children, className = '', currentTab, onTabChange }) => (
  <div className={`flex gap-2 ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { currentTab, onTabChange })
    )}
  </div>
);

const TabsTrigger = ({ children, value, currentTab, onTabChange }) => (
  <button
    onClick={() => onTabChange(value)}
    className={`flex-1 py-2 rounded-md font-medium transition-all ${
      currentTab === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, currentTab, className = '' }) => {
  if (value !== currentTab) return null;
  return <div className={className}>{children}</div>;
};

const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 border-b border-green-200">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------

export  function PatternMatchingPage() {
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [algorithm, setAlgorithm] = useState('kmp');
  const [error, setError] = useState('');
  
  const [results, setResults] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('preprocessing');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const playIntervalRef = useRef(null);

  const handleVisualize = () => {
    if (!text || !pattern) {
      setError('Please enter both text and pattern');
      return;
    }
    
    if (pattern.length > text.length) {
      setError('Pattern cannot be longer than text');
      return;
    }

    setError('');
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setCurrentPhase('preprocessing');

    if (algorithm === 'kmp') {
      const result = kmpSearch(text, pattern);
      setResults(result);
    } else {
      const result = boyerMooreSearch(text, pattern);
      setResults(result);
    }
  };

  const getCurrentSteps = () => {
    if (!results) return [];
    const preprocess = results.preprocessSteps || [];
    const search = results.searchSteps || [];
    return currentPhase === 'preprocessing' ? preprocess : search;
  };

  const currentSteps = getCurrentSteps();
  const currentStep = currentSteps?.[currentStepIndex] ?? null;

  // Prepare step with matches for visualization
  const stepWithMatches = currentStep ? {
    ...currentStep,
    matches: results?.matches || []
  } : null;

  const handleStepForward = () => {
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else if (currentPhase === 'preprocessing' && results.searchSteps.length > 0) {
      setCurrentPhase('search');
      setCurrentStepIndex(0);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (currentPhase === 'search') {
      setCurrentPhase('preprocessing');
      setCurrentStepIndex(results.preprocessSteps.length - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase('preprocessing');
    setCurrentStepIndex(0);
  };

  const handleStepChange = (index) => {
    setCurrentStepIndex(index);
  };

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < currentSteps.length - 1) {
            return prev + 1;
          } else if (currentPhase === 'preprocessing' && results.searchSteps.length > 0) {
            setCurrentPhase('search');
            return 0;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000 / speed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, speed, currentSteps, currentPhase, results]);

  // Detect search completion
  useEffect(() => {
    if (
      results &&
      currentPhase === 'search' &&
      currentStepIndex === currentSteps.length - 1 &&
      currentSteps.length > 0
    ) {
      setShowCompletionModal(true);
    }
  }, [currentPhase, currentStepIndex, currentSteps, results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pattern Matching Visualizer
          </h1>
          <p className="text-gray-600">
            Interactive step-by-step visualization of KMP and Boyer-Moore algorithms
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Configure Search
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-sm font-medium">
                Text (where to search)
              </Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="Enter text..."
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pattern" className="text-sm font-medium">
                Pattern (what to find)
              </Label>
              <Input
                id="pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value.toUpperCase())}
                placeholder="Enter pattern..."
                className="font-mono"
              />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <AlgorithmSelector selected={algorithm} onSelect={setAlgorithm} />
            </div>
            <Button
              onClick={handleVisualize}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Visualize
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Visualization Section */}
        {results && (
          <>
            <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {currentPhase === 'preprocessing' ? 'Pre-processing Phase' : 'Search Phase'}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {currentPhase === 'preprocessing' 
                      ? 'Building auxiliary data structures for efficient searching'
                      : 'Searching for pattern matches in the text'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{(results?.matches || []).length}</div>
                  <div className="text-sm text-indigo-100">Match(es) Found</div>
                </div>
              </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TextVisualization
                  text={text}
                  pattern={pattern}
                  currentStep={stepWithMatches}
                  algorithm={algorithm}
                />

                <Tabs defaultValue="preprocessing" value={currentPhase} onValueChange={setCurrentPhase}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preprocessing">Pre-processing Table</TabsTrigger>
                    <TabsTrigger value="search">Search Progress</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preprocessing" className="mt-4">
                    <PreprocessingTable
                      algorithm={algorithm}
                      pattern={pattern}
                      preprocessStep={results.preprocessSteps[currentPhase === 'preprocessing' ? currentStepIndex : results.preprocessSteps.length - 1]}
                      searchStep={null}
                    />
                  </TabsContent>
                  <TabsContent value="search" className="mt-4">
                    <PreprocessingTable
                      algorithm={algorithm}
                      pattern={pattern}
                      preprocessStep={null}
                      searchStep={results.searchSteps[currentPhase === 'search' ? currentStepIndex : 0]}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <ControlPanel
                  currentStepIndex={currentStepIndex}
                  totalSteps={currentSteps.length}
                  isPlaying={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  onReset={handleReset}
                  onStepChange={handleStepChange}
                  speed={speed}
                  onSpeedChange={setSpeed}
                />

                <PseudocodePanel
                  algorithm={algorithm}
                  currentStep={currentStep}
                  phase={currentPhase}
                />
              </div>
            </div>
          </>
        )}

        {/* Info Card */}
        {!results && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900">How to use this visualizer:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Enter your text and pattern in the input fields</li>
                  <li>Select either KMP or Boyer-Moore algorithm</li>
                  <li>Click "Visualize" to see the step-by-step execution</li>
                  <li>Use playback controls to navigate through the algorithm steps</li>
                  <li>Watch the pseudocode panel to see which line is executing</li>
                  <li>Observe the pre-processing tables and pattern matching process</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Completion Modal */}
        <Modal
          isOpen={showCompletionModal}
          title="🎉 Search Completed!"
          onClose={() => setShowCompletionModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-lg font-bold text-green-900 mb-2">
                Total Matches Found: {results?.matches?.length || 0}
              </p>
              {(results?.matches || []).length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-800">
                    The pattern "<span className="font-mono font-bold">{pattern}</span>" was found in the text:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(results?.matches || []).map((matchIdx, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-green-300 rounded p-3 font-mono text-sm"
                      >
                        <div className="font-semibold text-green-700">Match #{idx + 1}</div>
                        <div className="text-gray-700 mt-1">Position: {matchIdx}</div>
                        <div className="text-gray-600 text-xs mt-1">
                          Text[{matchIdx}:{matchIdx + pattern.length}] = {text.substring(matchIdx, matchIdx + pattern.length)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-green-800">
                  The pattern "<span className="font-mono font-bold">{pattern}</span>" was not found in the text.
                </p>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Algorithm:</span> {algorithm === 'kmp' ? 'Knuth-Morris-Pratt (KMP)' : 'Boyer-Moore'}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Text Length:</span> {text.length}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Pattern Length:</span> {pattern.length}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
