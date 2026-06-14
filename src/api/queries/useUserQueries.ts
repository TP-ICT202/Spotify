import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { AppEntity, UserProfileContent, HistoryContent, HistoryItem } from '../../interfaces/entities';

export const USER_KEYS = {
  profile: (userId: string) => ['user', 'profile', userId] as const,
  history: (userId: string) => ['user', 'history', userId] as const,
};

// ─── RÉCUPÉRER LE PROFIL UTILISATEUR ─────────────────────────────
export function useFetchUserProfile(userId: string) {
  return useQuery({
    queryKey: USER_KEYS.profile(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_entities')
        .select('*')
        .eq('entity_type', 'USER_PROFILE')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as AppEntity;
    },
    enabled: !!userId,
  });
}

// ─── CRÉER UN PROFIL UTILISATEUR ─────────────────────────────────
// Appelé automatiquement à la première connexion
export function useCreateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      displayName,
      avatarUrl,
      provider,
    }: {
      userId: string;
      displayName: string;
      avatarUrl: string | null;
      provider: 'google' | 'github';
    }) => {
      const { data, error } = await supabase
        .from('app_entities')
        .insert({
          user_id: userId,
          entity_type: 'USER_PROFILE',
          content: {
            display_name: displayName,
            avatar_url: avatarUrl,
            provider,
            account_tier: 'free',
            explicit_content_allowed: false,
            data_saver_mode: false,
            audio_quality_settings: {
              streaming_cellular: 'normal',
              streaming_wifi: 'high',
              download: 'high',
            },
            crossfade_duration_seconds: 0,
          } as UserProfileContent,
        })
        .select()
        .single();

      if (error) throw error;
      return data as AppEntity;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: USER_KEYS.profile(variables.userId),
      });
    },
  });
}

// ─── SAUVEGARDER L'HISTORIQUE D'ÉCOUTE ───────────────────────────
export function useSaveHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      trackId,
    }: {
      userId: string;
      trackId: string;
    }) => {
      // Chercher l'historique existant
      const { data: existing } = await supabase
        .from('app_entities')
        .select('*')
        .eq('entity_type', 'HISTORY')
        .eq('user_id', userId)
        .single();

      const newItem: HistoryItem = {
        track_id: trackId,
        played_at: new Date().toISOString(),
      };

      if (existing) {
        // Mettre à jour l'historique existant
        const currentContent = existing.content as HistoryContent;
        const updatedHistory = [
          newItem,
          // Garder seulement les 50 derniers morceaux
          ...currentContent.recently_played.slice(0, 49),
        ];

        const { data, error } = await supabase
          .from('app_entities')
          .update({
            content: {
              ...currentContent,
              recently_played: updatedHistory,
            },
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data as AppEntity;
      } else {
        // Créer un nouvel historique
        const { data, error } = await supabase
          .from('app_entities')
          .insert({
            user_id: userId,
            entity_type: 'HISTORY',
            content: {
              recently_played: [newItem],
              player_state_persistence: {
                current_track_id: null,
                position_ms: 0,
                queue_track_ids: [],
                is_shuffle: false,
                repeat_mode: 'off',
              },
            } as HistoryContent,
          })
          .select()
          .single();

        if (error) throw error;
        return data as AppEntity;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: USER_KEYS.history(variables.userId),
      });
    },
  });
}