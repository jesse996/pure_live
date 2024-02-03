import { createDirectus, rest } from "@directus/sdk";

export const client = createDirectus("http://jesse.x3322.net:8055").with(
  rest()
);
