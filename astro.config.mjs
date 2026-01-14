// @ts-check
// deploy adapter
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import reactCompilerPlugin from "babel-plugin-react-compiler";
// md parsing
import remarkDirective from "remark-directive";

import { remarkDirectiveToHTML } from "./src/lib/remark-directive-to-html";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveToHTML],
  },
  site: "https://sojourners.church",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react({
      babel: {
        plugins: [reactCompilerPlugin],
      },
    }),
  ],
  adapter: netlify(),
});
