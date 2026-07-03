<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { withBase } from "vitepress";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const heroImage = withBase("/assets/hero.jpg");

const features = [
  {
    title: "Generate images",
    description:
      "Text-to-image, image-to-image with reference photos, and transparent-background output — all through one tool call.",
    image: withBase("/assets/illustrations/generate.jpg"),
  },
  {
    title: "Resize & crop",
    description:
      "Scale by width, height, percentage, or fit mode. Fast local processing with sharp — no API key needed.",
    image: withBase("/assets/illustrations/resize.jpg"),
  },
  {
    title: "Convert formats",
    description:
      "Switch between JPEG, PNG, WebP, AVIF, and GIF locally. Tweak quality to optimize file size.",
    image: withBase("/assets/illustrations/convert.jpg"),
  },
  {
    title: "Transparent backgrounds",
    description:
      "Generate clean PNG assets with the background removed, ready for logos, overlays, and product shots.",
    image: withBase("/assets/illustrations/transparent.png"),
  },
  {
    title: "Reference images",
    description:
      "Pass base64 or data-URI images to guide style, subject, and composition across generations.",
    image: withBase("/assets/illustrations/reference.jpg"),
  },
  {
    title: "Batch operations",
    description:
      "Apply the same transform to multiple images in one call. Perfect for thumbnails, exports, and asset pipelines.",
    image: withBase("/assets/illustrations/batch.jpg"),
  },
];

const steps = [
  {
    number: "1",
    title: "Set up in seconds",
    description:
      "No API key is required for local manipulation. Add a Google API key only when you want AI image generation.",
  },
  {
    number: "2",
    title: "Add to your MCP host",
    description:
      "Register img-mcp with one command in Claude Code, Cursor, Windsurf, Kimi, OpenCode, or any MCP host.",
  },
  {
    number: "3",
    title: "Edit or generate images",
    description:
      "Tell your agent what to do. img-mcp resizes, converts, crops, or generates images and returns the result.",
  },
];

const roadmap = {
  shipped: [
    "Text-to-image generation",
    "Reference-image generation",
    "Transparent backgrounds",
    "Multiple aspect ratios and sizes",
    "Zero-install usage with npx",
    "Bring-your-own Google API key",
    "Resize & convert (local)",
  ],
  planned: [
    "Crop, rotate & flip",
    "Compress / optimize",
    "Blur & sharpen",
    "Adjustments (brightness, contrast, saturation, etc.)",
    "Filters & effects",
    "Metadata read/write (EXIF, IPTC, XMP)",
    "Batch operations",
    "Watermark / overlay",
    "Collage / montage",
    "Sprite sheet generation",
    "Image comparison",
    "Thumbnails",
    "Animated image support",
    "SVG rasterization",
  ],
  research: [
    "Additional generation providers",
    "Upscale & super-resolution",
    "Inpainting / outpainting",
    "Background replacement",
    "Style transfer & presets",
    "Image analysis feedback loop",
  ],
};

const installSnippet = `\# Local image manipulation only (no API key needed)
$ claude mcp add --transport stdio img-mcp -- npx -y img-mcp

\# With AI image generation enabled
$ claude mcp add --env GOOGLE_API_KEY=YOUR_KEY --transport stdio img-mcp -- npx -y img-mcp`;

const scrolled = ref(false);
const mobileOpen = ref(false);
const copied = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > 10;
}

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installSnippet.replace(/\\#/g, "#"));
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    // ignore
  }
}

let triggers: ScrollTrigger[] = [];

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
    .from(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
    .from(".hero-lead", { y: 24, opacity: 0, duration: 0.7 }, "-=0.55")
    .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
    .from(".hero-meta", { y: 16, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(".hero-visual", { scale: 0.96, opacity: 0, duration: 1 }, "-=0.8");

  const reveal = gsap.utils.toArray<HTMLElement>(".reveal");
  reveal.forEach((el) => {
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
        );
      },
    });
    triggers.push(st);
  });

  const cards = gsap.utils.toArray<HTMLElement>(".feature-card, .step-card, .roadmap-item");
  cards.forEach((el) => {
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
        );
      },
    });
    triggers.push(st);
  });

  gsap.to(".hero-orb-1", {
    y: -80,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  gsap.to(".hero-orb-2", {
    y: 60,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  triggers.forEach((t) => t.kill());
  triggers = [];
});
</script>

<template>
  <div class="landing-page">
    <header class="site-header" :class="{ scrolled }">
      <div class="container">
        <a class="logo" href="./" aria-label="img-mcp home">
          <img :src="withBase('/assets/logo.svg')" alt="" width="28" height="28" />
          <span>img-mcp</span>
        </a>
        <nav id="nav" class="nav" :class="{ open: mobileOpen }" aria-label="Primary">
          <a href="#features" @click="mobileOpen = false">Features</a>
          <a href="#how-it-works" @click="mobileOpen = false">How it works</a>
          <a href="#roadmap" @click="mobileOpen = false">Roadmap</a>
          <a :href="withBase('/docs/index.html')" @click="mobileOpen = false">Docs</a>
          <a href="https://github.com/aboubak-art/img-mcp" target="_blank" rel="noopener" @click="mobileOpen = false">GitHub</a>
          <a class="button button-primary" href="#install" @click="mobileOpen = false">Get started</a>
        </nav>
        <button
          class="mobile-menu-toggle"
          aria-label="Toggle menu"
          :aria-expanded="mobileOpen"
          aria-controls="nav"
          @click="mobileOpen = !mobileOpen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-bg" aria-hidden="true">
          <div class="hero-orb hero-orb-1"></div>
          <div class="hero-orb hero-orb-2"></div>
        </div>
        <div class="container">
          <div class="hero-content">
            <div class="badge-pill hero-badge">Open-source image MCP server</div>
            <h1 id="hero-title" class="hero-title">
              Give your agents a complete <span class="gradient-text">image toolkit</span>
            </h1>
            <p class="hero-lead">
              <strong>img-mcp</strong> is an MCP server that lets agents resize, crop, convert,
              compress, and edit images locally with Node.js — plus generate images when you want
              AI. No Docker, no shared keys, no friction.
            </p>
            <div class="hero-cta">
              <a class="button button-primary" href="#install">Get started in 60 seconds</a>
              <a class="button button-secondary" :href="withBase('/docs/index.html')">Read the docs</a>
            </div>
            <div class="hero-meta">
              <span><span class="dot" aria-hidden="true"></span> MIT licensed</span>
              <span><span class="dot" aria-hidden="true"></span> Zero install with npx</span>
              <span><span class="dot" aria-hidden="true"></span> Node.js powered</span>
            </div>
          </div>
          <div class="hero-visual">
            <img :src="heroImage" alt="Illustration of an AI agent workspace with image generation and local Node.js processing" width="1376" height="768" loading="eager" />
          </div>
        </div>
      </section>

      <section class="trust" aria-label="Compatible platforms">
        <div class="container">
          <span class="trust-label">Works with</span>
          <div class="trust-logos">
            <span>Claude Desktop</span>
            <span>Cursor</span>
            <span>Windsurf</span>
            <span>Kimi Code</span>
            <span>OpenCode</span>
            <span>Codex CLI</span>
          </div>
        </div>
      </section>

      <section class="features" id="features" aria-labelledby="features-title">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-label">Features</span>
            <h2 id="features-title">A complete image toolkit for agents</h2>
            <p>From fast local edits to AI-powered generation — one MCP server, zero setup.</p>
          </div>
          <div class="feature-grid">
            <article v-for="feature in features" :key="feature.title" class="feature-card">
              <div class="feature-image">
                <img :src="feature.image" :alt="feature.title" width="512" height="512" loading="lazy" />
              </div>
              <div class="feature-body">
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="steps" id="how-it-works" aria-labelledby="steps-title">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-label">How it works</span>
            <h2 id="steps-title">From command to edited image in three steps</h2>
            <p>img-mcp translates your agent's instructions into local image operations or generation calls.</p>
          </div>

          <div class="architecture reveal" aria-hidden="true">
            <svg viewBox="0 0 720 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="40" width="140" height="80" rx="12" fill="#161a23" stroke="#262b3a" stroke-width="2" />
              <text x="90" y="78" text-anchor="middle" fill="#f5f7fa" font-size="13" font-weight="600">MCP Host</text>
              <text x="90" y="96" text-anchor="middle" fill="#9aa3b2" font-size="10">Claude, Cursor, Kimi…</text>

              <path d="M170 80 H250" stroke="#7c5cff" stroke-width="2" stroke-dasharray="4 3" />
              <polygon points="250,76 258,80 250,84" fill="#7c5cff" />

              <rect x="260" y="30" width="200" height="100" rx="14" fill="rgba(124,92,255,0.08)" stroke="#7c5cff" stroke-width="2" />
              <text x="360" y="68" text-anchor="middle" fill="#f5f7fa" font-size="15" font-weight="700">img-mcp</text>
              <text x="360" y="88" text-anchor="middle" fill="#9aa3b2" font-size="11">MCP server over stdio</text>
              <text x="360" y="106" text-anchor="middle" fill="#00d4aa" font-size="10">Node.js</text>

              <path d="M470 60 H550" stroke="#00d4aa" stroke-width="2" />
              <polygon points="550,56 558,60 550,64" fill="#00d4aa" />
              <rect x="570" y="20" width="140" height="50" rx="10" fill="#11141a" stroke="#262b3a" stroke-width="2" />
              <text x="640" y="45" text-anchor="middle" fill="#f5f7fa" font-size="12" font-weight="600">sharp</text>
              <text x="640" y="60" text-anchor="middle" fill="#9aa3b2" font-size="9">local edits</text>

              <path d="M470 100 H550" stroke="#7c5cff" stroke-width="2" />
              <polygon points="550,96 558,100 550,104" fill="#7c5cff" />
              <rect x="570" y="90" width="140" height="50" rx="10" fill="#11141a" stroke="#262b3a" stroke-width="2" />
              <text x="640" y="115" text-anchor="middle" fill="#f5f7fa" font-size="12" font-weight="600">Gemini API</text>
              <text x="640" y="130" text-anchor="middle" fill="#9aa3b2" font-size="9">AI generation</text>
            </svg>
          </div>

          <div class="steps-grid">
            <article v-for="step in steps" :key="step.number" class="step-card">
              <div class="step-number">{{ step.number }}</div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="install" id="install" aria-labelledby="install-title">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-label">Quick start</span>
            <h2 id="install-title">Add to Claude Code in one command</h2>
            <p>No JSON files, no Docker, no manual config. Just run the CLI.</p>
          </div>
          <div class="terminal reveal">
            <div class="terminal-header">
              <div class="terminal-dots" aria-hidden="true"><span></span><span></span><span></span></div>
              <span class="terminal-title">terminal</span>
              <button class="terminal-copy" type="button" @click="copyInstall">
                {{ copied ? "Copied!" : "Copy" }}
              </button>
            </div>
            <div class="terminal-body">
              <pre><span class="comment"># Local image manipulation only (no API key needed)</span>
<span class="prompt">$</span> <span class="command">claude mcp add --transport stdio img-mcp -- npx -y img-mcp</span>

<span class="comment"># With AI image generation enabled</span>
<span class="prompt">$</span> <span class="command">claude mcp add --env GOOGLE_API_KEY=YOUR_KEY --transport stdio img-mcp -- npx -y img-mcp</span></pre>
            </div>
          </div>
        </div>
      </section>

      <section class="roadmap" id="roadmap" aria-labelledby="roadmap-title">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-label">Roadmap</span>
            <h2 id="roadmap-title">Where img-mcp is headed</h2>
            <p>AI generation brought us here. The future is fast, local, non-AI image manipulation built on Node.js.</p>
          </div>
          <div class="roadmap-grid">
            <article class="roadmap-column">
              <h3 class="roadmap-heading shipped">Shipped</h3>
              <div class="roadmap-list">
                <div v-for="item in roadmap.shipped" :key="item" class="roadmap-item">
                  <span class="roadmap-dot shipped"></span>
                  <span>{{ item }}</span>
                </div>
              </div>
            </article>
            <article class="roadmap-column">
              <h3 class="roadmap-heading planned">Planned</h3>
              <div class="roadmap-list">
                <div v-for="item in roadmap.planned" :key="item" class="roadmap-item">
                  <span class="roadmap-dot planned"></span>
                  <span>{{ item }}</span>
                </div>
              </div>
            </article>
            <article class="roadmap-column">
              <h3 class="roadmap-heading research">Research</h3>
              <div class="roadmap-list">
                <div v-for="item in roadmap.research" :key="item" class="roadmap-item">
                  <span class="roadmap-dot research"></span>
                  <span>{{ item }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="cta" aria-labelledby="cta-title">
        <div class="container">
          <div class="cta-inner reveal">
            <h2 id="cta-title">Ready to give your agent image superpowers?</h2>
            <p>Join the open-source community and start manipulating and generating images with img-mcp today.</p>
            <div class="hero-cta" style="justify-content: center;">
              <a class="button button-primary" href="https://github.com/aboubak-art/img-mcp" target="_blank" rel="noopener">View on GitHub</a>
              <a class="button button-secondary" :href="withBase('/docs/index.html')">Read documentation</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="logo" href="./">
              <img :src="withBase('/assets/logo.svg')" alt="" width="28" height="28" />
              <span>img-mcp</span>
            </a>
            <p>Open-source image manipulation and generation for the Model Context Protocol ecosystem.</p>
          </div>
          <div class="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a :href="withBase('/docs/index.html')">Documentation</a></li>
              <li><a href="https://www.npmjs.com/package/img-mcp" target="_blank" rel="noopener">npm package</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">MCP spec</a></li>
              <li><a href="https://ai.google.dev/gemini-api/docs/image-generation" target="_blank" rel="noopener">Gemini image generation</a></li>
              <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Get a Google API key</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Community</h4>
            <ul>
              <li><a href="https://github.com/aboubak-art/img-mcp" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="https://github.com/aboubak-art/img-mcp/issues" target="_blank" rel="noopener">Issues</a></li>
              <li><a href="https://github.com/aboubak-art/img-mcp/blob/main/LICENSE" target="_blank" rel="noopener">License</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 img-mcp. Released under the MIT License.</span>
          <span>Made by <a href="https://github.com/aboubak-art" target="_blank" rel="noopener">Aboubakar Sidik Faha</a></span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import "./landing.css";
</style>
