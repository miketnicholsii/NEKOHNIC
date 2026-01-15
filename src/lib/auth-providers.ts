const resolveFlag = (value: string | undefined) => value?.toLowerCase() === "true";

export const isGoogleOAuthEnabled = resolveFlag(import.meta.env.VITE_ENABLE_GOOGLE_OAUTH);
export const isGithubOAuthEnabled = resolveFlag(import.meta.env.VITE_ENABLE_GITHUB_OAUTH);

export type OAuthProvider = "google" | "github";

export const enabledOAuthProviders: OAuthProvider[] = [
  ...(isGoogleOAuthEnabled ? ["google" as const] : []),
  ...(isGithubOAuthEnabled ? ["github" as const] : []),
];
