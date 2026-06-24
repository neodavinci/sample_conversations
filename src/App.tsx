import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  BookOpen, 
  ExternalLink,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { STEPS } from './data';
import { Step } from './types';

export default function App() {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme preference
  useEffect(() => {
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDarkSystem ? 'dark' : 'light');
  }, []);

  const currentStep: Step = STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  // Safe copy fallback for iframes
  const copyToClipboard = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedText(code);
          setTimeout(() => setCopiedText(null), 2000);
        })
        .catch(() => fallbackCopy(code));
    } else {
      fallbackCopy(code);
    }
  };

  const fallbackCopy = (code: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedText(code);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  // Custom renderer for messages containing pre / code blocks
  const renderMessageContent = (text: string) => {
    const regex = /(<pre>[\s\S]*?<\/pre>|<code>[\s\S]*?<\/code>)/g;
    const tokens = text.split(regex);
    
    return tokens.map((token, index) => {
      if (token.startsWith('<pre>') && token.endsWith('</pre>')) {
        const code = token.slice(5, -6);
        const isCopied = copiedText === code;
        return (
          <div key={index} className="relative my-3 group">
            <pre className="font-mono text-[11.5px] sm:text-xs leading-relaxed bg-[#f1efe8] dark:bg-[#2d2d2a] border border-[#d3d1c7] dark:border-[#3d3d39] rounded-lg p-3.5 sm:p-4 overflow-x-auto whitespace-pre text-[#1a1a18] dark:text-[#e8e6df]">
              <code>{code}</code>
            </pre>
            <button
              id={`copy-btn-${index}`}
              onClick={() => copyToClipboard(code)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-white dark:bg-[#1c1c1a] hover:bg-gray-100 dark:hover:bg-neutral-800 text-xs text-gray-600 dark:text-neutral-400 px-2.5 py-1 rounded border border-gray-300 dark:border-neutral-700 flex items-center gap-1 cursor-pointer shadow-sm"
              title="코드 복사"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
        );
      } else if (token.startsWith('<code>') && token.endsWith('</code>')) {
        const code = token.slice(6, -7);
        return (
          <code key={index} className="font-mono text-xs bg-[#f1efe8] dark:bg-[#2e2e2b] text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded border border-gray-300 dark:border-neutral-800 mx-0.5 font-semibold">
            {code}
          </code>
        );
      } else {
        return token.split('\n').map((line, lineIdx, arr) => (
          <span key={`${index}-${lineIdx}`}>
            {line}
            {lineIdx < arr.length - 1 && <br />}
          </span>
        ));
      }
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-height-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#121210] text-[#e8e6df]' : 'bg-[#f8f7f2] text-[#1a1a18]'} p-4 sm:p-8 font-sans flex flex-col items-center justify-start min-h-screen`}>
      {/* Container Wrap */}
      <div className="w-full max-w-[800px] flex flex-col gap-6">
        
        {/* Header Dashboard Panel */}
        <header id="app-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e4e2d9] dark:border-[#2d2d2a] pb-5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  Interactive Guide
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-[#1a1a18] dark:text-[#ffffff]">
                원자재 모니터링 프로그램 개발기
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                구매팀 대리 홍지수와 AI 비서의 대화 시나리오 시뮬레이터
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#1c1c1a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              title="테마 전환"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              id="reset-btn"
              onClick={handleReset}
              disabled={currentStepIdx === 0}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#1c1c1a] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>처음으로</span>
            </button>
          </div>
        </header>

        {/* Dynamic Scenario Progress Tracker */}
        <div id="progress-tracker" className="bg-white dark:bg-[#1c1c1a] border border-[#d3d1c7] dark:border-[#2a2a27] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">전체 여정 진행도</span>
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
              {currentStepIdx + 1} / {STEPS.length} 단계
            </div>
          </div>

          {/* Responsive Steps Bar */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              return (
                <button
                  id={`step-indicator-${idx}`}
                  key={idx}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 relative cursor-pointer group`}
                  title={`${step.title}`}
                >
                  <div className={`absolute inset-0 rounded-full ${
                    isActive 
                      ? 'bg-blue-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                      : isCompleted 
                        ? 'bg-emerald-600 dark:bg-emerald-500' 
                        : 'bg-neutral-200 dark:bg-[#2d2d2a]'
                  }`} />
                  {/* Tooltip on Hover */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-neutral-900 text-white text-[10px] sm:text-xs py-1 px-2 rounded whitespace-nowrap z-30 shadow-md">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Info Grid of steps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-2 border-t border-dashed border-[#e4e2d9] dark:border-[#2d2d2a]">
            {STEPS.map((step, idx) => (
              <button
                id={`step-btn-${idx}`}
                key={idx}
                onClick={() => setCurrentStepIdx(idx)}
                className={`text-left p-1.5 sm:p-2 rounded-lg transition-all border text-[11px] sm:text-xs font-medium cursor-pointer ${
                  idx === currentStepIdx
                    ? 'border-blue-300 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <div className="truncate text-[10px] text-neutral-400 dark:text-neutral-500">Step {idx + 1}</div>
                <div className="truncate">{step.title.split(' — ')[1] || step.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Stage Title Card */}
        <div id="active-stage-header" className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-[#d3d1c7] dark:border-[#2a2a27] rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {currentStep.title.split(' — ')[0]}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
              {currentStep.title.split(' — ')[1] || currentStep.title}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {currentStep.sub}
            </p>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-300 dark:text-neutral-700 select-none">
            0{currentStepIdx + 1}
          </span>
        </div>

        {/* Dynamic Chat Flow Area with Transitions */}
        <main id="chat-container" className="flex flex-col gap-4 min-h-[300px] bg-white dark:bg-[#1c1c1a] border border-[#d3d1c7] dark:border-[#2a2a27] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {currentStep.msgs.map((msg, idx) => {
                const isUser = msg.r === 'u';
                return (
                  <div
                    id={`chat-bubble-${idx}`}
                    key={idx}
                    className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                      isUser ? 'self-end flex-row-reverse' : 'self-start'
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border mt-1 shadow-sm ${
                      isUser 
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' 
                        : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble Body */}
                    <div className="flex flex-col gap-1.5">
                      <span className={`text-[11px] font-semibold ${isUser ? 'text-right text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {isUser ? '구매팀 홍지수 대리' : 'AGY CLI AI 어시스턴트'}
                      </span>
                      
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm shadow-sm border ${
                        isUser 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/20 text-[#0c447c] dark:text-[#b5d4f4] rounded-tr-none' 
                          : 'bg-white dark:bg-[#1a1a18] border-[#e2e0d7] dark:border-[#2d2d2a] text-[#1a1a18] dark:text-[#e8e6df] rounded-tl-none'
                      }`}>
                        
                        {/* Main Text & Parsed Code Content */}
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {renderMessageContent(msg.text)}
                        </div>

                        {/* Optional Tags */}
                        {msg.tags && msg.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-dashed border-[#e4e2d9] dark:border-[#2d2d2a]">
                            {msg.tags.map((tag, tagIdx) => (
                              <span 
                                key={tagIdx} 
                                className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: theme === 'dark' ? '#2e2e2b' : tag.bg,
                                  color: theme === 'dark' ? '#e8e6df' : tag.tx,
                                  border: `1px solid ${theme === 'dark' ? '#3d3d39' : tag.bd}`
                                }}
                              >
                                {tag.lb}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Optional Custom Tips Box */}
                        {msg.tip && (
                          <div className="mt-3.5 p-3 rounded-lg bg-[#f8f7f2] dark:bg-[#252523] border-l-4 border-amber-400 dark:border-amber-500 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{msg.tip}</span>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Current Core Learning Insight Block */}
        <AnimatePresence mode="wait">
          <motion.section 
            id="insight-panel"
            key={currentStepIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 sm:p-5 rounded-2xl border bg-amber-50/40 dark:bg-[#342404]/20 border-amber-200/60 dark:border-[#543b0c]/40 text-amber-900 dark:text-[#f3d9a4] shadow-sm flex gap-3.5 items-start"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-[#4d3608]/80 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-[#6b4b0e] py-1 px-2.5 rounded-full shrink-0">
              학습 포인트
            </span>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-300">
                효율적인 협업 지침
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-[#e2ca98] mt-1">
                {currentStep.insight}
              </p>
            </div>
          </motion.section>
        </AnimatePresence>

        {/* Bottom Interactive Navigation Controllers */}
        <footer id="nav-controllers" className="flex items-center justify-between gap-4 border-t border-[#e4e2d9] dark:border-[#2d2d2a] pt-5">
          <button
            id="prev-btn"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#1c1c1a] hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold flex items-center gap-1 cursor-pointer text-neutral-700 dark:text-neutral-300 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 단계</span>
          </button>

          <div className="hidden sm:flex flex-col items-center">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">진행 단계</span>
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{currentStep.title.split(' — ')[0]}</span>
          </div>

          <button
            id="next-btn"
            onClick={handleNext}
            disabled={currentStepIdx === STEPS.length - 1}
            className={`px-5 py-2 rounded-xl transition-all text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm ${
              currentStepIdx === STEPS.length - 1
                ? 'bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-800 text-white border border-emerald-600 dark:border-emerald-700 opacity-60 cursor-not-allowed'
                : 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white border border-blue-600 dark:border-blue-700'
            }`}
          >
            <span>{currentStepIdx === STEPS.length - 1 ? '완성!' : '다음 대화'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>

        {/* Subtitle reference */}
        <div className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 mt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800/60 pt-4">
          원자재 모니터링 프로그램 자동화 가이드 • AGY CLI 교육용 샘플
        </div>

      </div>
    </div>
  );
}
