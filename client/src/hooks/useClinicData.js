import { useQuery } from '@tanstack/react-query';
import { fetchBeforeAfter, fetchGallery, fetchServices } from '../config/api';

const FIVE_MINUTES = 5 * 60 * 1000;

const baseQueryOptions = {
  staleTime: FIVE_MINUTES,
  refetchOnWindowFocus: false,
  retry: 1,
};

export const useServices = () =>
  useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
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
