# 4well — Shopify theme (Tea)

Shopify storefront theme (based on the commercial "Tea" theme by Halothemes), customized for the **4well** project. Single-language store.

## Structure

Standard Shopify theme layout:

| Folder | Purpose |
|--------|---------|
| `layout/` | Page shells (`theme.liquid`, `password.liquid`, `gift_card.liquid`) |
| `templates/` | Per-page-type templates (product, collection, blog, etc.) |
| `sections/` | Configurable content blocks (52) |
| `snippets/` | Reusable Liquid partials (77) |
| `assets/` | JS / CSS / SVG / images |
| `config/` | `settings_schema.json`, `settings_data.json` |
| `locales/` | Translation strings |

## Local development

```sh
shopify theme dev      # live preview against a dev store
shopify theme check    # lint Liquid / theme best practices
shopify theme push     # upload to the store
```

## Not uploaded to Shopify

See `.shopifyignore`. The `Tea User Guide/` folder is vendor documentation and must **not** be pushed to the store.

## SEO / code audit

A full static audit of this theme (structured data, meta/OG, semantic HTML, Liquid correctness) lives at `../SEO-CODE-AUDIT_2026-07-20.md`. Critical head, Open Graph, and breadcrumb fixes have been applied; remaining follow-ups (e.g. migrating deprecated `img_url` → `image_url`/`image_tag`) are tracked there.
