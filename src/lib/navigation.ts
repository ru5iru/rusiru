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