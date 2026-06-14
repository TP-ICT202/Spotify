import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { AppEntity, PlaylistContent } from '../../interfaces/entities';

export const PLAYLIST_KEYS = {
  all: ['playlists'] as const,
  user: (userId: string) => ['playlists', 'user', userId] as const,
  detail: (id: string) => ['playlists', id] as const,
};

// ─── RÉCUPÉRER LES PLAYLISTS DE L'UTILISATEUR ────────────────────
export function useFetchUserPlaylists(userId: string) {
  return useQuery({
    queryKey: PLAYLIST_KEYS.user(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_entities')
        .select('*')
        .eq('entity_type', 'PLAYLIST')
        .eq('user_id', userId);

      if (error) throw error;
      return data as AppEntity[];
    },
    enabled: !!userId,
  });
}

// ─── CRÉER UNE PLAYLIST ──────────────────────────────────────────
export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      title,
      description,
    }: {
      userId: string;
      title: string;
      description: string;
    }) => {
      const { data, error } = await supabase
        .from('app_entities')
        .insert({
          user_id: userId,
          entity_type: 'PLAYLIST',
          content: {
            title,
            description,
            is_public: false,
            is_collaborative: false,
            cover_custom_url: null,
            collaborators: [],
            tracks: [],
          } as PlaylistContent,
        })
        .select()
        .single();

      if (error) throw error;
      return data as AppEntity;
    },
    // Après création, invalider le cache pour recharger la liste
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PLAYLIST_KEYS.user(variables.userId),
      });
    },
  });
}

// ─── AJOUTER UN MORCEAU À UNE PLAYLIST ──────────────────────────
export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      trackId,
      userId,
    }: {
      playlistId: string;
      trackId: string;
      userId: string;
    }) => {
      // Récupérer la playlist actuelle
      const { data: playlist, error: fetchError } = await supabase
        .from('app_entities')
        .select('*')
        .eq('id', playlistId)
        .single();

      if (fetchError) throw fetchError;

      const currentContent = playlist.content as PlaylistContent;

      // Ajouter le morceau à la liste existante
      const updatedTracks = [
        ...currentContent.tracks,
        {
          track_id: trackId,
          added_by: userId,
          added_at: new Date().toISOString(),
        },
      ];

      // Mettre à jour la playlist
      const { data, error } = await supabase
        .from('app_entities')
        .update({
          content: { ...currentContent, tracks: updatedTracks },
        })
        .eq('id', playlistId)
        .select()
        .single();

      if (error) throw error;
      return data as AppEntity;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PLAYLIST_KEYS.detail(variables.playlistId),
      });
    },
  });
}