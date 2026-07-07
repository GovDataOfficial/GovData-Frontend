# Changelog

## 7.14.1 2026-06-24
- Updated nodemailer to 9.0.1, undici to 7.28.0 and added dompurify 3.4.11 override (fixes GHSA-p6gq-j5cr-w38f, GHSA-vmh5-mc38-953g, GHSA-pr7r-676h-xcf6, GHSA-p88m-4jfj-68fv, GHSA-vxpw-j846-p89q, GHSA-hm92-r4w5-c3mj, GHSA-35p6-xmwp-9g52, GHSA-g8m3-5g58-fq7m, GHSA-cmwh-pvxp-8882)
- Updated @vitejs/plugin-react to 6.0.2 and vite to 8.0.16 (fixes GHSA-gv7w-rqvm-qjhr, GHSA-g7r4-m6w7-qqqr)
- Raised semver floors in webapp/package.json to match installed versions (bootstrap, eslint, vitest, @vitest/coverage-v8, i18next, ioredis, iron-session, nodemailer, ol, ol-mapbox-style, pino, sharp, @fontsource/noto-sans, @ianvs/prettier-plugin-sort-imports, @testing-library/user-event, @types/node, @types/sanitize-html, content-security-policy-builder)
- Fix  GHSA-39q2-94rc-95cp, GHSA-h7mw-gpvr-xq4m,GHSA-crv5-9vww-q3g8, GHSA-v9jr-rg53-9pgp, GHSA-j452-xhg8-qg39, GHSA-58qx-3vcg-4xpx, GHSA-qx2v-qp2m-jg93, GHSA-5xrq-8626-4rwp
- Moved UserHeader to data management

## 7.14.0 2026-06-11
- Update to Elastic Search 9

## 7.13.1 2026-05-15
- Fix CVE-2026-45109, CVE-2026-44574, CVE-2026-44575, CVE-2026-44990

## 7.12.8 2026-04-21
- Fix CVE-2026-23869

## 7.12.7 2026-04-10
- Fix CVE-2026-39363, CVE-2025-14874, CVE-2021-23337, GHSA-vvjj-xcjg-gr5g

## 7.12.2 2026-03-19
- Fix CVE-2026-29063, CVE-2026-27979, CVE-2026-1525, CVE-2026-29057, CVE-2026-2581,
CVE-2026-27978, CVE-2026-1527, CVE-2026-27977 CVE-2026-1526, CVE-2026-1528, CVE-2026-2229, CVE-2026-32141

## 7.12.1 2026-03-04

- Fix CVE-2026-26996, CVE-2026-27904, CVE-2026-27903, CVE-2025-69873 and CVE-2026-27606

## 7.12.0 2026-02-16

- Updated @zazuko/yasgui to version 4.6.1
- Updated @testing-library/jest-dom to version 6.9.1
- Updated undici to version 7.19.2
- Updated Next.js to version 16.1.6
- Optimized CSP header in metadata details view
- Added new error handling for session timeout in forms
- Added documentation links to metadata details view

## 7.11.0 2026-01-21

- Added timestamp to error message in metadata form
- Changed mastodon link

## 7.10.0 2026-01-07

- Changed default contact email address
- Removed automatic focus when link "show more" is clicked in a facet on the search results page
- Add customization options for map preview styles and location search
- Add customization options for features, texts and styles

## 7.9.1 2025-12-16

- Updated brace-expansion to 1.1.12 (fixes GHSA-v6h2-p8h4-qcjw)
- Updated vite to 7.2.7 (fixes CVE-2025-58751, CVE-2025-58752, GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3, GHSA-93m4-6634-74q7)
- Updated eslint to 9.39.1 (fixes GHSA-xffm-g5w8-qvg7)
- Updated vitest to 4.0.15 (fixes GHSA-5j98-mcp5-4vw2)
- Updated openid-client to 6.8.1 (fixes CVE-2025-45767)
- Updated nodemailer to 7.0.11 (fixes CVE-2025-13033)

## 7.8.3 2025-12-12

- Fixed CVE-2025-55183 and CVE-2025-55184 with update to Next.js 15.5.9 and React to 19.1.4

## 7.8.2 2025-12-08

- Fixed CVE-2025-55182 with update to Next.js 15.5.7 and React to 19.1.2

## 7.8.0 2025-10-07

- Changed umbrella brand header text
- Updated next.js from 15.3.3 to 15.5.3

## 7.7.2 2025-09-08

- Changed geosearch url to use output format as parameter

## 7.7.0 2025-07-28

- Added metadata preview modal to metadata details page
- Added format select for metadata preview
- Updated Next.js to 15.3.3 and added various other minor updates
- Changed the layout of the sparql editor page

## 7.6.0 2025-07-01

- Updates triply/yasgui 4.2.28 to zazuko/yasgui 4.5.0. Fixes CVE-2025-48050
- Updates dependencies to latest patch versions
- Added image upload to showcases form
- Added geoJSON Validation to spatial inputs
- Added sticky navigation to showcases form
- Added permission check for showcase editors
- Added showcases overview
- Added showcase form
- Added default image for showcases
- Added user survey header

## 7.5.1 2025-04-16

- Fixed initial map search bounding box

## 7.5.0 2025-04-15

- Replaced comma with pipe as the separator for active filters
- Added resource loading and error handling
- Removed primary showcase type
- Added map preview for GeoJSON resources on search details page
- Updated OpenLayers to 10.4.0
- Updated map search
- Added search via tag to metadata detail view
- Added link to metadata in metadata overview

## 7.4.1 2025-03-27

- Updated next.js to 14.2.26. Fixes CVE-2025-29927

## 7.4.0 2025-02-11

- Update vitest to 2.1.9. Fixes CVE-2025-24964
- Removed the X (Twitter) social media link.
- Fixed path redirect for high value dataset information
- Updated undici to 7.3.0. Fixes CVE-2025-22150

## 7.3.0 2025-01-13

- Added umbrella brand header
- Added copy to clipboard functionality to resources

## 7.2.0 2024-12-19

- Update NextJs to 14.2.20. Fixes CVE-2024-51479
- Update nanoid to 3.3.8. Fixes CVE-2024-55565
- Added missing translations for showcase_types and system filters
- Improvements for the metadata management form

## 7.1.2 2024-12-09

- Fixes editing metadata with unknown licenses or licenses that are not part of the newest DCAT-AP license version

## 7.1.1 2024-11-28

- Fixes and improvements for metadata management form

## 7.1.0 2024-11-26

- Added user authentification
- Added new area for metadata management

## 7.0.0 2024-09-13

- Initial commit: The template-engine replaces the old liferay based frontend ([Open CoDE](https://gitlab.opencode.de/fitko/govdata/GovDataPortal), [GitHub](https://github.com/GovDataOfficial/GovDataPortal))
