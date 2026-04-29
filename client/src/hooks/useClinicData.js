import { useQuery } from '@tanstack/react-query';
import { fetchBeforeAfter, fetchGallery, fetchServices } from '../config/api';

const FIVE_MINUTES = 5 * 60 * 1000;
const SERVICES_CACHE_KEY = 'clinic_public_services_cache';

const baseQueryOptions = {
  staleTime: FIVE_MINUTES,
  refetchOnWindowFocus: false,
  retry: 1,
};

const readCachedServices = () => {
  try {
    const cached = window.localStorage.getItem(SERVICES_CACHE_KEY);
    if (!cached) return undefined;
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed?.items) ? parsed.items : undefined;
  } catch {
    return undefined;
  }
};

const writeCachedServices = (items) => {
  try {
    window.localStorage.setItem(
      SERVICES_CACHE_KEY,
      JSON.stringify({ items, savedAt: Date.now() }),
    );
  } catch {
    // Local storage is only a speed boost; the live API remains the source of truth.
  }
};

export const useServices = () =>
  useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const services = await fetchServices();
      if (Array.isArray(services) && services.length > 0) {
        writeCachedServices(services);
      }
      return services;
    },
    initialData: readCachedServices,
    ...baseQueryOptions,
  });

export const useGallery = () =>
  useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
    ...baseQueryOptions,
  });

export const useBeforeAfter = () =>
  useQuery({
    queryKey: ['before-after'],
    queryFn: fetchBeforeAfter,
    ...baseQueryOptions,
  });
