/**
 * GlitchTip/Sentry browser error tracking.
 * Only initializes in production (when NEXT_PUBLIC_GLITCHTIP_DSN is set).
 */

let initialized = false;

export function initSentry() {
    if (initialized) return;
    const dsn = process.env.NEXT_PUBLIC_GLITCHTIP_DSN;
    if (!dsn) return;

    import('@sentry/browser').then((Sentry) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = {
            dsn,
            tracesSampleRate: 0.01,
            autoSessionTracking: false,
            environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
        };
        Sentry.init(options);
        initialized = true;
    });
}
