import { useEffect, type RefObject } from 'react';

export function useScrollReveal(root: RefObject<HTMLElement | null>, refresh: boolean) {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (!root.current || preference.matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches) continue;
        const element = entry.target as HTMLElement;
        const delay = Number(element.dataset.delay ?? 0);
        animations.push(element.animate([
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, delay, easing: 'cubic-bezier(.2,.65,.25,1)', fill: 'backwards' }));
        observer.unobserve(element);
      }
    }, { threshold: 0.12 });
    root.current.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    const reduce = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', reduce);
    return () => { observer.disconnect(); preference.removeEventListener('change', reduce); animations.forEach(animation => animation.cancel()); };
  }, [root, refresh]);
}

export function useReadingProgress() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--reading-progress', String(height > 0 ? scrollY / height : 0));
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
    return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);
}
