# GovData Template-Engine

A NextJS/React based frontend for GovData

## Getting Started

go to webapp folder

```bash
cd webapp
```

installing all dependencies

```bash
npm install
```

running development server on http://localhost:3000

```bash
npm run dev
```

see package.json for more scripts 


## Customization

The template engine provides flexible customization options through a structured override system.

### Text Localization

Override default text strings by modifying `webapp/src/i18n/locales/custom.json`. This file takes precedence over the base translations defined in the govdata namespace within `webapp/src/i18n/locales/de.json`.

The portal's name can be overwritten with a single line: `"portal.name": "CustomPortal"`. This name will be used in all other relevant translation texts.

### Styling

**Custom Styles**: Implement style overrides in `webapp/src/css/custom/_custom.scss`. This file is imported last in the SASS compilation order (as configured in `webapp/src/css/main.scss`), ensuring your customizations take precedence.

**Color Tokens**: Define custom color variables in `webapp/src/css/custom/_custom-color-tokens.scss`. Note that import order is critical for proper variable resolution.

### Feature Management

Control application features through the configuration file `webapp/src/configuration/featureFlags/featureFlags.custom.ts`. Reference the default configuration at `webapp/src/configuration/featureFlags/featureFlags.default.ts` for available options.

#### Footer Logo

When the feature `useSocialMediaLinks` is disabled, a footer logo with a clickable link will be rendered instead of social media links.

**Requirements:**
- **Image**: Place your logo file as `footer_logo.svg` in the `public/images/` folder
- **Environment Variables**:
  - `footer_logo_link`: The URL the logo should link to
  - `footer_logo_link_alt`: The alt text for the logo image (for accessibility)


### Map Handling

Configure map behavior and appearance through `webapp/src/configuration/options/options.custom.ts`. Reference the default configuration at `webapp/src/configuration/options/options.default.ts` for available options.

#### Location Search

Customize the location search map by overriding the `locationsearch` property. Available options include:

- **view**: Map view settings (center, zoom levels, extent)
- **defaultBoundingBox**: Default bounding box coordinates for the search area

#### Map Preview

Customize the appearance of map preview features by overriding the `resourcePreviewMap` property. Available options include:

- **strokeColor**: Border color of map features (hex format)
- **fillColor**: Fill color of map features (hex format with optional alpha channel)


## Helpful Links

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
