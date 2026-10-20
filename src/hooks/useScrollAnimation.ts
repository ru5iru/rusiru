import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
}

export function useScrollAnimationMultiple(count: number, threshold = 0.1, staggerDelay = 100) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
  useEffect(() => {
    const targets = [...refs.current];
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleItems(new Array(count).fill(true)); return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = targets.indexOf(entry.target as HTMLDivElement);
        if (index < 0) return;
        timers.push(setTimeout(() => setVisibleItems(prev => prev.map((value, i) => i === index ? true : value)), index * staggerDelay));
        observer.unobserve(entry.target);
      });
    }, { threshold });
    targets.forEach(target => { if (target) observer.observe(target); });
    return () => { observer.disconnect(); timers.forEach(clearTimeout); };
  }, [count, threshold, staggerDelay]);
  return { refs, visibleItems };
}
