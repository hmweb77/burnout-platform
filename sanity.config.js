import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import blog from './src/schemas/blog.js';
import resource from './src/schemas/resource.js';

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: "Admin Panel",
  basePath: "/admin",
  plugins: [structureTool()],
  schema: {
    types: [blog, resource],
  },
});

