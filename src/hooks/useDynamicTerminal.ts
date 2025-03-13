// src/hooks/useDynamicTerminal.ts
import { useState, useEffect } from 'react';

/**
 * A hook to dynamically import terminal components.
 * 
 * This helps with code splitting and reduces the initial load
 * for users who don't interact with the terminal functionality.
 * 
 * @returns Object containing Terminal, FallbackTerminal, loading state, and error
 */
export const useDynamicTerminal = () => {
  // Interactive Terminal is larger and has dependencies, so we load it dynamically
  const [Terminal, setTerminal] = useState<React.ComponentType<any> | null>(null);
  
  // FallbackTerminal is much simpler, so we load it directly
  const [FallbackTerminal, setFallbackTerminal] = useState<React.ComponentType<any> | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip in SSR context
    if (typeof window === 'undefined') return;
    
    const loadTerminalComponents = async () => {
      try {
        // Dynamically import both components
        const [interactiveModule, fallbackModule] = await Promise.all([
          import('@/components/terminal/InteractiveTerminal'),
          import('@/components/terminal/FallbackTerminal')
        ]);
        
        setTerminal(() => interactiveModule.default);
        setFallbackTerminal(() => fallbackModule.default);
        setLoading(false);
      } catch (err) {
        console.error('Error loading terminal components:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading terminal'));
        
        // Try to load at least the fallback
        try {
          const fallbackModule = await import('@/components/terminal/FallbackTerminal');
          setFallbackTerminal(() => fallbackModule.default);
        } catch (fallbackErr) {
          console.error('Error loading fallback terminal:', fallbackErr);
        }
        
        setLoading(false);
      }
    };

    loadTerminalComponents();
  }, []);

  return { 
    Terminal, 
    FallbackTerminal, 
    loading, 
    error 
  };
};

export default useDynamicTerminal;