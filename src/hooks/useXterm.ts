// src/hooks/useXterm.ts
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for the Terminal component
export const DynamicTerminal = dynamic(
  () => import('@/components/terminal/Terminal'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full rounded-lg overflow-auto bg-gray-900 p-4 font-mono text-sm text-white">
        Loading terminal...
      </div>
    )
  }
);

// Load XTerm modules
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
        // Load modules
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