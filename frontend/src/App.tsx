import { useState, useEffect } from 'react';
import { 
  Activity, BrainCircuit, GitMerge, LineChart, Shield, Zap, 
  Database, ChevronRight, BarChart3, Globe, Cpu, Rocket, 
  Plus, X, Sparkles, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [activeTab, setActiveTab] = useState('nervous-system');
  const [scrolled, setScrolled] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState('idle');
  const [waitlistErrors, setWaitlistErrors] = useState<{email?: string, general?: string}>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Strategy Builder & Backtesting States
  const [strategyBlocks, setStrategyBlocks] = useState(['Entry Condition: EMA 20 crosses above EMA 50']);
  const [showAiInsight, setShowAiInsight] = useState(true);
  const [insightActioned, setInsightActioned] = useState(false);
  const [dataSource, setDataSource] = useState('Dhan Historical API');
  const [isSimulating, setIsSimulating] = useState(false);
  const [backtestProgress, setBacktestProgress] = useState(100);
  const [flashEffect, setFlashEffect] = useState(false);
  const [resultsView, setResultsView] = useState('heatmap'); // 'heatmap' or 'table'

  // Portfolio & Chart States
  const [portfolioValue, setPortfolioValue] = useState(245350);
  const [portfolioGain, setPortfolioGain] = useState(2.35);
  const [portfolioFlash, setPortfolioFlash] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState('1D');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistStatus('loading');
    setWaitlistErrors({});
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.post(`${API_URL}/api/waitlist`, { 
        email: waitlistEmail 
      });
      setWaitlistStatus('success');
      setWaitlistEmail('');
    } catch (error: any) {
      console.error('Failed to submit waitlist', error);
      if (error.response?.data?.errors) {
        const newErrors: any = {};
        error.response.data.errors.forEach((err: any) => {
           if (err.path === 'email') newErrors.email = err.msg;
        });
        setWaitlistErrors(newErrors);
      } else if (error.response?.data?.message) {
        setWaitlistErrors({ general: error.response.data.message });
      } else {
        setWaitlistErrors({ general: 'Something went wrong' });
      }
      setWaitlistStatus('idle');
    }
  };

  const handleCreateStrategy = () => {
    setInsightActioned(true);
    setPortfolioFlash(true);
    setPortfolioValue(prev => prev + 12450);
    setPortfolioGain(prev => prev + 1.25);
    setTimeout(() => setPortfolioFlash(false), 1500);
  };

  const handleRunBacktest = () => {
    if(isSimulating) return;
    setIsSimulating(true);
    setBacktestProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 20) + 10;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 300);
      }
      setBacktestProgress(prog);
    }, 150);
  };

  const addStrategyBlock = () => {
    if (strategyBlocks.length < 3) {
      const newBlocks = [
        ...strategyBlocks,
        strategyBlocks.length === 1 ? 'Filter: RSI (14) < 70' : 'Exit: Stop Loss 2%, Take Profit 4%'
      ];
      setStrategyBlocks(newBlocks);
      handleRunBacktest();
    }
  };

  const handleNewBacktest = () => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 400);
    setStrategyBlocks(['Entry Condition: EMA 20 crosses above EMA 50']);
    setBacktestProgress(100);
  };

  const cycleDataSource = () => {
    const sources = ['Dhan Historical API', 'Zerodha Kite', 'Upstox Data API', 'Binance Market Data'];
    const currentIdx = sources.indexOf(dataSource);
    setDataSource(sources[(currentIdx + 1) % sources.length]);
    handleRunBacktest();
  };

  // Dynamic stats based on strategy blocks
  const getDynamicStats = () => {
    switch (strategyBlocks.length) {
      case 1: return { 
        return: '+45.12%', sharpe: '0.82', dd: '-22.50%', win: '42.1%', 
        yMax: '50%', yMid: '25%',
        path: 'M20,110 L40,105 L70,108 L100,95 L140,98 L180,85 L220,90 L260,82 L300,80' 
      };
      case 2: return { 
        return: '+128.40%', sharpe: '1.35', dd: '-18.20%', win: '54.8%', 
        yMax: '150%', yMid: '75%',
        path: 'M20,110 L40,95 L70,102 L100,80 L140,85 L180,65 L220,70 L260,55 L300,50' 
      };
      case 3: 
      default: return { 
        return: '+245.36%', sharpe: '1.84', dd: '-12.35%', win: '68.42%', 
        yMax: '250%', yMid: '125%',
        path: 'M20,110 L40,85 L70,95 L100,60 L140,70 L180,40 L220,50 L260,20 L300,10' 
      };
    }
  };
  const currentStats = getDynamicStats();

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px 0px rgba(99, 102, 241, 0.2); } 50% { box-shadow: 0 0 40px 5px rgba(99, 102, 241, 0.5); } }
        @keyframes dataFlowLeftToRight { 0% { background-position: 100% 50%; } 100% { background-position: -100% 50%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }
        .animate-blink { animation: blink 1s infinite; }
        
        .glass-panel {
          background: rgba(15, 17, 26, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }
        
        .interactive-hover:hover {
          border-color: rgba(99, 102, 241, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
        }

        .text-gradient {
          background: linear-gradient(to right, #818cf8, #c084fc, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .data-stream-active {
          background: linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.8) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: dataFlowLeftToRight 1s linear infinite;
        }
        
        .data-stream-idle {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: dataFlowLeftToRight 3s linear infinite;
        }

        .chart-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 3s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); rounded-full; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#07090E]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
               <BarChart3 size={18} className="text-white relative z-10" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Tradeshift</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#moat" className="hover:text-indigo-400 transition-colors">The Engine</a>
            <a href="#interactive-features" className="hover:text-indigo-400 transition-colors">Platform</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById('waitlist-form')?.scrollIntoView()} className="bg-white hover:bg-slate-200 text-black px-5 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-blink"></span>
              SYSTEM STATUS: HEALTHY & ONLINE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              The AI-Native <br/>
              <span className="text-gradient">Trading Operating System.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect your brokers, stream live data, and let Claude AI drive your backtesting, risk analysis, and trade ideas. Move from market awareness to data-backed execution.
            </p>

            {/* Hero form removed to streamline onboarding */}
          </div>

          {/* Interactive Hero Dashboard Mockup */}
          <div className="relative mx-auto max-w-5xl animate-float">
            <div className="glass-panel rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl relative overflow-hidden bg-[#0A0C14]/90">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="font-mono text-xs text-slate-500 flex gap-4">
                  <span>NIFTY: 22,532.50 <span className="text-green-400">+0.85%</span></span>
                  <span>LATENCY: 12ms</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Side: Portfolio & Grid */}
                <div className="col-span-1 md:col-span-4 space-y-4">
                  {/* Portfolio Card */}
                  <div className={`p-5 rounded-xl border transition-all duration-700 interactive-hover cursor-pointer relative overflow-hidden group ${portfolioFlash ? 'bg-green-500/20 border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.3)]' : 'bg-[#121520] border-white/5'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-transparent"></div>
                    <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Portfolio Value</div>
                    <div className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform origin-left">
                      ₹{portfolioValue.toLocaleString('en-IN')}
                    </div>
                    <div className={`text-sm flex items-center gap-1 transition-colors duration-500 ${portfolioFlash ? 'text-green-300' : 'text-green-400'}`}>
                      <Activity size={14} /> +{portfolioGain.toFixed(2)}% Today
                    </div>
                  </div>

                  {/* AI Strategy Grid Mini */}
                  <div className="bg-[#121520] p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wider">AI Strategy Grid</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded bg-green-500/10 border border-green-500/20 interactive-hover cursor-pointer">
                        <span className="text-sm text-green-400 font-medium">Bullish Breakout</span>
                        <span className="text-xs text-green-400/70 font-mono">68% Conf.</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-yellow-500/10 border border-yellow-500/20 interactive-hover cursor-pointer">
                        <span className="text-sm text-yellow-400 font-medium">Range Trading</span>
                        <span className="text-xs text-yellow-400/70 font-mono">55% Conf.</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-red-500/10 border border-red-500/20 interactive-hover cursor-pointer">
                        <span className="text-sm text-red-400 font-medium">Pullback Sell</span>
                        <span className="text-xs text-red-400/70 font-mono">62% Conf.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Main Chart area */}
                <div className="col-span-1 md:col-span-8 bg-[#121520] rounded-xl border border-white/5 p-5 relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center z-10 mb-4">
                    <span className="text-sm font-semibold text-white">Live Market Pulse</span>
                    <div className="flex gap-2">
                      {['1D', '1W', '1M'].map(tf => (
                        <button 
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-3 py-1 border rounded text-xs transition-colors ${chartTimeframe === tf ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-400'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Realistic Candlestick Chart */}
                  <div className="flex-1 relative w-full mt-4 border-t border-r border-white/5 pt-2 pr-2">
                    {(() => {
                      // Base OHLC Data
                      const baseOhlc = [
                        {o: 100, h: 106, l: 98, c: 104}, {o: 104, h: 107, l: 102, c: 103}, {o: 103, h: 110, l: 101, c: 108},
                        {o: 108, h: 109, l: 105, c: 106}, {o: 106, h: 112, l: 104, c: 110}, {o: 110, h: 115, l: 108, c: 114},
                        {o: 114, h: 118, l: 112, c: 113}, {o: 113, h: 116, l: 109, c: 110}, {o: 110, h: 111, l: 105, c: 106},
                        {o: 106, h: 108, l: 100, c: 102}, {o: 102, h: 106, l: 99, c: 105}, {o: 105, h: 110, l: 103, c: 109},
                        {o: 109, h: 115, l: 108, c: 114}, {o: 114, h: 120, l: 113, c: 119}, {o: 119, h: 125, l: 118, c: 124},
                        {o: 124, h: 126, l: 120, c: 121}, {o: 121, h: 124, l: 119, c: 123}, {o: 123, h: 130, l: 122, c: 128},
                        {o: 128, h: 132, l: 125, c: 126}, {o: 126, h: 128, l: 122, c: 124}, {o: 124, h: 129, l: 123, c: 127},
                      ];
                      
                      // Modify data dynamically based on selected timeframe
                      const ohlc = baseOhlc.map((d, i) => {
                        let multiplier = 1;
                        if (chartTimeframe === '1W') multiplier = 1 + (i * 0.015);
                        if (chartTimeframe === '1M') multiplier = 1 + (i * 0.035);
                        return { o: d.o * multiplier, h: d.h * multiplier, l: d.l * multiplier, c: d.c * multiplier };
                      });

                      const minL = Math.min(...ohlc.map(d => d.l)) - 2;
                      const maxH = Math.max(...ohlc.map(d => d.h)) + 5;
                      const range = maxH - minL;
                      const chartW = 500;
                      const chartH = 200;
                      const stepX = chartW / ohlc.length;
                      
                      return (
                        <svg key={chartTimeframe} viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full overflow-visible">
                          {/* Grid Lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                            <g key={`grid-${i}`}>
                              <line x1="0" y1={chartH * ratio} x2={chartW} y2={chartH * ratio} stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
                              <text x={chartW + 5} y={(chartH * ratio) + 3} fill="rgba(255,255,255,0.3)" fontSize="10">{Math.round(maxH - (range * ratio))}</text>
                            </g>
                          ))}
                          
                          {/* Moving Average Line */}
                          <path 
                            d={`M ${ohlc.map((d, i) => `${i * stepX + (stepX/2)},${chartH - (((d.c + d.o)/2 - minL) / range) * chartH}`).join(' L ')}`} 
                            fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="2" className="chart-path"
                          />

                          {/* Candles */}
                          {ohlc.map((d, i) => {
                            const x = i * stepX + (stepX/2);
                            const yH = chartH - ((d.h - minL) / range) * chartH;
                            const yL = chartH - ((d.l - minL) / range) * chartH;
                            const yO = chartH - ((d.o - minL) / range) * chartH;
                            const yC = chartH - ((d.c - minL) / range) * chartH;
                            const isUp = d.c >= d.o;
                            const color = isUp ? '#4ade80' : '#f87171';
                            const bodyY = Math.min(yO, yC);
                            const bodyH = Math.max(Math.abs(yO - yC), 1);
                            
                            return (
                              <g key={i} className="animate-[fadeIn_1s_ease-out] transition-transform hover:scale-[1.15] cursor-pointer origin-bottom" style={{animationDelay: `${i * 30}ms`}}>
                                <line x1={x} y1={yH} x2={x} y2={yL} stroke={color} strokeWidth="1.5" />
                                <rect x={x - (stepX*0.3)} y={bodyY} width={stepX*0.6} height={bodyH} fill={color} rx="1" />
                              </g>
                            );
                          })}

                          {/* Buy Marker */}
                          <g className="animate-[float_3s_ease-in-out_infinite]" transform={`translate(${11 * stepX + (stepX/2)}, ${chartH - ((ohlc[11].l - minL) / range) * chartH + 15})`}>
                            <polygon points="-5,0 5,0 0,-8" fill="#4ade80" />
                            <rect x="-8" y="2" width="16" height="12" fill="#4ade80" rx="2" />
                            <text x="-4" y="11" fill="#000" fontSize="9" fontWeight="bold">B</text>
                          </g>
                          
                          {/* Live Pulse Indicator */}
                          <circle cx={20 * stepX + (stepX/2)} cy={chartH - ((ohlc[20].c - minL) / range) * chartH} r="4" fill="#4ade80" className="animate-ping" />
                          <circle cx={20 * stepX + (stepX/2)} cy={chartH - ((ohlc[20].c - minL) / range) * chartH} r="3" fill="#4ade80" />
                        </svg>
                      );
                    })()}

                    {/* AI Insight Popup Overlay */}
                    {/* Fixed bounding limits so it spans organically on mobile without overflowing left edge */}
                    {showAiInsight && (
                      <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 w-auto md:w-72 glass-panel p-4 rounded-xl border border-indigo-500/40 shadow-[0_8px_32px_rgba(99,102,241,0.2)] z-20 animate-[float_4s_ease-in-out_infinite]">
                        <button onClick={() => setShowAiInsight(false)} className="absolute top-2 right-2 text-slate-400 hover:text-white"><X size={14}/></button>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles size={14} className="text-indigo-400" />
                          </div>
                          <span className="text-sm font-bold text-indigo-300">Claude AI Insight</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          Strong momentum detected in <span className="font-bold text-white">ICICIBANK</span>. Bullish breakout above 1030 expected based on option chain data. Target 1080.
                        </p>
                        <button 
                          onClick={handleCreateStrategy}
                          disabled={insightActioned}
                          className={`w-full py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 ${insightActioned ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'}`}
                        >
                          {insightActioned ? <><CheckCircle2 size={14}/> Strategy Created</> : 'Auto-Create Strategy'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE MOAT / NERVOUS SYSTEM --- */}
      <section id="moat" className="py-24 relative z-10 bg-[#040508] border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#040508] to-[#040508] pointer-events-none"></div>
        
        {/* Added "relative z-10" so this block is painted ABOVE the absolute background gradient instead of disappearing underneath it */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Nervous System</h2>
            <p className="text-lg text-slate-400">
              The transparent data-flow orchestrator. See exactly how market feeds are ingested, analyzed by AI, and routed for execution in real-time.
            </p>
          </div>

          <div className="relative w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">
              
              {/* Layer 1 */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center mb-8">1. Ingestion Layer</h3>
                {[
                  { id: 'dhan', name: 'Dhan API', type: 'Market Data', color: 'text-green-400', bg: 'bg-green-500/10' },
                  { id: 'ticker', name: 'Tickertape', type: 'Fundamentals', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { id: 'news', name: 'NewsAPI', type: 'Sentiment', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { id: 'kite', name: 'Zerodha Kite', type: 'Account', color: 'text-orange-400', bg: 'bg-orange-500/10' }
                ].map((node) => (
                  <div 
                    key={node.id} 
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`bg-[#0F111A] border ${hoveredNode === node.id ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5'} p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${node.bg} flex items-center justify-center ${node.color}`}>
                        <Database size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{node.name}</div>
                        <div className="text-xs text-slate-500">{node.type}</div>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${hoveredNode === node.id ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-green-500/50'} animate-pulse`}></div>
                  </div>
                ))}
              </div>

              {/* Layer 2 */}
              <div className="flex flex-col items-center justify-center relative py-12">
                <div className="absolute top-1/2 left-[-10%] right-[-10%] h-0.5 -translate-y-1/2 bg-white/5 -z-10 hidden md:block"></div>
                <div className="absolute top-1/2 left-[-10%] w-[60%] h-0.5 -translate-y-1/2 -z-10 hidden md:block overflow-hidden">
                  <div className={`w-full h-full ${hoveredNode ? 'data-stream-active' : 'data-stream-idle'}`}></div>
                </div>
                <div className="absolute top-1/2 right-[-10%] w-[60%] h-0.5 -translate-y-1/2 -z-10 hidden md:block overflow-hidden">
                  <div className={`w-full h-full ${hoveredNode ? 'data-stream-active delay-75' : 'data-stream-idle'}`}></div>
                </div>

                {/* Changed to standard flow on mobile so the text doesn't overlap on top of the circle element, but retains absolute mapping for desktop gridding */}
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center mb-8 relative md:absolute md:top-0">2. Intelligence Engine</h3>
                
                <div className={`w-56 h-56 rounded-full bg-[#0A0C14] flex flex-col items-center justify-center relative border transition-all duration-500 ${hoveredNode ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.3)] scale-105' : 'border-indigo-500/30'}`}>
                  <div className={`absolute inset-0 rounded-full bg-indigo-500/10 blur-xl transition-opacity duration-300 ${hoveredNode ? 'opacity-100' : 'opacity-50'}`}></div>
                  <BrainCircuit size={48} className={`mb-3 transition-colors duration-300 ${hoveredNode ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="font-bold text-white text-xl">Claude 3.5</span>
                  <span className="text-xs text-indigo-400/80 font-mono mt-1">OpenRouter API</span>
                  <div className="absolute inset-[-1px] rounded-full border border-transparent border-t-indigo-500/50 animate-[spin_4s_linear_infinite]"></div>
                  <div className="absolute inset-[-15px] rounded-full border border-transparent border-b-purple-500/30 animate-[spin_6s_linear_infinite_reverse]"></div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center mb-8">3. Outputs & Actions</h3>
                {[
                  { name: 'Market Insights', desc: 'Trends & Patterns', icon: LineChart, triggersOn: ['dhan', 'news'] },
                  { name: 'Trade Ideas', desc: 'High Prob. Setups', icon: Zap, triggersOn: ['ticker', 'dhan'] },
                  { name: 'Risk Engine', desc: 'Assess & Manage', icon: Shield, triggersOn: ['kite', 'ticker'] },
                  { name: 'Broker Execution', desc: 'Smart Order Routing', icon: GitMerge, triggersOn: ['kite'] }
                ].map((action, i) => {
                  const isActive = hoveredNode && action.triggersOn.includes(hoveredNode);
                  return (
                    <div 
                      key={i} 
                      className={`bg-[#0F111A] border ${isActive ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] transform translate-x-1' : 'border-white/5'} p-4 rounded-xl flex items-center gap-4 transition-all duration-300`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                        <action.icon size={18} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>{action.name}</div>
                        <div className="text-xs text-slate-500">{action.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE TABS --- */}
      <section id="interactive-features" className="py-24 relative z-10 bg-[#07090E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            <div className="w-full lg:w-1/3 space-y-4">
              <h2 className="text-3xl font-bold text-white mb-8">Unified Intelligence.</h2>
              
              {[
                { id: 'nervous-system', title: 'Market Overview', desc: 'Real-time breadth & heatmaps.', icon: Globe },
                { id: 'backtesting', title: 'Visual Backtesting', desc: 'Drag-and-drop strategy builder.', icon: Cpu },
                { id: 'learning', title: 'Learning Hub', desc: 'Master markets & earn XP.', icon: Rocket }
              ].map((tab) => (
                <div 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-5 rounded-xl cursor-pointer transition-all border ${
                    activeTab === tab.id 
                      ? 'bg-indigo-500/10 border-indigo-500/50 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                      : 'bg-[#0F111A] border-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400'}`}>
                      <tab.icon size={20} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${activeTab === tab.id ? 'text-white' : 'text-slate-300'}`}>{tab.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{tab.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-2/3">
              <div className="bg-[#0A0C14] border border-white/10 rounded-2xl h-[550px] relative overflow-hidden flex flex-col p-6 shadow-2xl">
                
                {/* 1. MARKET OVERVIEW */}
                {activeTab === 'nervous-system' && (
                  <div className="w-full h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Market Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {['NIFTY 50', 'SENSEX', 'BANKNIFTY', 'FINNIFTY'].map((idx, i) => (
                        <div key={idx} className="bg-[#121520] p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-slate-500 mb-1">{idx}</div>
                          <div className="text-sm font-bold text-white">{(22000 + i*1500).toLocaleString()}.50</div>
                          <div className="text-[10px] text-green-400 mt-1">+0.85%</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-6">
                      <div className="bg-[#121520] rounded-xl border border-white/5 p-4 flex-1 flex flex-col justify-center items-center relative">
                        <div className="text-xs text-slate-400 absolute top-4 left-4">Market Breadth</div>
                        <div className="w-32 h-32 rounded-full border-[12px] border-green-500/80 border-r-red-500/80 border-t-slate-500/50 mt-4"></div>
                        <div className="flex gap-4 text-[10px] mt-4">
                          <span className="text-green-400">Adv: 1,564</span>
                          <span className="text-red-400">Dec: 812</span>
                        </div>
                      </div>

                      <div className="bg-[#121520] rounded-xl border border-white/5 p-4 flex-[2] flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-xs text-slate-400">Market Heatmap</div>
                          <div className="flex gap-1">
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[10px]">NIFTY 50</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 grid-rows-2 gap-2 flex-1">
                          {[
                            { s: 'RELIANCE', c: 'bg-green-500/40 hover:bg-green-500/60', v: '+1.25%' },
                            { s: 'HDFCBANK', c: 'bg-green-500/20 hover:bg-green-500/40', v: '+0.85%' },
                            { s: 'INFY', c: 'bg-red-500/40 hover:bg-red-500/60', v: '-0.32%' },
                            { s: 'TCS', c: 'bg-green-500/30 hover:bg-green-500/50', v: '+1.10%' },
                            { s: 'SBIN', c: 'bg-red-500/20 hover:bg-red-500/40', v: '-0.15%' },
                            { s: 'ICICIBANK', c: 'bg-green-500/50 hover:bg-green-500/70', v: '+1.65%' }
                          ].map((stock, i) => (
                            <div key={i} className={`${stock.c} rounded flex flex-col items-center justify-center cursor-pointer transition-colors border border-white/5`}>
                              <span className="text-[10px] font-bold text-white">{stock.s}</span>
                              <span className="text-[10px] text-white/80">{stock.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. BACKTESTING */}
                {activeTab === 'backtesting' && (
                  <div className={`w-full h-full flex flex-col animate-[fadeIn_0.5s_ease-out] overflow-hidden transition-all duration-300 ${flashEffect ? 'opacity-40 blur-[2px] scale-[0.99]' : 'opacity-100 blur-0 scale-100'}`}>
                    
                    {/* Header Pipeline */}
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-1.5 md:gap-4 overflow-x-auto custom-scrollbar whitespace-nowrap">
                        {[
                          { num: 1, text: 'Strategy Setup', active: true },
                          { num: 2, text: 'Configure Variables' },
                          { num: 3, text: 'Data & Market' },
                          { num: 4, text: 'Run Backtest' },
                          { num: 5, text: 'Analyze Results' }
                        ].map((step, i) => (
                          <div key={i} className={`flex items-center gap-2 ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step.active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{step.num}</div>
                            <span className={`text-xs ${step.active ? 'text-white font-semibold' : 'text-slate-400'}`}>{step.text}</span>
                            {i < 4 && <ChevronRight size={12} className="text-slate-600 ml-1" />}
                          </div>
                        ))}
                      </div>
                      <button onClick={handleNewBacktest} className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex-shrink-0 ml-4">
                        <Plus size={14}/> New Backtest
                      </button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
                      
                      {/* Col 1: Builder & Data */}
                      <div className="md:col-span-4 flex flex-col gap-4">
                        <div className="bg-[#121520] rounded-xl border border-white/5 p-3 flex flex-col flex-1">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-[10px] font-bold text-white">1. Strategy Builder</div>
                            <div className="flex bg-[#0A0C14] rounded p-0.5">
                              <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-semibold">Visual</div>
                              <div className="px-2 py-0.5 rounded text-slate-500 text-[9px]">Pine Script</div>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5">
                            {strategyBlocks.map((block, i) => (
                              <div key={i} className="relative">
                                <div className={`p-2 rounded border flex justify-between items-start gap-2 ${i===0 ? 'bg-green-500/10 border-green-500/30' : i===1 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                  <div className="w-4 h-4 mt-0.5 rounded bg-[#0A0C14] flex items-center justify-center flex-shrink-0 border border-white/10">
                                    <Activity size={10} className={i===0 ? 'text-green-400' : i===1 ? 'text-yellow-400' : 'text-red-400'}/>
                                  </div>
                                  <div className="flex-1 text-[10px] text-slate-300 leading-tight">
                                    <span className={`font-bold block mb-0.5 ${i===0 ? 'text-green-400' : i===1 ? 'text-yellow-400' : 'text-red-400'}`}>{block.split(':')[0]}</span>
                                    {block.split(':')[1]}
                                  </div>
                                  <CheckCircle2 size={12} className="text-green-500/80" />
                                </div>
                                {i < strategyBlocks.length - 1 && <div className="w-0.5 h-3 bg-white/10 mx-auto"></div>}
                              </div>
                            ))}
                            {strategyBlocks.length < 3 && (
                              <>
                                <div className="w-0.5 h-2 bg-white/10 mx-auto"></div>
                                <button onClick={addStrategyBlock} className="w-full py-1.5 rounded border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 text-[10px] flex items-center justify-center gap-1 transition-all">
                                  <Plus size={12} /> Add Block
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-[#121520] rounded-xl border border-white/5 p-3">
                          <div className="text-[10px] font-bold text-white mb-2">3. Data & Market</div>
                          <div className="space-y-2">
                            <div>
                              <div className="text-[9px] text-slate-500 mb-0.5">Select Data Source</div>
                              <div onClick={cycleDataSource} className="p-1.5 rounded bg-[#0A0C14] border border-white/10 text-[10px] flex items-center justify-between cursor-pointer hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.1)] transition-all group">
                                <div className="flex items-center gap-2">
                                  <Database size={10} className="text-green-400 group-hover:scale-110 transition-transform"/> {dataSource}
                                </div>
                                <ChevronRight size={10} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <div className="text-[9px] text-slate-500 mb-0.5">Asset</div>
                                <div className="p-1.5 rounded bg-[#0A0C14] border border-white/10 text-[10px]">NIFTY 50</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-[9px] text-slate-500 mb-0.5">Frequency</div>
                                <div className="p-1.5 rounded bg-[#0A0C14] border border-white/10 text-[10px] text-indigo-400 font-bold">15m</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Col 2: Variables & Results Toggle */}
                      <div className="md:col-span-5 flex flex-col gap-4">
                        <div className="bg-[#121520] rounded-xl border border-white/5 p-3">
                           <div className="flex justify-between items-center mb-2">
                             <div className="text-[10px] font-bold text-white">2. Configure Variables</div>
                             <div className="text-[9px] text-indigo-400 flex items-center gap-1 cursor-pointer"><Sparkles size={10}/> Optimize with AI</div>
                           </div>
                           <table className="w-full text-left text-[9px]">
                             <thead className="text-slate-500 border-b border-white/5">
                               <tr><th className="pb-1">Parameter</th><th className="pb-1">Start</th><th className="pb-1">End</th><th className="pb-1">Step</th></tr>
                             </thead>
                             <tbody className="text-slate-300">
                               {[
                                 { p: 'EMA Fast', s: 5, e: 50, st: 5 },
                                 { p: 'EMA Slow', s: 10, e: 200, st: 10 },
                                 { p: 'RSI Period', s: 7, e: 21, st: 1 },
                               ].map((row, i) => (
                                 <tr key={i} className="border-b border-white/5 last:border-0">
                                   <td className="py-1.5">{row.p}</td>
                                   <td className="py-1.5"><span className="bg-[#0A0C14] px-1.5 py-0.5 rounded">{row.s}</span></td>
                                   <td className="py-1.5"><span className="bg-[#0A0C14] px-1.5 py-0.5 rounded">{row.e}</span></td>
                                   <td className="py-1.5"><span className="bg-[#0A0C14] px-1.5 py-0.5 rounded">{row.st}</span></td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>

                        <div className="bg-[#121520] rounded-xl border border-white/5 p-3 flex-1 flex flex-col relative overflow-hidden">
                           {isSimulating && <div className="absolute inset-0 bg-indigo-500/5 z-20 animate-[scanline_1s_linear_infinite] border-b border-indigo-500/30"></div>}
                           
                           <div className="flex justify-between items-center mb-2 relative z-30">
                             <div className="text-[10px] font-bold text-white">5. Results Explorer</div>
                             <div className="flex gap-2 text-[9px]">
                               <button onClick={() => setResultsView('heatmap')} className={`transition-all ${resultsView === 'heatmap' ? 'text-indigo-400 border-b border-indigo-400 pb-0.5' : 'text-slate-500 hover:text-slate-300'}`}>Heatmap</button>
                               <button onClick={() => setResultsView('table')} className={`transition-all ${resultsView === 'table' ? 'text-indigo-400 border-b border-indigo-400 pb-0.5' : 'text-slate-500 hover:text-slate-300'}`}>Table</button>
                             </div>
                           </div>
                           
                           {resultsView === 'heatmap' ? (
                             <div className="flex-1 flex flex-col justify-end relative mt-2 animate-[fadeIn_0.3s_ease-out]">
                               <div className="text-[8px] text-slate-500 absolute -top-1 left-0">Y: EMA Slow</div>
                               <div className="text-[8px] text-slate-500 absolute bottom-0 right-0">X: EMA Fast</div>
                               <div className="grid grid-cols-10 gap-0.5 w-full h-[80px] pl-4 pb-3">
                                 {[...Array(50)].map((_, i) => {
                                   const peakIndex = 34 - (3 - strategyBlocks.length) * 5;
                                   const isPeak = i === peakIndex;
                                   const dist = Math.abs((peakIndex % 10) - (i % 10)) + Math.abs(Math.floor(peakIndex / 10) - Math.floor(i / 10));
                                   const colorClass = isPeak ? 'bg-green-400 z-10 border border-white scale-[1.3] shadow-[0_0_10px_#4ade80]' : dist < 2 ? 'bg-green-600/80' : dist < 4 ? 'bg-indigo-500/80' : dist < 6 ? 'bg-indigo-800/80' : 'bg-purple-900/60';
                                   return (
                                     <div key={i} className={`rounded-[1px] relative group ${colorClass} hover:border hover:border-white transition-all duration-500`}>
                                       {isPeak && <div className="absolute -top-6 -left-6 bg-white text-black text-[8px] font-bold px-1 py-0.5 rounded whitespace-nowrap shadow-lg z-20">{currentStats.return}</div>}
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>
                           ) : (
                             <div className="flex-1 overflow-y-auto custom-scrollbar mt-1 pr-1 animate-[fadeIn_0.3s_ease-out]">
                               <table className="w-full text-left text-[9px]">
                                 <thead className="text-slate-500 sticky top-0 bg-[#121520] z-10 shadow-[0_2px_10px_#121520]">
                                   <tr>
                                     <th className="pb-2 font-normal">Run ID</th>
                                     <th className="pb-2 font-normal">EMA Fast</th>
                                     <th className="pb-2 font-normal">EMA Slow</th>
                                     <th className="pb-2 font-normal text-right">Return</th>
                                   </tr>
                                 </thead>
                                 <tbody className="text-slate-300">
                                   {[...Array(15)].map((_, i) => (
                                     <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                       <td className="py-1.5 text-slate-500 group-hover:text-slate-300 font-mono">#{10800 - i}</td>
                                       <td className="py-1.5">{20 + (i % 3) * 5}</td>
                                       <td className="py-1.5">{50 + (i % 4) * 10}</td>
                                       <td className={`py-1.5 text-right font-medium ${i === 0 ? 'text-green-400' : ''}`}>
                                         {i === 0 ? currentStats.return : `+${(parseFloat(currentStats.return.replace(/[^0-9.-]+/g, "")) - (i * 2.1)).toFixed(2)}%`}
                                       </td>
                                     </tr>
                                   ))}
                                 </tbody>
                               </table>
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Col 3: Summary & Detailed Curve */}
                      <div className="md:col-span-3 flex flex-col gap-4">
                        <div className="bg-[#121520] rounded-xl border border-white/5 p-3 flex-1">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-[10px] font-bold text-white">Performance Summary</div>
                            <div className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">Rank #1</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                            <div>
                              <div className="text-[8px] text-slate-500 transition-colors duration-300">Total Return</div>
                              <div className={`text-sm font-bold transition-all duration-300 ${isSimulating ? 'text-slate-500 opacity-50 blur-[2px]' : 'text-green-400 opacity-100 blur-0'}`}>{currentStats.return}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-slate-500">Sharpe Ratio</div>
                              <div className={`text-sm font-bold transition-all duration-300 ${isSimulating ? 'text-slate-500 opacity-50 blur-[2px]' : 'text-white opacity-100 blur-0'}`}>{currentStats.sharpe}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-slate-500">Max Drawdown</div>
                              <div className={`text-sm font-bold transition-all duration-300 ${isSimulating ? 'text-slate-500 opacity-50 blur-[2px]' : 'text-red-400 opacity-100 blur-0'}`}>{currentStats.dd}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-slate-500">Win Rate</div>
                              <div className={`text-sm font-bold transition-all duration-300 ${isSimulating ? 'text-slate-500 opacity-50 blur-[2px]' : 'text-white opacity-100 blur-0'}`}>{currentStats.win}</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-slate-400">Equity Curve</span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[8px] text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Strategy</span>
                              <span className="flex items-center gap-1 text-[8px] text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> Benchmark</span>
                            </div>
                          </div>
                          
                          <div className={`h-28 w-full relative mt-2 transition-all duration-500 ${isSimulating ? 'opacity-30 grayscale' : 'opacity-100 grayscale-0'}`}>
                             <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible preserve-3d transition-all duration-500">
                                <line x1="20" y1="10" x2="320" y2="10" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2"/>
                                <line x1="20" y1="60" x2="320" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2"/>
                                <line x1="20" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,0.2)" />
                                
                                <text x="15" y="14" fill="#64748b" fontSize="8" textAnchor="end">{currentStats.yMax}</text>
                                <text x="15" y="64" fill="#64748b" fontSize="8" textAnchor="end">{currentStats.yMid}</text>
                                <text x="15" y="114" fill="#64748b" fontSize="8" textAnchor="end">0%</text>

                                <text x="25" y="125" fill="#64748b" fontSize="8">Jan</text>
                                <text x="170" y="125" fill="#64748b" fontSize="8" textAnchor="middle">Jun</text>
                                <text x="315" y="125" fill="#64748b" fontSize="8" textAnchor="end">Dec</text>

                                <path d={`${currentStats.path} L300,110 L20,110 Z`} fill="url(#curveGradient)" />
                                <path d="M20,110 Q80,105 150,90 T300,80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                                <path d={currentStats.path} fill="none" stroke="#4ade80" strokeWidth="1.5" className="chart-path drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" key={strategyBlocks.length} />
                                
                                <defs>
                                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(74, 222, 128, 0.25)" />
                                    <stop offset="100%" stopColor="transparent" />
                                  </linearGradient>
                                </defs>
                             </svg>
                          </div>
                        </div>

                        <div className="bg-[#121520] rounded-xl border border-white/5 p-3">
                           <div className="text-[10px] font-bold text-white mb-2 flex justify-between">
                             <span>4. Backtest Execution</span>
                             {isSimulating && <div className="flex gap-1 items-center"><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div></div>}
                           </div>
                           <div className="flex justify-between text-[9px] mb-1">
                             <span className={`${isSimulating ? 'text-indigo-400' : 'text-green-400'} font-semibold transition-colors`}>{isSimulating ? 'Running Backtest...' : 'Execution Complete'}</span>
                             <span className="text-slate-400">{backtestProgress}%</span>
                           </div>
                           <div className="w-full h-1 bg-[#0A0C14] rounded-full overflow-hidden mb-2">
                             <div className={`h-full transition-all duration-200 ease-out ${isSimulating ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-green-500 shadow-[0_0_8px_#4ade80]'}`} style={{width: `${backtestProgress}%`}}></div>
                           </div>
                           <div className="flex justify-between text-[9px] text-slate-500">
                             <span className="font-mono">Prog: {Math.floor(10800 * (backtestProgress/100)).toLocaleString()} / 10,800</span>
                             <span className="font-mono">Est: {isSimulating ? `00:00:${Math.floor(33 * (1 - backtestProgress/100)).toString().padStart(2, '0')}` : '00:00:00'}</span>
                           </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. LEARNING HUB */}
                {activeTab === 'learning' && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)] animate-float">
                      <span className="text-3xl font-bold text-white">Lvl.4</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Earn While You Learn</h3>
                    <p className="text-sm text-slate-400 max-w-sm mb-8">Complete modules on Options & Market Psychology to earn XP and unlock premium broker integrations.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                       <div className="bg-[#121520] border border-white/5 p-4 rounded-xl text-left hover:border-indigo-500/30 transition-colors cursor-pointer">
                         <div className="flex justify-between items-center mb-3">
                           <div className="text-sm font-bold text-white">Technical Analysis</div>
                           <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Intermediate</span>
                         </div>
                         <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                           <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                         </div>
                         <div className="text-[10px] text-slate-500 text-right">75% Complete</div>
                       </div>
                       <div className="bg-[#121520] border border-white/5 p-4 rounded-xl text-left hover:border-indigo-500/30 transition-colors cursor-pointer">
                         <div className="flex justify-between items-center mb-3">
                           <div className="text-sm font-bold text-white">Risk Management</div>
                           <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400">Advanced</span>
                         </div>
                         <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                           <div className="bg-green-500 h-1.5 rounded-full" style={{width: '90%'}}></div>
                         </div>
                         <div className="text-[10px] text-slate-500 text-right">90% Complete</div>
                       </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA & FOOTER --- */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-[#040508] overflow-hidden text-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/10 rounded-[100%] blur-[120px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <BrainCircuit size={48} className="text-indigo-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to trade with an edge?</h2>
          <p className="text-lg text-slate-400 mb-10">
            Join the exclusive waitlist to secure your spot. We're rolling out access in batches to ensure system stability.
          </p>
          <form id="waitlist-form" onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto flex flex-col gap-4 mb-16">


            <div className="w-full">
              <input 
                type="email" 
                value={waitlistEmail}
                onChange={(e) => {
                  setWaitlistEmail(e.target.value);
                  setWaitlistErrors(prev => ({...prev, email: undefined}));
                }}
                placeholder="Email Address" 
                className={`w-full bg-[#0F111A] border ${waitlistErrors.email ? 'border-red-500' : 'border-white/10'} rounded-none py-4 px-6 text-white focus:outline-none focus:border-indigo-500 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:-translate-x-2`}
                disabled={waitlistStatus !== 'idle'}
              />
              {waitlistErrors.email && <p className="text-red-500 text-xs mt-1 text-left px-2">{waitlistErrors.email}</p>}
            </div>

            <button 
              type="submit"
              disabled={waitlistStatus !== 'idle'}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black py-4 px-6 rounded-none font-bold transition-all flex items-center justify-center mt-4 -skew-x-12"
            >
               <span className="skew-x-12 flex items-center justify-center gap-2">
                 {waitlistStatus === 'idle' ? 'RESERVE SPOT' : waitlistStatus === 'loading' ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : 'RESERVED!'}
               </span>
            </button>
          </form>
          {waitlistErrors.general && <p className="text-red-500 text-sm mt-4 text-center font-medium animate-[fadeIn_0.3s_ease-out]">{waitlistErrors.general}</p>}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <BarChart3 size={14} />
             <span className="font-bold">Tradeshift Engine</span>
             <span className="ml-2">&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </section>

    </div>
  );
}