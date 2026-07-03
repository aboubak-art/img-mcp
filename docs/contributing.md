# Contributing

Contributions are welcome. img-mcp is released under the MIT License.

## Development setup

1. Clone the repository:

```bash
git clone https://github.com/aboubak-art/img-mcp.git
cd img-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Run in development mode:

```bash
npm run dev
```

4. Build the TypeScript source:

```bash
npm run build
```

5. Run tests:

```bash
npm test
```

## Testing with the MCP Inspector

After building, you can inspect the server with the MCP Inspector:

```bash
npm run build
npx @modelcontextprotocol/inspector dist/index.js
```

## Working on the website

The website source lives in `website/` and the documentation source lives in `docs/`.

To preview the documentation site locally:

```bash
npm run docs:dev
```

To build the full website (landing page + docs) for production:

```bash
npm run website:build
```

The built site is written to `website/`, which is then deployed to GitHub Pages.

## Submitting changes

1. Fork the repository and create a feature branch.
2. Make your changes and add or update tests where appropriate.
3. Run `npm run lint` and `npm run build` to ensure everything passes.
4. Open a pull request with a clear description of the change.

## Code of conduct

Be respectful and constructive. We want img-mcp to be a welcoming project for everyone.
