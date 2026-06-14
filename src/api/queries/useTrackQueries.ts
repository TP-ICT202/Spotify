import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { AppEntity, TrackContent } from '../../interfaces/entities';

// ─── CLÉS DE CACHE ───────────────────────────────────────────────
// Ces clés identifient chaque requête dans le cache React Query
// Si deux composants utilisent la même clé, ils partagent le même cache
export const TRACK_KEYS = {
  all: ['tracks'] as const,
  detail: (id: string) => ['tracks', id] as const,
};

// ─── RÉCUPÉRER TOUS LES MORCEAUX ─────────────────────────────────
// Ce hook est utilisé dans HomeScreen et LibraryScreen
export function useFetchTracks() {
  return useQuery({
    queryKey: TRACK_KEYS.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_entities')
        .select('*')
        .eq('entity_type', 'TRACK') // Filtrer uniquement les morceaux
        .order('created_at', { ascending: false }); // Plus récents en premier

      if (error) throw error;
      return data as AppEntity[];
    },
    staleTime: 1000 * 60 * 5, // Les données sont "fraîches" pendant 5 minutes
    // Après 5 minutes, React Query recharge automatiquement en arrière-plan
  });
}

// ─── RÉCUPÉRER UN SEUL MORCEAU ───────────────────────────────────
// Utilisé dans le lecteur plein écran
export function useFetchTrack(id: string) {
  return useQuery({
    queryKey: TRACK_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_entities')
        .select('*')
        .eq('id', id)
        .eq('entity_type', 'TRACK')
        .single(); // On attend un seul résultat

      if (error) throw error;
      return data as AppEntity;
    },
    enabled: !!id, // Ne lance la requête que si id est défini
  });
}

// ─── RECHERCHER DES MORCEAUX ─────────────────────────────────────
// Utilisé dans SearchScreen
export function useSearchTracks(searchTerm: string) {
  return useQuery({
    queryKey: ['tracks', 'search', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_entities')
        .select('*')
        .eq('entity_type', 'TRACK')
        // Recherche dans le titre (insensible à la casse)
        .ilike('content->>title', `%${searchTerm}%`);

      if (error) throw error;
      return data as AppEntity[];
    },
    enabled: searchTerm.length > 1, // Ne cherche que si au moins 2 caractères
  });
}