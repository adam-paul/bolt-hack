import React, { useEffect, useState, useRef } from 'react';
import { Trophy } from 'lucide-react';

// Simple SVG icons instead of using Lucide React to avoid resource issues
const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

const TrophyIcon = () => (
  <Trophy className="mr-2" />
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    // Reset display text when component mounts or text changes
    setDisplayText('');
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        if (onComplete) {
          onComplete();
        }
      }
    }, 100);
    
    // Cleanup timer on unmount or text change
    return () => clearInterval(timer);
  }, [text, onComplete]);

  return displayText;
}

function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<JSX.Element[]>([]);
  const matrixSymbols = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝZ";

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous columns
    setColumns([]);
    
    // Calculate the number of columns based on screen width
    const containerWidth = window.innerWidth;
    const columnWidth = 30; // Same as in CSS
    const columnCount = Math.floor(containerWidth / columnWidth);
    
    // Create columns
    const newColumns: JSX.Element[] = [];
    
    for (let i = 0; i < columnCount; i++) {
      const columnSymbols: JSX.Element[] = [];
      const columnLength = 10 + Math.floor(Math.random() * 20); // Random length between 10-30
      
      // Create symbols for this column
      for (let j = 0; j < columnLength; j++) {
        const randomSymbol = matrixSymbols.charAt(Math.floor(Math.random() * matrixSymbols.length));
        const delay = Math.random() * 0.5; // Random delay for each symbol
        const brightness = j === 0 ? 0.85 : Math.random() * 0.4 + 0.15; // First character brighter but more subtle overall
        
        columnSymbols.push(
          <span 
            key={`symbol-${i}-${j}`} 
            className="matrix-symbol"
            style={{ 
              animationDelay: `${delay}s`,
              opacity: brightness,
              color: j === 0 ? 'rgba(255, 255, 255, 0.85)' : undefined // First character white but slightly transparent
            }}
          >
            {randomSymbol}
          </span>
        );
      }
      
      // Create column with random properties
      const columnSpeed = 5 + Math.random() * 15; // Random speed between 5-20s
      const columnDelay = Math.random() * 10; // Random delay between 0-10s
      const columnLeft = i * columnWidth + Math.random() * 10 - 5; // Random horizontal offset
      
      newColumns.push(
        <div
          key={`column-${i}`}
          className="matrix-column"
          style={{
            left: `${columnLeft}px`,
            animationDuration: `${columnSpeed}s`,
            animationDelay: `${columnDelay}s`
          }}
        >
          {columnSymbols}
        </div>
      );
    }
    
    setColumns(newColumns);
    
    // Recreate columns on window resize
    const handleResize = () => {
      // Trigger a re-render by forcing a state change
      setColumns(prev => {
        setTimeout(() => setColumns([]), 0);
        return prev;
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div ref={containerRef} className="matrix-container">
      {columns}
    </div>
  );
}

function App() {
  // Stage management for the landing sequence
  const [stage, setStage] = useState<'intro' | 'typing' | 'execute' | 'matrix' | 'content'>('intro');
  const [typingFirstLine, setTypingFirstLine] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showMatrixRain, setShowMatrixRain] = useState(false);

  const judges = [
    {
      name: "Sarah Connor",
      role: "AI Ethics Expert",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Neo Anderson",
      role: "Cybersecurity Specialist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Trinity Wells",
      role: "Quantum Computing Lead",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  // Start with blinking cursor only
  useEffect(() => {
    // After a short delay, transition to typing stage
    const timer = setTimeout(() => {
      setStage('typing');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle the sequence transitions
  useEffect(() => {
    if (stage === 'execute') {
      // Show matrix rain right away
      setShowMatrixRain(true);
      
      // After a short delay, show content
      const timer = setTimeout(() => {
        setStage('content');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      {/* Only show MatrixRain after the execute stage */}
      {showMatrixRain && <MatrixRain />}
      
      {/* Landing sequence container - full screen */}
      {stage !== 'content' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            {stage === 'intro' && (
              <span className="text-3xl animate-pulse">█</span>
            )}
            
            {stage === 'typing' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center text-2xl md:text-3xl">
                  <TerminalIcon />
                  <span>
                    {typingFirstLine ? (
                      <>
                        <TypewriterText 
                          text="largest_hackathon.exe" 
                          onComplete={() => {
                            setTypingFirstLine(false);
                          }}
                        />
                        <span className="ml-1 animate-pulse">█</span>
                      </>
                    ) : (
                      "largest_hackathon.exe"
                    )}
                  </span>
                </div>
                
                {!typingFirstLine && (
                  <div className="flex items-center text-2xl md:text-3xl">
                    <span className="ml-8"></span>
                    <span>
                      <TypewriterText 
                        text=".\/execute" 
                        onComplete={() => {
                          setTimeout(() => {
                            setTypingComplete(true);
                            setStage('execute');
                          }, 800);
                        }}
                      />
                      {!typingComplete && <span className="ml-1 animate-pulse">█</span>}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {stage === 'execute' && (
              <div className="animate-fadeOut flex flex-col items-center space-y-4">
                <div className="flex items-center text-2xl md:text-3xl">
                  <TerminalIcon />
                  <span>largest_hackathon.exe</span>
                </div>
                <div className="flex items-center text-2xl md:text-3xl">
                  <span className="ml-8"></span>
                  <span>./execute</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main content - only displayed after the animation sequence */}
      <div className={`relative z-10 container mx-auto px-4 py-16 transition-opacity duration-1000 ${stage === 'content' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-20">
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-5xl font-bold glitch-text">WORLD'S LARGEST HACKATHON</h1>
            <div className="space-y-2 text-xl">
              <p className="flex items-center justify-center"><MapPinIcon />_location = cyberspace</p>
              <p className="flex items-center justify-center"><CalendarIcon />_date = tbd</p>
              <p className="flex items-center justify-center"><TrophyIcon />_prizes = 1_million_USD</p>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <h2 className="text-3xl text-center mb-16 glitch-text">// JUDGES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {judges.map((judge, index) => (
              <div key={index} className="bg-black/50 border border-green-500 p-6 rounded-lg hover:bg-green-500/10 transition-all">
                <img 
                  src={judge.image} 
                  alt={judge.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-green-500"
                />
                <h3 className="text-xl text-center">{judge.name}</h3>
                <p className="text-center text-green-400">{judge.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32">
          <h2 className="text-3xl text-center mb-16 glitch-text">// SPONSORS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center aspect-square border-2 border-green-500 rounded-lg hover:border-green-400 transition-all p-4">
              <div className="text-xl font-mono text-green-400">ACME Corp</div>
            </div>
            <div className="flex items-center justify-center aspect-square border-2 border-green-500 rounded-lg hover:border-green-400 transition-all p-4">
              <div className="text-xl font-mono text-green-400">Quantum Solutions</div>
            </div>
            <div className="flex items-center justify-center aspect-square border-2 border-green-500 rounded-lg hover:border-green-400 transition-all p-4">
              <div className="text-xl font-mono text-green-400">Cipher Security</div>
            </div>
            <div className="flex items-center justify-center aspect-square border-2 border-green-500 rounded-lg hover:border-green-400 transition-all p-4">
              <div className="text-xl font-mono text-green-400">NexGen Labs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
