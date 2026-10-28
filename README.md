# Static web site template for deploy to Cloudflare Workers

This template provides a starting point for deploying a static web site to Cloudflare Workers, including automatic generation of `sitemap.xml` and `robots.txt` files.

Static files should be placed in the 'public' folder.

## Configuration

Configure the Cloudflare Worker name in `wrangler.jsonc`.

Set the package name in `package.json` to match your project.

Assets folder is `public` by default. This template contains sample files. Remove and replace as required. The folder is also configurable via the `SITE_DIR` environment variable and the `assets.directory` field in `wrangler.jsonc`.

## Deploy

`npm install` to install the required dependencies if they are not already installed.

`npm run deploy` deploys the static web site to Cloudflare Workers.

Optionally also generates `sitemap.xml` and `robots.txt` in `SITE_DIR` if `SITE_URL` is set (see `.env.example`; copy to `.env`), runs `wrangler deploy`, and, if `CLEANUP_GENERATED_FILES=true`, removes the newly created generated files.

To only generate the files: `npm run generate`.
