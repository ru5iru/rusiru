import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/config';
import { publishedItems } from '@/config/publication';
import { focusBroadsheetCard, subscribeToBroadsheetJump, subscribeToBroadsheetToggleAll } from './navigation';

export function useRecordLedger<T extends { id: string }>(section: 'experience' | 'projects', items: T[]) {
  const entries = useMemo(() => publishedItems(siteConfig, section, items), [section, items]);
  const defaults = useMemo(() => entries.filter(entry => entry.settings.expanded).map(entry => entry.index), [entries]);
  const [showAll, setShowAll] = useState(false);
  const [openIndices, setOpenIndices] = useState(() => new Set(defaults));
  const allOpen = entries.length > 0 && entries.every(entry => openIndices.has(entry.index));

  useEffect(() => subscribeToBroadsheetJump(section, ({ index }) => {
    const entry = entries.find(entry => entry.index === index);
    if (!entry) return;
    if (!entry.settings.featured) setShowAll(true);
    setOpenIndices(current => new Set(current).add(index));
    focusBroadsheetCard(`${section === 'projects' ? 'proj' : 'exp'}-card-${index}`);
  }), [section, entries]);

  useEffect(() => subscribeToBroadsheetToggleAll(expanded => {
    setShowAll(expanded);
    setOpenIndices(new Set(expanded ? entries.map(entry => entry.index) : defaults));
  }), [entries, defaults]);

  const toggleItem = (index: number) => setOpenIndices(current => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  const toggleAll = () => {
    if (!allOpen) setShowAll(true);
    setOpenIndices(new Set(allOpen ? defaults.slice(0, 1) : entries.map(entry => entry.index)));
  };
  return { entries, visible: entries.filter(entry => showAll || entry.settings.featured), showAll, setShowAll, openIndices, allOpen, toggleItem, toggleAll };
}