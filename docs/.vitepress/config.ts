import { defineConfig } from "vitepress";

export default defineConfig({
  title: "img-mcp Docs",
  titleTemplate: ":title | img-mcp",
  description:
    "Documentation for img-mcp, the open-source MCP server for AI image generation. Learn how to install, configure, and use the generate_image tool.",
  base: "/img-mcp/docs/",
  outDir: "../website/docs",
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

  themeConfig: {
    logo: "https://aboubak-art.github.io/img-mcp/assets/logo.svg",
    siteTitle: "img-mcp",
    nav: [
      { text: "Home", link: "https://aboubak-art.github.io/img-mcp/" },
      { text: "Docs", link: "/" },
      { text: "Roadmap", link: "/roadmap" },
      { text: "GitHub", link: "https://github.com/aboubak-art/img-mcp" },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Installation", link: "/getting-started" },
          { text: "Configuration", link: "/configuration" },
        ],
      },
      {
        text: "Tools",
        items: [
          { text: "generate_image", link: "/tools/generate-image" },
          { text: "resize_image", link: "/tools/resize" },
          { text: "convert_image", link: "/tools/convert" },
        ],
      },
      {
        text: "Providers",
        items: [{ text: "Google Nano Banana", link: "/providers/google-nano-banana" }],
      },
      {
        text: "Project",
        items: [
          { text: "Roadmap", link: "/roadmap" },
          { text: "Contributing", link: "/contributing" },
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
    hostname: "https://aboubak-art.github.io/img-mcp/docs/",
  },
});
