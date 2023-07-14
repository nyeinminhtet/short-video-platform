interface Config {
  baseUrl: string;
  sanityToken: string;
  googleId: string;
}

export const config: Config = {
  baseUrl: process.env.NEXT_PUBLIC_API || "",
  sanityToken: process.env.NEXT_PUBLIC_SANITY_TOKEN || "",
  googleId: process.env.NEXT_PUBLIC_GOOGLE_ID || "",
};
