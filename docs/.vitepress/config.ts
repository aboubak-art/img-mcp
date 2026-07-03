import { defineConfig } from "vitepress";

export default defineConfig({
  title: "img-mcp",
  titleTemplate: ":title | img-mcp",
  description:
    "img-mcp is an open-source MCP server for AI agents. Resize, crop, convert, compress, remove backgrounds, and generate images — all from Node.js.",
  base: "/img-mcp/",
  outDir: "../website",
  cleanUrls: false,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "https://aboubak-art.github.io/img-mcp/assets/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#0b0d10" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "img-mcp" }],
    ["meta", { property: "og:image", content: "https://aboubak-art.github.io/img-mcp/assets/og-image.jpg" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: "https://aboubak-art.github.io/img-mcp/assets/og-image.jpg" }],
  ],

  transformHead({ pageData }) {
    const path = pageData.relativePath
      .replace(/\.md$/, ".html")
      .replace(/index\.html$/, "");
    const canonical = `https://aboubak-art.github.io/img-mcp/${path}`;
    return [["link", { rel: "canonical", href: canonical }]];
  },

  themeConfig: {
    logo: "/assets/logo.svg",
    siteTitle: "img-mcp",
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/docs/index.html" },
      { text: "Roadmap", link: "/docs/roadmap.html" },
      { text: "GitHub", link: "https://github.com/aboubak-art/img-mcp" },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/docs/index.html" },
          { text: "Installation", link: "/docs/getting-started.html" },
          { text: "Configuration", link: "/docs/configuration.html" },
        ],
      },
      {
        text: "Tools",
        items: [
          { text: "generate_image", link: "/docs/tools/generate-image.html" },
          { text: "resize_image", link: "/docs/tools/resize.html" },
          { text: "convert_image", link: "/docs/tools/convert.html" },
          { text: "crop_image", link: "/docs/tools/crop.html" },
          { text: "compress_image", link: "/docs/tools/compress.html" },
          { text: "remove_background", link: "/docs/tools/remove-background.html" },
        ],
      },
      {
        text: "Providers",
        items: [{ text: "Google Nano Banana", link: "/docs/providers/google-nano-banana.html" }],
      },
      {
        text: "Project",
        items: [
          { text: "Roadmap", link: "/docs/roadmap.html" },
          { text: "Contributing", link: "/docs/contributing.html" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/aboubak-art/img-mcp" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Aboubakar Sidik Faha",
    },
    editLink: {
      pattern: "https://github.com/aboubak-art/img-mcp/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
    },
  },

  sitemap: {
    hostname: "https://aboubak-art.github.io/img-mcp/",
  },

  vite: {
    build: {
      emptyOutDir: true,
    },
  },
});
