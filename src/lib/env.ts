export type AppEnv = "demo" | "production";

export const APP_ENV: AppEnv = (import.meta.env.VITE_APP_ENV as AppEnv) || "demo";

export const isDemo = APP_ENV === "demo";
export const isProduction = APP_ENV === "production";
