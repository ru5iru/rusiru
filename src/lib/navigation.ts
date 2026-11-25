export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

/** Wait for lazy sections before handling an early click or incoming hash. */
export function navigateToSection(id: string): () => void {
  const scroll = () => {
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ behavior: scrollBehavior() });
    history.replaceState(null, '', `#${id}`);
    return true;
  };
  if (scroll()) return () => {};
  const observer = new MutationObserver(() => { if (scroll()) observer.disconnect(); });
  observer.observe(document.body, { childList: true, subtree: true });
  const timeout = window.setTimeout(() => observer.disconnect(), 15000);
  return () => { observer.disconnect(); window.clearTimeout(timeout); };
}

export type BroadsheetSection = 'experience' | 'projects' | 'education' | 'certifications' | 'blog';
export interface BroadsheetJump { section: BroadsheetSection; index: number }

const JUMP_EVENT = 'broadsheet:jump';
const TOGGLE_ALL_EVENT = 'broadsheet:toggle-all';
let pendingJump: BroadsheetJump | null = null;
let allExpanded = false;

export function jumpToBroadsheetItem(section: BroadsheetSection, index: number): () => void {
  pendingJump = { section, index };
  window.dispatchEvent(new CustomEvent<BroadsheetJump>(JUMP_EVENT, { detail: { section, index } }));
  return navigateToSection(section === 'certifications' ? 'education' : section);
}

export function subscribeToBroadsheetJump(section: BroadsheetSection, callback: (detail: BroadsheetJump) => void): () => void {
  let active = true;
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<BroadsheetJump>).detail;
    if (detail?.section === section) {
      pendingJump = null;
      callback(detail);
    }
  };
  window.addEventListener(JUMP_EVENT, listener);
  if (pendingJump?.section === section) {
    const detail = pendingJump;
    pendingJump = null;
    queueMicrotask(() => { if (active) callback(detail); });
  }
  return () => { active = false; window.removeEventListener(JUMP_EVENT, listener); };
}

export function focusBroadsheetCard(id: string): void {
  let attempts = 0;
  const focus = () => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      target.classList.remove('dossier-flash');
      void target.offsetWidth;
      target.classList.add('dossier-flash');
      window.setTimeout(() => target.classList.remove('dossier-flash'), 1700);
      return;
    }
    attempts += 1;
    if (attempts < 90) window.requestAnimationFrame(focus);
  };
  focus();
}

export function setBroadsheetAllExpanded(expanded: boolean): void {
  allExpanded = expanded;
  window.dispatchEvent(new CustomEvent(TOGGLE_ALL_EVENT, { detail: { expanded } }));
}

export function isBroadsheetAllExpanded(): boolean { return allExpanded; }

export function subscribeToBroadsheetToggleAll(callback: (expanded: boolean) => void): () => void {
  let active = true;
  const listener = (event: Event) => callback(Boolean((event as CustomEvent<{ expanded: boolean }>).detail?.expanded));
  window.addEventListener(TOGGLE_ALL_EVENT, listener);
  if (allExpanded) queueMicrotask(() => { if (active) callback(true); });
  return () => { active = false; window.removeEventListener(TOGGLE_ALL_EVENT, listener); };
}
