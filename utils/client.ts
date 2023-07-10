import { config } from "@/config/config";
import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "15ko3rm3",
  dataset: "production",
  apiVersion: "2022-03-10",
  useCdn: false,
  token: config.sanityToken,
});
