/**
 * Global type declarations
 */

interface Window {
  gtag?: (
    command: 'event' | 'config' | 'set',
    action: string,
    params?: Record<string, unknown>
  ) => void;
}
