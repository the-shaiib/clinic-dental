export const BEFORE_AFTER_KEY = 'clinic_before_after_cases';

const defaultBeforeAfterCases = [
  {
    id: 'whitening',
    title: 'Blanchiment',
    note: 'Teinte plus claire et sourire plus lumineux tout en gardant un aspect naturel.',
    beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80',
    showOnSite: true,
  },
  {
    id: 'alignment',
    title: 'Alignement',
    note: 'Ecartement plus equilibre et alignement plus net a l avant.',
    beforeImage: 'https://images.unsplash.com/photo-1588776814546-ec7e4f8f2587?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?auto=format&fit=crop&w=900&q=80',
    showOnSite: true,
  },
  {
    id: 'restoration',
    title: 'Restauration',
    note: 'Forme et teinte reconstruites pour un sourire plus harmonieux et confiant.',
    beforeImage: 'https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
    showOnSite: true,
  },
];

const normalizeBeforeAfterCases = (items) =>
  items.filter(
    (item) =>
      item &&
      typeof item.beforeImage === 'string' &&
      item.beforeImage.trim().length > 0 &&
      typeof item.afterImage === 'string' &&
      item.afterImage.trim().length > 0
  );

export const loadStoredBeforeAfterCases = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(BEFORE_AFTER_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return normalizeBeforeAfterCases(parsed);
  } catch {
    return [];
  }
};

export const loadBeforeAfterCases = () => {
  const storedCases = loadStoredBeforeAfterCases();
  if (storedCases.length > 0) {
    return storedCases;
  }
  return defaultBeforeAfterCases;
};

export const saveBeforeAfterCases = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BEFORE_AFTER_KEY, JSON.stringify(normalizeBeforeAfterCases(items)));
};
