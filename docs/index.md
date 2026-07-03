---
layout: landing

head:
  - - meta
    - name: description
      content: img-mcp is an open-source MCP server for AI agents. Resize, crop, convert, compress, remove backgrounds, and generate images — all from Node.js.
  - - meta
    - name: keywords
      content: MCP, Model Context Protocol, image manipulation, image generation, resize, crop, convert, compress, AI images, open source, img-mcp
  - - meta
    - name: author
      content: Aboubakar Sidik Faha
  - - meta
    - property: og:title
      content: img-mcp — Image Manipulation & Generation MCP Server
  - - meta
    - property: og:description
      content: Open-source MCP server for AI agents. Resize, crop, convert, compress, remove backgrounds, and generate images from Node.js.
  - - meta
    - property: og:url
      content: https://aboubak-art.github.io/img-mcp/
  - - meta
    - name: twitter:title
      content: img-mcp — Image Manipulation & Generation MCP Server
  - - meta
    - name: twitter:description
      content: Open-source MCP server for AI agents. Resize, crop, convert, compress, remove backgrounds, and generate images from Node.js.
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "img-mcp",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Cross-platform",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "license": "https://github.com/aboubak-art/img-mcp/blob/main/LICENSE",
        "codeRepository": "https://github.com/aboubak-art/img-mcp",
        "downloadUrl": "https://www.npmjs.com/package/img-mcp",
        "softwareVersion": "1.1.1",
        "description": "An open-source MCP server for AI image generation and local Node.js image manipulation.",
        "featureList": [
          "Text-to-image generation",
          "Image-to-image generation with reference images",
          "Transparent background generation",
          "Resize, crop, and convert images locally",
          "Format conversion and compression",
          "Batch image operations",
          "Zero-install usage with npx"
        ]
      }
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is img-mcp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "img-mcp is an open-source Model Context Protocol (MCP) server that lets AI agents manipulate and generate images. Core operations run locally via Node.js, while AI generation uses Google's Nano Banana models."
            }
          },
          {
            "@type": "Question",
            "name": "How do I install img-mcp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can run img-mcp without installing it via npx: npx -y img-mcp. AI generation requires a Google API key from Google AI Studio; local manipulation does not."
            }
          },
          {
            "@type": "Question",
            "name": "Which MCP hosts work with img-mcp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "img-mcp works with any MCP-compatible host, including Claude Desktop, Cursor, Windsurf, Kimi Code, OpenCode, and OpenAI Codex CLI."
            }
          }
        ]
      }
---
