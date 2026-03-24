/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Settings, 
  Search, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Link as LinkIcon, 
  Quote, 
  Download, 
  FileCode, 
  Info,
  Rocket,
  X,
  Command,
  ChevronRight,
  Palette,
  Sun,
  Moon,
  Leaf,
  Flower2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

type ViewMode = 'zen' | 'split';
type Theme = 'default' | 'archive' | 'sage' | 'rose';

const INITIAL_CONTENT = `# The Art of Distraction-Free Writing

In an era defined by constant notifications and fragmented attention, the simple act of writing has become an exercise in endurance. The modern digital environment is hostile to deep thought, bristling with tools that ostensibly aid productivity but practically serve only to disrupt it.

We must strip away the superfluous. A true writing environment does not demand your attention; it quietly receives it. It is a blank canvas, not an instrument panel. When the interface recedes, the words finally have room to breathe.

## The Tyranny of the Toolbar

Consider the traditional word processor. A top-heavy monolith of ribbons, drop-downs, and formatting options that you will never use. Every visible button is a subtle cognitive load, a tiny voice whispering, "Should this be bold? What if we changed the margin?"

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."

By hiding the tools until they are explicitly needed—summoned only when text is highlighted—we return the focus to the flow of sentences. The cursor becomes the only fixed point in an alabaster sea.

### Markdown Verification
- **Bold** and *Italic* text
- [Links to external resources](https://google.com)
- \`Inline code\` and code blocks:
\`\`\`javascript
function focus() {
  return "deep work";
}
\`\`\`
- Lists:
  1. Simplify
  2. Focus
  3. Create

Start typing...`;

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('zen');
  const [theme, setTheme] = useState<Theme>('default');
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selection, setSelection] = useState<{ top: number; left: number; text: string } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'default' ? '' : theme);
  }, [theme]);

  // Handle Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsMetadataOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle typing state for Zen mode fade
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
  };

  // Handle text selection for floating toolbar
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({
        top: rect.top + window.scrollY - 50,
        left: rect.left + rect.width / 2,
        text: sel.toString()
      });
    } else {
      setSelection(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text selection:bg-accent/30">
      {/* Top Toolbar */}
      <header 
        className={cn(
          "fixed top-0 left-0 w-full h-12 bg-surface/80 backdrop-blur-md z-40 transition-opacity duration-500 flex items-center justify-between px-6",
          viewMode === 'zen' && isTyping && "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-4">
          <button className="text-muted hover:text-text transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-xs font-heading font-medium">
            <span className="text-text">Untitled Document</span>
            <span className="text-muted">Unsaved changes</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-heading font-medium tracking-wide hidden md:block">
          The Art of Distraction-Free Writing
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <div className="flex items-center bg-surface-low rounded-full p-1 mr-2">
            <ThemeButton active={theme === 'default'} onClick={() => setTheme('default')} icon={<Sun size={14} />} />
            <ThemeButton active={theme === 'archive'} onClick={() => setTheme('archive')} icon={<Moon size={14} />} />
            <ThemeButton active={theme === 'sage'} onClick={() => setTheme('sage')} icon={<Leaf size={14} />} />
            <ThemeButton active={theme === 'rose'} onClick={() => setTheme('rose')} icon={<Flower2 size={14} />} />
          </div>

          <div className="flex items-center bg-surface-low rounded-full p-1">
            <button 
              onClick={() => setViewMode('zen')}
              className={cn(
                "px-4 py-1 rounded-full text-[11px] font-heading font-semibold transition-all",
                viewMode === 'zen' ? "bg-surface-lowest shadow-sm text-text" : "text-muted hover:text-text"
              )}
            >
              Zen
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={cn(
                "px-4 py-1 rounded-full text-[11px] font-heading font-semibold transition-all",
                viewMode === 'split' ? "bg-surface-lowest shadow-sm text-text" : "text-muted hover:text-text"
              )}
            >
              Split
            </button>
          </div>
          <button 
            onClick={() => setIsMetadataOpen(true)}
            className="text-muted hover:text-text transition-colors p-1"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-12 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'zen' ? (
            <motion.div 
              key="zen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto px-6 py-20 flex justify-center"
              onMouseUp={handleMouseUp}
            >
              <div className="w-full max-w-[720px] relative">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  className="w-full h-full bg-transparent border-none focus:ring-0 font-body text-lg leading-relaxed resize-none placeholder:text-muted"
                  placeholder="Start drafting..."
                  spellCheck={false}
                />
                
                {/* Floating Toolbar */}
                {selection && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="fixed z-50 glass rounded-full px-2 py-1.5 flex items-center gap-1"
                    style={{ top: selection.top, left: selection.left, transform: 'translateX(-50%)' }}
                  >
                    <ToolbarButton icon={<Bold size={16} />} label="Bold" />
                    <ToolbarButton icon={<Italic size={16} />} label="Italic" />
                    <div className="w-px h-4 bg-outline-variant mx-1" />
                    <ToolbarButton icon={<Heading1 size={16} />} label="H1" />
                    <ToolbarButton icon={<Heading2 size={16} />} label="H2" />
                    <div className="w-px h-4 bg-outline-variant mx-1" />
                    <ToolbarButton icon={<LinkIcon size={16} />} label="Link" />
                    <ToolbarButton icon={<Quote size={16} />} label="Quote" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex gap-4 p-4"
            >
              {/* WYSIWYG Pane */}
              <div className="flex-1 bg-surface-lowest rounded-md shadow-ambient overflow-y-auto p-12 flex justify-center">
                <div className="w-full max-w-[800px] prose">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
              
              {/* Markdown Pane */}
              <div className="flex-1 bg-surface-lowest rounded-md shadow-ambient overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-surface-low/50">
                  <span className="text-[11px] font-heading font-semibold text-muted uppercase tracking-wider">Markdown Source</span>
                  <FileCode size={14} className="text-muted" />
                </div>
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  className="flex-1 w-full bg-transparent border-none focus:ring-0 font-code text-[14px] leading-relaxed p-6 resize-none"
                  spellCheck={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Word Count Indicator */}
      <div className="fixed bottom-6 right-8 text-muted text-[12px] font-heading font-medium z-40 bg-surface/80 px-2 py-1 rounded">
        {content.trim().split(/\s+/).length} words
      </div>

      {/* Footer */}
      <footer className={cn(
        "fixed bottom-0 left-0 w-full py-2 px-6 bg-surface/50 backdrop-blur-sm border-t border-outline-variant z-30 flex flex-col md:flex-row items-center justify-between text-[10px] text-muted font-heading transition-opacity duration-500",
        viewMode === 'zen' && isTyping && "opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center gap-2">
          <span>© 2026 Prashant Fawade. All rights reserved.</span>
          <span className="hidden md:inline text-outline-variant">|</span>
          <span className="italic">Pro Markdown Editor</span>
        </div>
        <div className="mt-1 md:mt-0 opacity-60">
          Disclaimer: This website was created with the assistance of AI.
        </div>
      </footer>

      {/* Command Palette */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommandPaletteOpen(false)}
              className="fixed inset-0 bg-primary/10 backdrop-blur-[4px] z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-[560px] glass rounded-md shadow-2xl z-[70] overflow-hidden"
            >
              <div className="relative flex items-center px-6 py-4 border-b border-outline-variant">
                <Search size={20} className="text-muted mr-4" />
                <input 
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none focus:ring-0 font-heading text-lg placeholder:text-muted"
                />
              </div>
              <div className="p-2">
                <div className="px-4 py-2 text-[11px] font-heading font-semibold text-muted uppercase tracking-wider">Recent Actions</div>
                <CommandItem icon={<Search size={16} />} label="Toggle Split View" shortcut="⌘S" />
                <CommandItem icon={<Search size={16} />} label="Enable Zen Focus" shortcut="⌘⇧Z" />
                <div className="px-4 py-2 text-[11px] font-heading font-semibold text-muted uppercase tracking-wider mt-2">Document</div>
                <CommandItem icon={<Info size={16} />} label="Document Metadata" shortcut="⌘M" />
                <CommandItem icon={<Download size={16} />} label="Export to Markdown" shortcut="⌘E" />
                <CommandItem icon={<FileCode size={16} />} label="Export to HTML" />
              </div>
              <div className="bg-surface-low/50 border-t border-outline-variant px-4 py-2 flex items-center justify-between text-muted font-heading text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">↑↓ to navigate</span>
                  <span className="flex items-center gap-1">↵ to select</span>
                </div>
                <span>esc to close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Metadata Drawer */}
      <AnimatePresence>
        {isMetadataOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMetadataOpen(false)}
              className="fixed inset-0 bg-primary/5 z-[60]"
            />
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[320px] bg-surface-lowest shadow-2xl z-[70] border-l border-outline-variant flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
                <h2 className="font-heading text-[15px] font-semibold">Document Settings</h2>
                <button onClick={() => setIsMetadataOpen(false)} className="text-muted hover:text-text">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-2">
                  <span className="block text-[11px] font-heading font-semibold text-muted uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-2 text-[13px] font-heading">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Draft - Last saved 2 mins ago
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[13px] font-heading font-medium">URL Slug</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[13px]">/</span>
                    <input 
                      defaultValue="the-art-of-distraction-free-writing"
                      className="w-full pl-6 pr-3 py-2 bg-surface-low border-transparent rounded-md text-[13px] font-heading focus:bg-surface-lowest focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-heading font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 p-2 bg-surface-low border-transparent rounded-md min-h-[80px] focus-within:bg-surface-lowest focus-within:ring-1 focus-within:ring-accent transition-all">
                    <Tag label="Editorial" />
                    <Tag label="Design" />
                    <input className="bg-transparent border-none focus:ring-0 text-[13px] flex-1 min-w-[60px]" placeholder="Add a tag..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-heading font-medium text-muted">Search Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Brief description for search engines..."
                    className="w-full p-3 bg-surface-low border-transparent rounded-md text-[13px] font-heading focus:bg-surface-lowest focus:ring-1 focus:ring-accent transition-all resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-outline-variant">
                <button className="w-full h-11 cta-gradient text-surface-lowest font-heading text-[14px] font-semibold rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg">
                  <Rocket size={18} />
                  Publish Document
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="p-1.5 text-text hover:bg-surface-low rounded-full transition-colors" title={label}>
      {icon}
    </button>
  );
}

function CommandItem({ icon, label, shortcut }: { icon: React.ReactNode; label: string; shortcut?: string }) {
  return (
    <button className="w-full flex items-center px-4 py-2.5 rounded-md hover:bg-surface-low transition-colors group">
      <span className="text-muted group-hover:text-text mr-3">{icon}</span>
      <span className="flex-1 text-left text-[14px] font-heading font-medium">{label}</span>
      {shortcut && (
        <span className="text-[11px] font-heading text-muted border border-outline-variant px-1.5 py-0.5 rounded bg-surface-lowest">
          {shortcut}
        </span>
      )}
    </button>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent/20 text-text font-heading text-[12px] font-medium border border-accent/30">
      {label}
      <X size={12} className="cursor-pointer hover:text-highlight" />
    </div>
  );
}

function ThemeButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-full transition-all",
        active ? "bg-surface-lowest shadow-sm text-primary" : "text-muted hover:text-text"
      )}
    >
      {icon}
    </button>
  );
}
