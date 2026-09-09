# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [7.15.0  2026-09-03]

### Changed
- Updated Next.js to 16.3.3
- Updated sanitize-html to 2.17.7
- Updated @testing-library/user-event to 14.6.4
- Updated @testing-library/react to 16.3.3
- Updated openid-client to 6.8.5
- Updated nodemailer to 9.1.1
- Updated sharp to 0.35.4

### Fixed
- HVD category filter in extended search falls back to the full vocabulary when the index service is unreachable (previously rendered an empty widget)
- HVD category URIs on a dataset are preserved on save when the vocabulary is degraded (previously silently dropped by the metadata form)

### Security

## 7.14.4  2026-08-25
- Updated brace-expansion to 5.0.9, dompurify to 3.4.14, js-yaml to 4.3.1 and nanoid to 3.3.18 (fixes GHSA-rgw5-rvv9-x895, GHSA-55q2-fjhq-7xh7, GHSA-5p4m-2wfm-xmqj, GHSA-2v37-7h3g-55p8)
- Updated Next.js to 16.3.2
- Updated @vitejs/plugin-react to 6.1.0
- Updated openid-client to 6.8.7
- Updated sanitize-html to 2.17.7
- Updated @zazuko/yasgui to 4.6.2
- Updated @testing-library/user-event to 14.6.6
- Updated @types/react-dom to 19.2.5
- Updated minimatch to 10.2.6
- Updated sass to 1.103.1
- Updated vitest and @vitest/coverage-v8 to 4.1.11
- Raised semver floors in webapp/package.json to match installed versions and consolidated overrides to brace-expansion, minimatch, dompurify and nanoid (security floors)
- Switched `next build` to `--webpack` in the pipeline; Turbopack (Next 16 default) fails to resolve UMD wrappers bundled inside @zazuko/yasgui's CodeMirror addons
- Suppressed OWASP false-positive for nanoid CVE-2026-67214 via `packageUrl` regex (patched at 3.3.16, installed 3.3.18) and removed obsolete jsonwebtoken/babel suppressions that no longer matched
- Added automated publish pipeline to GitHub and OpenCode
- Renovate now bumps package.json semver ranges (`rangeStrategy: bump`) instead of only updating the lockfile

## [7.14.3] - 2026-08-05

### Added
- Ability to disable data types in extended search via the environment configuration
- Renovate Bot configuration with concurrent PR limit

### Changed
- Renovate Bot schedule from nights to daily
- Updated @vitejs/plugin-react to 6.0.5
- Updated @types/react to 19.2.18, @types/react-dom to 19.2.4
- Updated ol to 10.9.0
- Updated OWASP dependency-check plugin to 12.2.2
- Updated @vitejs/plugin-react to 6.0.3
- Updated sanitize-html to 2.17.6 and @types/sanitize-html to 2.16.1
- Updated react and react-dom to 19.2.7, @types/react to 19.2.17
- Updated vitest and @vitest/coverage-v8 to 4.1.10
- Updated eslint to 9.39.5
- Updated eslint-formatter-gitlab to 7.2.0
- Updated @ianvs/prettier-plugin-sort-imports to 4.7.1
- Updated @types/node to 22.20.1
- Updated ioredis to 5.11.1
- Updated @fontsource/noto-sans to 5.2.10
- Updated @eslint/eslintrc to 3.3.5
- Updated nodemailer to 9.0.3
- Updated @fortawesome/fontawesome-free to 6.7.2
- Updated @testing-library/react to 16.3.2
- Updated bootstrap to 5.3.8
- Updated openid-client to 6.8.4
- Updated @types/prismjs to 1.26.6

### Fixed
- ResourcePreviewMap for breaking change in OpenLayers 10.9.0

## [7.14.1] - 2026-06-24

### Changed
- Raised semver floors in webapp/package.json to match installed versions (bootstrap, eslint, vitest, @vitest/coverage-v8, i18next, ioredis, iron-session, nodemailer, ol, ol-mapbox-style, pino, sharp, @fontsource/noto-sans, @ianvs/prettier-plugin-sort-imports, @testing-library/user-event, @types/node, @types/sanitize-html, content-security-policy-builder)
- Moved UserHeader to data management

### Security
- Updated nodemailer to 9.0.1, undici to 7.28.0 and added dompurify 3.4.11 override (fixes GHSA-p6gq-j5cr-w38f, GHSA-vmh5-mc38-953g, GHSA-pr7r-676h-xcf6, GHSA-p88m-4jfj-68fv, GHSA-vxpw-j846-p89q, GHSA-hm92-r4w5-c3mj, GHSA-35p6-xmwp-9g52, GHSA-g8m3-5g58-fq7m, GHSA-cmwh-pvxp-8882)
- Updated @vitejs/plugin-react to 6.0.2 and vite to 8.0.16 (fixes GHSA-gv7w-rqvm-qjhr, GHSA-g7r4-m6w7-qqqr)
- Fix GHSA-39q2-94rc-95cp, GHSA-h7mw-gpvr-xq4m, GHSA-crv5-9vww-q3g8, GHSA-v9jr-rg53-9pgp, GHSA-j452-xhg8-qg39, GHSA-58qx-3vcg-4xpx, GHSA-qx2v-qp2m-jg93, GHSA-5xrq-8626-4rwp

## [7.14.0] - 2026-06-11

### Changed
- Update to Elastic Search 9

## [7.13.1] - 2026-05-15

### Security
- Fix CVE-2026-45109, CVE-2026-44574, CVE-2026-44575, CVE-2026-44990

## [7.12.8] - 2026-04-21

### Security
- Fix CVE-2026-23869

## [7.12.7] - 2026-04-10

### Security
- Fix CVE-2026-39363, CVE-2025-14874, CVE-2021-23337, GHSA-vvjj-xcjg-gr5g

## [7.12.2] - 2026-03-19

### Security
- Fix CVE-2026-29063, CVE-2026-27979, CVE-2026-1525, CVE-2026-29057, CVE-2026-2581, CVE-2026-27978, CVE-2026-1527, CVE-2026-27977, CVE-2026-1526, CVE-2026-1528, CVE-2026-2229, CVE-2026-32141

## [7.12.1] - 2026-03-04

### Security
- Fix CVE-2026-26996, CVE-2026-27904, CVE-2026-27903, CVE-2025-69873 and CVE-2026-27606

## [7.12.0] - 2026-02-16

### Added
- New error handling for session timeout in forms
- Documentation links to metadata details view

### Changed
- Updated @zazuko/yasgui to version 4.6.1
- Updated @testing-library/jest-dom to version 6.9.1
- Updated undici to version 7.19.2
- Updated Next.js to version 16.1.6
- Optimized CSP header in metadata details view

## [7.11.0] - 2026-01-21

### Added
- Timestamp to error message in metadata form

### Changed
- Mastodon link

## [7.10.0] - 2026-01-07

### Added
- Customization options for map preview styles and location search
- Customization options for features, texts and styles

### Changed
- Default contact email address
- Removed automatic focus when link "show more" is clicked in a facet on the search results page

## [7.9.1] - 2025-12-16

### Security
- Updated brace-expansion to 1.1.12 (fixes GHSA-v6h2-p8h4-qcjw)
- Updated vite to 7.2.7 (fixes CVE-2025-58751, CVE-2025-58752, GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3, GHSA-93m4-6634-74q7)
- Updated eslint to 9.39.1 (fixes GHSA-xffm-g5w8-qvg7)
- Updated vitest to 4.0.15 (fixes GHSA-5j98-mcp5-4vw2)
- Updated openid-client to 6.8.1 (fixes CVE-2025-45767)
- Updated nodemailer to 7.0.11 (fixes CVE-2025-13033)

## [7.8.3] - 2025-12-12

### Security
- Fixed CVE-2025-55183 and CVE-2025-55184 with update to Next.js 15.5.9 and React to 19.1.4

## [7.8.2] - 2025-12-08

### Security
- Fixed CVE-2025-55182 with update to Next.js 15.5.7 and React to 19.1.2

## [7.8.0] - 2025-10-07

### Changed
- Umbrella brand header text
- Updated next.js from 15.3.3 to 15.5.3

## [7.7.2] - 2025-09-08

### Changed
- Geosearch url to use output format as parameter

## [7.7.0] - 2025-07-28

### Added
- Metadata preview modal to metadata details page
- Format select for metadata preview

### Changed
- Updated Next.js to 15.3.3 and added various other minor updates
- Layout of the sparql editor page

## [7.6.0] - 2025-07-01

### Added
- Image upload to showcases form
- GeoJSON validation to spatial inputs
- Sticky navigation to showcases form
- Permission check for showcase editors
- Showcases overview
- Showcase form
- Default image for showcases
- User survey header

### Changed
- Updated dependencies to latest patch versions

### Security
- Updates triply/yasgui 4.2.28 to zazuko/yasgui 4.5.0 (fixes CVE-2025-48050)

## [7.5.1] - 2025-04-16

### Fixed
- Initial map search bounding box

## [7.5.0] - 2025-04-15

### Added
- Resource loading and error handling
- Map preview for GeoJSON resources on search details page
- Search via tag to metadata detail view
- Link to metadata in metadata overview

### Changed
- Replaced comma with pipe as the separator for active filters
- Updated OpenLayers to 10.4.0
- Updated map search

### Removed
- Primary showcase type

## [7.4.1] - 2025-03-27

### Security
- Updated next.js to 14.2.26 (fixes CVE-2025-29927)

## [7.4.0] - 2025-02-11

### Fixed
- Path redirect for high value dataset information

### Removed
- The X (Twitter) social media link

### Security
- Update vitest to 2.1.9 (fixes CVE-2025-24964)
- Updated undici to 7.3.0 (fixes CVE-2025-22150)

## [7.3.0] - 2025-01-13

### Added
- Umbrella brand header
- Copy to clipboard functionality to resources

## [7.2.0] - 2024-12-19

### Added
- Missing translations for showcase_types and system filters

### Changed
- Improvements for the metadata management form

### Security
- Update NextJs to 14.2.20 (fixes CVE-2024-51479)
- Update nanoid to 3.3.8 (fixes CVE-2024-55565)

## [7.1.2] - 2024-12-09

### Fixed
- Editing metadata with unknown licenses or licenses that are not part of the newest DCAT-AP license version

## [7.1.1] - 2024-11-28

### Fixed
- Fixes and improvements for metadata management form

## [7.1.0] - 2024-11-26

### Added
- User authentication
- New area for metadata management

## [7.0.0] - 2024-09-13

### Added
- Initial commit: The template-engine replaces the old liferay based frontend ([Open CoDE](https://gitlab.opencode.de/fitko/govdata/GovDataPortal), [GitHub](https://github.com/GovDataOfficial/GovDataPortal))
