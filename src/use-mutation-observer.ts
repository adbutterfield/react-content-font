import { useState, useEffect } from 'react';

const DEFAULT_OPTIONS = {
  config: { childList: true, subtree: true, characterData: true },
};

export default function useMutationObserver(cb: (mutations: MutationRecord[]) => void, options = DEFAULT_OPTIONS) {
  const [observer, setObserver] = useState<MutationObserver | null>(null);

  useEffect(() => {
    const obs = new MutationObserver(cb);
    setObserver(obs);
  }, [cb, options, setObserver]);

  useEffect(() => {
    if (!observer) return;
    const { config } = options;
    observer.observe(document.body, config);
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer, options]);
}
