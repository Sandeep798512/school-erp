import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, no need to keep observing if we want permanent reveal
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15,
    });

    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom'
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}
