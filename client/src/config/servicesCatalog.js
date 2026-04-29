export const SERVICES_KEY = 'clinic_services_catalog';

const defaultServices = [
  {
    id: 'S-101',
    title: 'Nettoyage et prevention',
    tag: 'Consultation + Controle',
    icon: 'fa-solid fa-shield-heart',
    description:
      'Detartrage, controle regulier, et conseils simples pour proteger vos dents au quotidien.',
  },
  {
    id: 'S-102',
    title: 'Blanchiment',
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
    title: 'Orthodontie',
    tag: 'Alignement du sourire',
    icon: 'fa-solid fa-teeth',
    description:
      'Solutions d alignement pour corriger la position des dents avec un suivi progressif.',
  },
  {
    id: 'S-105',
    title: 'Traitement de canal',
    tag: 'Traitement en profondeur',
    icon: 'fa-solid fa-syringe',
    description:
      'Soulage la douleur et sauve la dent avec un traitement precis, suivi et controle.',
  },
  {
    id: 'S-106',
    title: 'Soins pediatriques',
    tag: 'Soins enfants',
    icon: 'fa-solid fa-toothbrush',
    description:
      'Approche douce pour les enfants, prevention, conseils, et suivi rassurant.',
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
    return normalizeServices(parsed);
  } catch {
    return defaultServices;
  }
};

export const saveServices = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SERVICES_KEY, JSON.stringify(normalizeServices(items)));
};
