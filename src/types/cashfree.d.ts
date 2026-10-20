declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeInstance {
    checkout: (options: {
      paymentSessionId: string;
      redirectTarget?: '_modal' | '_self' | '_top' | '_blank';
    }) => Promise<{
      error?: { message?: string; code?: string };
      redirect?: boolean;
      paymentDetails?: any;
    }>;
  }

  export function load(options: {
    mode: 'production' | 'sandbox';
  }): Promise<CashfreeInstance | null>;
}
