# Third-party licences

Components the dashboard reaches end users through by URL reference. Each row gives where the
component is loaded from (read in this repository) and where its licence text comes from (read
upstream).

| Component | Loaded from | Version pinned in this repo | Licence | Copyright holder | Licence text |
|---|---|---|---|---|---|
| Lucide icons | `public/index.html:11` | no, floating `latest` tag | ISC; MIT for the Feather-derived icons listed in its LICENSE (see the per-icon table below) | Lucide Icons and Contributors, 2026 (ISC); Cole Bemis, 2013-present (MIT) | [LICENSE](https://unpkg.com/lucide@latest/LICENSE) |
| Inter | `public/index.html:10`, Google Fonts `css2` endpoint | no | SIL Open Font License 1.1 | The Inter Project Authors, 2020 | [OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt) |
| Outfit | `public/index.html:10`, Google Fonts `css2` endpoint | no | SIL Open Font License 1.1 | The Outfit Project Authors, 2021 | [OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/OFL.txt) |

Lucide package identity: [npm: lucide](https://www.npmjs.com/package/lucide). Its License section
carries one sentence, "Lucide is licensed under the ISC license. See LICENSE.", and neither grant
nor holder is in it; the licence text linked above is the package `LICENSE` file that sentence
refers to.

## Lucide

### Licence structure

The `LICENSE` file linked above is dual-licensed. It opens with "ISC License" over "Copyright (c)
2026 Lucide Icons and Contributors", then separates with a rule and a list headed "The following
Lucide icons are derived from the Feather project:", then states "The MIT License (MIT) (for the
icons listed above)" over "Copyright (c) 2013-present Cole Bemis".

The two conditions differ in wording and this file does not merge them:

- ISC: "provided that the above copyright notice and this permission notice appear in all copies."
- MIT: "The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software."

### Icons this dashboard renders, and the licence over each

Seven distinct icons. Names read from `public/index.html` (static `data-lucide` attributes) and
`public/script.js` (attributes injected at runtime). Licence per icon read from the Feather-derived
list in the `LICENSE` file linked above.

| Icon | Where | Licence | Copyright holder |
|---|---|---|---|
| `activity` | `public/index.html:17` | ISC | Lucide Icons and Contributors, 2026 |
| `refresh-cw` | `public/index.html:22` | ISC | Lucide Icons and Contributors, 2026 |
| `plus` | `public/index.html:25` | MIT (Feather-derived) | Cole Bemis, 2013-present |
| `copy` | `public/script.js:34` | ISC | Lucide Icons and Contributors, 2026 |
| `rotate-ccw` | `public/script.js:39` | ISC | Lucide Icons and Contributors, 2026 |
| `trash-2` | `public/script.js:42` | MIT (Feather-derived) | Cole Bemis, 2013-present |
| `check` | `public/script.js:125`, copy-URL success state | MIT (Feather-derived) | Cole Bemis, 2013-present |

`check` does not appear in the markup. `public/script.js:125` sets `data-lucide` to `check` on the
copy button after a successful clipboard write and restores the previous value two seconds later, so
the page ships it.

### Version

`public/index.html:11` references `@latest`, an unpinned floating tag. Which build is served is
decided at request time by whoever controls the `latest` tag on unpkg, not by this repository, so the
asset the page loads is not reproducible from anything committed here. Pinning the reference to an
exact version and a fixed file path is a code change to `public/index.html` and has not been made.

Undated external observation, not a version this repository pins: the npm page named above
displayed 1.52.0 when read for this file. Nothing here records a date for that reading and it may
differ at any later request.

## Inter and Outfit

Licence: SIL Open Font License 1.1, from the two upstream `OFL.txt` files linked above, which begin:

- Inter: "Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter)"
- Outfit: "Copyright 2021 The Outfit Project Authors (https://github.com/Outfitio/Outfit-Fonts)"

Both files state: "This Font Software is licensed under the SIL Open Font License, Version 1.1."
OFL condition 2 requires that each copy distributed with software contains the copyright notice and
the licence. This repository references both fonts through the Google Fonts CDN endpoint at
`public/index.html:10`; it neither hosts nor redistributes the font files. Whether a CDN reference
counts as distribution by this project is not established here. This file records the reference.

## Runtime dependencies

`express`, `cors`, and `body-parser` are server dependencies declared in `package.json:16-18`. They
are not loaded by `public/index.html` and are not redistributed to end users by this repository, so
they are outside the scope of this file. No licence facts for them are asserted here, as none were
verified for this record.

---

## The project's own licence

This project is proprietary and all rights are reserved. `LICENSE`, verbatim:

> Copyright (c) 2026 Babariya Meet. All rights reserved.
>
> No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, create derivative works from, reference, reverse engineer for replication, or otherwise exploit this project, in whole or in part, for any purpose without prior written permission from the copyright holder.

`package.json` declares `"license": "UNLICENSED"`. That is npm's marker for proprietary software
that grants no rights, so the manifest and `LICENSE` now state the same position. The manifest
carries no SPDX identifier and neither does `LICENSE`, because there is no grant to express as one.

`remotion-video/package.json` declares no `license` field. Whether that subproject is a private
internal subproject or a publishable package is an owner decision.
