# Marcos Cervantes — Software, AI & Automation

Bilingual professional portfolio, migrated to **React + Vite**. Includes 30 projects, four detailed case studies, searchable project archive, system architecture tabs, experience, and downloadable CVs.

## What changed

- The updated portfolio design and content are now React components.
- Animated ambient lights and an orbital accent behind the hero.
- A moving technology ribbon, staggered section reveals, an animated project counter, and interactive project cards.
- Preserved portrait, English/Spanish, dark/light themes, architecture tabs and CV downloads.
- Motion effects respect `prefers-reduced-motion`; ambient graphics are decorative.
- Images are separate assets instead of embedded base64 inside the application source.
- Correct GitHub profile link and page/social metadata.

## Development

Use Node.js 22.12 or later:

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run preview
npm run lint
```

## Vercel

Use the existing portfolio repository and Vercel project to retain the domain.

- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

This package includes editable source and a production build. It does not change the live Vercel project until its source is published to the connected repository.

## Editing

| File | Purpose |
| --- | --- |
| `src/App.jsx` | React components and interactions |
| `src/content.json` | Project catalog, languages, experience and architecture |
| `src/style.css` | Base layout and responsive design |
| `src/enhancements.css` | Themes and interaction styles |
| `src/motion.css` | Additional ambient and interactive motion |
| `public/images/marcos.jpg` | Original portrait |
| `public/cv/` | Original English and Spanish CVs |
| `index.html` | Metadata and application entry |

Experience dates and claims are preserved from the supplied updated portfolio and CV. The original CV PDFs have not been rewritten. Private client code, credentials and workflow exports are not included.

## Validation

Production build and ESLint passed. Component interaction checks covered project counts, language switching, persisted theme, category filters, case dialogs, keyboard navigation for architecture tabs, mobile menu, and language-specific CV links.

## Español

Portafolio profesional de Marcos Cervantes, desarrollado en React y Vite, con proyectos de software, IA y automatización. La versión incluye nuevas animaciones, mantiene la fotografía original y adapta los controles y casos al español e inglés. Para publicar en el proyecto existente de Vercel, utiliza el framework Vite y la carpeta de salida `dist`.
