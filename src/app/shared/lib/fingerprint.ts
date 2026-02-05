import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;
let cachedFingerprint: string | null = null;

export async function generateFingerprint(): Promise<string> {
  // Return cached fingerprint if already generated
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  // Initialize FingerprintJS only once
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  try {
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    cachedFingerprint = visitorId;
    return visitorId;
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    // Fallback to a simple hash if FingerprintJS fails
    const fallbackFingerprint = Math.random().toString(36).substring(2) + Date.now().toString(36);
    cachedFingerprint = fallbackFingerprint;
    return fallbackFingerprint;
  }
}

export function getCachedFingerprint(): string | null {
  return cachedFingerprint;
}
