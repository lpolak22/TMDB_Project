// totp-generator.d.ts
declare module "totp-generator" {
  // Define the structure of TOTP object
  export const TOTP: {
    generate: (
      secret: string,
      options?: {
        digits?: number;
        algorithm?: "SHA-1" | "SHA-256" | "SHA-512";
        period?: number;
      }
    ) => {otp: string, expires: number};
  };
}

