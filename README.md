# Makendi Worldwide

A from-scratch bilingual corporate and ingredient-portfolio experience for Makendi Worldwide. The application keeps the visual relationship with Coffendi and Makendi.coffee while giving the food-ingredient business its own navy, cream and orange identity.

## What is included

- English and Turkish content with persistent language selection
- Twelve ingredient families and sixty product formats migrated from Makendi’s public catalog
- Searchable ingredient index and dedicated family pages
- Destination desk with 28 locally served, real flag assets
- Explicit separation between documented company/event touchpoints and selectable inquiry destinations
- Company, working-model, quality and responsibility experiences
- Source archive containing three migrated PDF documents, three historical event entries and a curated photo gallery
- Accessible native `<dialog>` gallery viewer
- Structured email inquiry flow with category and destination preselection
- Responsive layouts for desktop, tablet, 390px mobile and 320px narrow screens
- Reduced-motion support, keyboard focus, WCAG 2.2 automated checks and semantic landmarks
- Local fonts, responsive WebP imagery, immutable asset caching and production security headers
- A small native History API router with no third-party routing dependency

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Corporate overview and primary journeys |
| `/products` | Searchable ingredient portfolio |
| `/products/:family` | Published formats for one ingredient family |
| `/solutions` | Procurement-to-destination working model |
| `/network` | Flags, documented touchpoints and destination selection |
| `/company` | Verified company context and rebuild principles |
| `/quality` | Specification-led quality approach |
| `/responsibility` | Carefully bounded archive of the published responsibility statement |
| `/archive` | PDFs, event history and gallery |
| `/contact` | Direct contact and structured mail inquiry |
| `/privacy` | Privacy and inquiry behavior |

## Local development

```bash
npm install
npm run dev
```

Production preview:

```bash
npm run build
npm run preview -- --port 4173
```

## Verification

Run the production preview at `http://127.0.0.1:4173`, then:

```bash
npm run test:content
npm run test:links
npm run test:interactions
npm run test:a11y
npm run test:visual
npm run test:performance
npm run test:bundle
```

`npm run test:production` targets `https://makendi-worldwide.vercel.app` by default. Override it with `PRODUCTION_URL`.

## Content boundaries

The public catalog and documents were reviewed as historical source material. The interface does not invent or silently modernize stock, prices, origin, grades, pack sizes, minimum quantities, certifications, lead times, delivery commitments or quantified responsibility claims. Archived PDFs are labelled accordingly because details inside them may require current confirmation.

The inquiry form does not send data to a web backend. It prepares a message in the visitor’s email application for `info@makendi.com`.
