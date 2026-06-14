import { UserProfileContent } from '../../interfaces/entities';

// ─── VÉRIFICATIONS PREMIUM ───────────────────────────────────────

// Vérifier si l'utilisateur peut télécharger des morceaux
export function canDownload(profile: UserProfileContent): boolean {
  return profile.account_tier === 'premium';
}

// Vérifier si l'utilisateur peut sauter des morceaux sans limite
export function canSkipUnlimited(profile: UserProfileContent): boolean {
  return profile.account_tier === 'premium';
}

// Vérifier si l'utilisateur peut écouter en très haute qualité
export function canUseVeryHighQuality(profile: UserProfileContent): boolean {
  return profile.account_tier === 'premium';
}

// Vérifier si l'utilisateur peut voir les Canvas vidéo
export function canUseCanvas(profile: UserProfileContent): boolean {
  return profile.account_tier === 'premium';
}

// Vérifier si l'utilisateur peut utiliser le crossfade
export function canUseCrossfade(profile: UserProfileContent): boolean {
  return profile.account_tier === 'premium';
}

// ─── COMPTEUR DE SKIPS (compte gratuit) ──────────────────────────

// Les comptes gratuits ont 6 skips par heure maximum
const MAX_SKIPS_PER_HOUR = 6;

class SkipCounter {
  private skipCount: number = 0;
  private windowStart: number = Date.now();

  // Vérifier si l'utilisateur peut encore skipper
  canSkip(profile: UserProfileContent): boolean {
    if (profile.account_tier === 'premium') return true;

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Réinitialiser le compteur si une heure s'est écoulée
    if (now - this.windowStart > oneHour) {
      this.skipCount = 0;
      this.windowStart = now;
    }

    return this.skipCount < MAX_SKIPS_PER_HOUR;
  }

  // Enregistrer un skip
  recordSkip(): void {
    this.skipCount++;
    console.log(`⏭ Skip enregistré (${this.skipCount}/${MAX_SKIPS_PER_HOUR})`);
  }

  // Nombre de skips restants
  remainingSkips(): number {
    return Math.max(0, MAX_SKIPS_PER_HOUR - this.skipCount);
  }
}

export const skipCounter = new SkipCounter();

// ─── MESSAGE D'UPGRADE ───────────────────────────────────────────

export function getPremiumMessage(feature: string): string {
  return `"${feature}" est réservé aux comptes Premium. Passez à Premium pour débloquer cette fonctionnalité.`;
}