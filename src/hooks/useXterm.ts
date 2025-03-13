import { useState, useEffect } from 'react';

// Dynamic import with proper error handling
export const useDynamicTerminal = () => {
  const [Terminal, setTerminal] = useState<React.ComponentType<{logs: string[]}> | null>(null);
  const [FallbackTerminal, setFallbackTerminal] = useState<React.ComponentType<{logs: string[]}> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTerminalComponents = async () => {
      try {
        const terminalModule = await import('@/components/terminal/Terminal');
        const fallbackModule = await import('@/components/terminal/FallbackTerminal');
        
        setTerminal(() => terminalModule.default);
        setFallbackTerminal(() => fallbackModule.default);
        setLoading(false);
      } catch (err) {
        console.error('Error loading terminal components:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading terminal'));
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

// XTerm modules loading
export const useXtermModules = () => {
  const [modules, setModules] = useState<{
    xterm: any | null;
    fitAddon: any | null;
    webLinksAddon: any | null;
  }>({
    xterm: null,
    fitAddon: null,
    webLinksAddon: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server-side

    const loadModules = async () => {
      try {
        // Load XTerm modules dynamically
        const xtermModule = await import('@xterm/xterm');
        const fitAddonModule = await import('@xterm/addon-fit');
        const webLinksAddonModule = await import('@xterm/addon-web-links');

        setModules({
          xterm: xtermModule,
          fitAddon: fitAddonModule,
          webLinksAddon: webLinksAddonModule
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading XTerm modules:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading XTerm modules'));
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return { modules, loading, error };
};

export default useXtermModules;