// src/components/terminal/Terminal.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useXtermModules } from '@/hooks/useXterm';
import FallbackTerminal from './FallbackTerminal';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<any | null>(null);
  const [fitAddon, setFitAddon] = useState<any | null>(null);
  const { modules, loading, error } = useXtermModules();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize terminal
  useEffect(() => {
    if (!isClient) return;
    
    // Check if modules are loaded and terminal element exists
    if (terminalRef.current && modules.xterm && !loading && !error) {
      // Clean up any previous terminal instance
      if (terminal) {
        terminal.dispose();
      }

      try {
        // Create new terminal and fit addon
        const XTerm = modules.xterm.Terminal;
        const FitAddon = modules.fitAddon.FitAddon;
        
        const newTerminal = new XTerm({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          theme: {
            background: '#1e1e1e',
            foreground: '#f0f0f0',
            cursor: '#ffffff',
            selectionBackground: '#4d4d4d',
            black: '#000000',
            red: '#e06c75',
            green: '#98c379',
            yellow: '#e5c07b',
            blue: '#61afef',
            magenta: '#c678dd',
            cyan: '#56b6c2',
            white: '#ffffff',
          },
          allowTransparency: true,
          scrollback: 1000,
        });

        const newFitAddon = new FitAddon();
        newTerminal.loadAddon(newFitAddon);
        
        // Add web links addon if available
        if (modules.webLinksAddon) {
          const WebLinksAddon = modules.webLinksAddon.WebLinksAddon;
          newTerminal.loadAddon(new WebLinksAddon());
        }
        
        // Open the terminal in the container element
        newTerminal.open(terminalRef.current);
        
        // Set the terminal size to fit its container
        setTimeout(() => {
          if (newFitAddon) {
            try {
              newFitAddon.fit();
            } catch (error) {
              console.error('Error fitting terminal:', error);
            }
          }
        }, 100);

        // Store the terminal and fitAddon in state
        setTerminal(newTerminal);
        setFitAddon(newFitAddon);

        // Add resize event listener
        const handleResize = () => {
          if (newFitAddon) {
            try {
              newFitAddon.fit();
            } catch (error) {
              console.error('Error fitting terminal on resize:', error);
            }
          }
        };

        window.addEventListener('resize', handleResize);

        // Initial log output
        newTerminal.writeln('Terminal initialized and ready.');
        newTerminal.writeln('');

        // Return cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          newTerminal.dispose();
        };
      } catch (error) {
        console.error('Error initializing terminal:', error);
      }
    }
  }, [modules, loading, error, isClient]);

  // Write logs to the terminal
  useEffect(() => {
    if (terminal && logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      
      // Process command coloring - commands starting with $ get a special color
      if (lastLog.startsWith('$ ')) {
        terminal.write('\x1b[33m'); // Yellow color for commands
        terminal.write(lastLog.substring(0, 2));
        terminal.write('\x1b[0m'); // Reset color
        terminal.writeln(lastLog.substring(2));
      } 
      // Process progress indicators
      else if (lastLog.includes('Progress:')) {
        terminal.write('\x1b[36m'); // Cyan for progress
        terminal.writeln(lastLog);
        terminal.write('\x1b[0m'); // Reset color
      }
      // Success messages (completed or success)
      else if (lastLog.includes('successfully') || lastLog.includes('complete')) {
        terminal.write('\x1b[32m'); // Green for success
        terminal.writeln(lastLog);
        terminal.write('\x1b[0m'); // Reset color
      }
      // Error messages
      else if (lastLog.includes('error') || lastLog.includes('fail')) {
        terminal.write('\x1b[31m'); // Red for errors
        terminal.writeln(lastLog);
        terminal.write('\x1b[0m'); // Reset color
      }
      // Default text
      else {
        terminal.writeln(lastLog);
      }
    }
  }, [logs, terminal]);

  // Display loading state or error
  if (!isClient || loading) {
    return (
      <div className="h-96 w-full rounded-lg bg-gray-800 p-4 font-mono text-gray-300 animate-pulse">
        Loading terminal...
      </div>
    );
  }

  if (error || !modules.xterm) {
    return <FallbackTerminal logs={logs} />;
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
};

export default Terminal;