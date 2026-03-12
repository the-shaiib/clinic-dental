export const CONTACT_REQUESTS_KEY = 'clinic_contact_requests';

const legacySeedIds = new Set(['C-101', 'C-102', 'C-103']);

export const defaultContactRequests = [];

export const loadContactRequests = () => {
  if (typeof window === 'undefined') return defaultContactRequests;

  try {
    const stored = window.localStorage.getItem(CONTACT_REQUESTS_KEY);
    if (!stored) return defaultContactRequests;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaultContactRequests;
    return parsed.filter((request) => !legacySeedIds.has(request?.id));
  } catch (error) {
    return defaultContactRequests;
  }
};

export const saveContactRequests = (requests) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONTACT_REQUESTS_KEY, JSON.stringify(requests));
};
