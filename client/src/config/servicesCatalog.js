export const SERVICES_KEY = 'clinic_services_catalog';

const defaultServices = [
  {
    id: 'S-101',
    title: 'Cleaning & Prevention',
    tag: 'Consultation + Controle',
    icon: 'fa-solid fa-shield-heart',
    description:
      'Detartrage, controle regulier, et conseils simples pour proteger vos dents au quotidien.',
  },
  {
    id: 'S-102',
    title: 'Whitening',
    tag: 'Esthetique du sourire',
    icon: 'fa-solid fa-wand-magic-sparkles',
    description:
      'Traitement esthetique pour illuminer votre sourire avec une approche douce et progressive.',
  },
  {
    id: 'S-103',
    title: 'Implants',
    tag: 'Solution long terme',
    icon: 'fa-solid fa-tooth',
    description:
      'Solutions modernes pour remplacer les dents manquantes et restaurer votre confort.',
  },
  {
    id: 'S-104',
    title: 'Orthodontics',
    tag: 'Alignement du sourire',
    icon: 'fa-solid fa-teeth',
    description:
      'Solutions d alignement pour corriger la position des dents avec un suivi progressif.',
  },
];

const normalizeServices = (items) =>
  items.filter(
    (item) =>
      item &&
      typeof item.title === 'string' &&
      item.title.trim().length > 0 &&
      typeof item.description === 'string' &&
      item.description.trim().length > 0
  );

export const loadServices = () => {
  if (typeof window === 'undefined') return defaultServices;

  try {
    const stored = window.localStorage.getItem(SERVICES_KEY);
    if (!stored) return defaultServices;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaultServices;
    const normalized = normalizeServices(parsed);
    return normalized.length > 0 ? normalized : defaultServices;
  } catch (error) {
    return defaultServices;
  }
};

export const saveServices = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SERVICES_KEY, JSON.stringify(normalizeServices(items)));
};
