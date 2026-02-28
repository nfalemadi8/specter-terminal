import { useState } from 'react';
import { tabs } from '../../data/tabs';

export default function CommandBar({ onTabChange }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toUpperCase();

    // Navigate to tab by name
    const match = tabs.find(t =>
      t.label === cmd || t.id.toUpperCase() === cmd
    );
    if (match) {
      onTabChange(match.id);
    }

    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center px-3 py-[3px] bg-bb-dark border-t border-bb-border"
    >
      <span className="text-bb-amber text-[10px] font-bold mr-2">CMD &gt;</span>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="flex-1 bg-transparent text-bb-white text-[11px] outline-none placeholder-bb-muted font-mono"
        placeholder="Type command or tab name..."
        spellCheck={false}
        autoComplete="off"
      />
      <span className="text-bb-muted text-[10px]">SPECTER v3.0</span>
    </form>
  );
}
