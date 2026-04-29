export const GALLERY_ITEMS_KEY = 'clinic_gallery_items';

const defaultGalleryItems = [
  {
    id: 'G-1',
    src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80',
    title: 'Dentiste preparant les instruments a la clinique',
    showOnSite: true,
  },
  {
    id: 'G-2',
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    title: 'Professionnel dentaire tenant les instruments',
    showOnSite: true,
  },
  {
    id: 'G-3',
    src: 'https://images.unsplash.com/photo-1588776814546-ec7e4f8f2587?auto=format&fit=crop&w=1200&q=80',
    title: 'Sourire apres les soins dentaires',
    showOnSite: true,
  },
  {
    id: 'G-4',
    src: 'https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=1200&q=80',
    title: 'Patient recevant un traitement dentaire',
    showOnSite: true,
  },
  {
    id: 'G-5',
    src: 'https://images.unsplash.com/photo-1606811856475-23254db5e0f3?auto=format&fit=crop&w=1200&q=80',
    title: 'Equipe dentaire au travail',
    showOnSite: true,
  },
  {
    id: 'G-6',
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    title: 'Instruments dentaires disposes sur un plateau',
    showOnSite: true,
  },
];

const normalizeGalleryItems = (items) =>
  items.filter((item) => item && typeof item.src === 'string' && item.src.trim().length > 0);

export const loadStoredGalleryItems = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(GALLERY_ITEMS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return normalizeGalleryItems(parsed);
  } catch {
    return [];
  }
};

export const loadGalleryItems = () => {
  const storedItems = loadStoredGalleryItems();
  if (storedItems.length > 0) {
    return storedItems;
  }
  return defaultGalleryItems;
};

export const saveGalleryItems = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(normalizeGalleryItems(items)));
};
