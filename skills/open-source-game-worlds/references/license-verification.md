# License-verification protocol

Use for every selected asset or world, before integration and again when its source version, dependencies, transformation, or distribution scope changes. This protocol records evidence and obligations; it does not guarantee that an uploader owns all rights.

## 1. Define the actual use

Record commercial/noncommercial use, modifications, embedded game distribution, public source repositories, raw-asset redistribution, downloadable templates/editors, platforms/stores, and any DRM. A grant allowing a compiled game may prohibit an asset library. A private prototype's record is not approval for a public release.

## 2. Pin identity and provenance

Record creator and rights-holder names as supplied, original asset page, official repository, exact release/tag/commit or immutable download ID, acquisition date, URL, archive SHA-256, and inventory of included files. A checksum identifies bytes; it does not prove authorship or permission.

For mirrors, establish a link back to the original grant for the same version. Inspect submodules, Git LFS objects, external URLs, dependencies, and generated content inputs. A top-level license may cover only scripts while artwork has separate terms.

## 3. Collect scoped evidence

Read the asset page, included license files, per-directory/per-file notices, credits, and relevant upstream terms. Preserve license texts and dated local copies of the granting statements, with source URLs and applicable file globs. Capture page/release revision where available. Keep snapshots within permitted access terms.

Inventory meshes, textures, materials, tilemaps/layouts, animations, sounds/music, fonts, scripts, shaders, database/geographic content, and embedded third-party components. Record uncovered files as unresolved. Scan for notices automatically if useful, then inspect exceptions manually. GitHub's detected license is a discovery hint.

If evidence conflicts, is missing, or does not cover the exact download, set `blocked` or `unverified`. Do not resolve conflicts by picking the most permissive statement. Record what evidence would resolve the issue and proceed with other candidates. Preserve historical grants without assuming they apply to newer bytes.

## 4. Determine obligations for each component

Use exact license names and versions. When a standard identifier exists, use the [SPDX license list](https://spdx.org/licenses/) and [expression guidance](https://spdx.dev/learn/handling-license-info/). `A OR B` means a choice; `A AND B` means both apply. Choose an alternative only when the actual grant permits it. Use a documented `LicenseRef-...` for custom terms; do not invent an SPDX identifier or a compatibility claim.

| Grant type | Questions to resolve for this use |
| --- | --- |
| [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | Is the grant from an authorized source and does it cover every component? Keep provenance even without mandatory attribution. Trademark, privacy, publicity, and patent rights are not automatically cleared. |
| [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Preserve supplied credit/copyright/license information as required, link the license, indicate changes, and avoid additional restrictions prohibited by the license. Plan appropriate placement in the actual distribution. |
| [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Resolve attribution plus adaptation/share-alike and compatible-license requirements. Distinguish an adaptation from a collection. Do not assume all game code must become share-alike, or that separate files always avoid it. Check the exact version. |
| MIT/BSD/Apache and other code licenses | Read the exact grant, notice/patent requirements, exceptions, and applicable file scope. Code licensing does not automatically establish artwork rights. |
| GPL/LGPL or other copyleft terms | Analyze the actual code/content integration, linking or adaptation, modification, and distribution. Record required notices, corresponding source and other applicable obligations. Do not reduce the analysis to an engine-wide license badge. |
| ODbL/database terms | Separate data, derived databases, produced works and attribution. Follow the [OSM copyright and policy links](https://www.openstreetmap.org/copyright) and applicable legal text for geographic inputs. |
| NC, ND, editorial-only, engine-only, no-redistribution, custom grants | These can fail open-content or intended-use requirements. Do not list them as freely reusable open content. Offer separately only if relevant and permitted by the user's constraints. |

Read actual legal text and official compatibility guidance for unresolved combinations. Similar names and different versions are not interchangeable. If a material distribution question remains unresolved, identify that narrow issue for rights-holder or qualified review rather than declaring legal clearance.

## 5. Check noncopyright constraints

Check recognizable brands/logos, identifiable people, sensitive locations, and asserted third-party ownership where relevant to the selected asset. Remove or replace unsupported content when feasible. Treat website/API access rules, quotas, and service attribution separately from downloaded-asset licenses. Do not bypass access restrictions to obtain content.

## 6. Preserve obligations through conversion and composition

Track originals and derivatives, authors, transformation steps, modified files, and notices. Format conversion, decimation, texture atlasing, merging, and fictionalizing do not remove license duties. An atlas or merged scene must retain provenance for all contributing components. Keep separately scoped files/notices where useful, without assuming separation decides legal compatibility.

Produce the attribution text and distribution files required by the verified grants. Include modified-source delivery or offers only when applicable, and confirm that the release actually contains or supplies what is required. Do not fabricate a license grant for new composite work.

## 7. Record a scoped decision and release gate

Use [templates.md](templates.md) for the manifest. `verified-for-use` requires evidence covering included files, a pinned identity, intended-use compatibility reviewed, and an actionable obligation list. Record unresolved rights risks rather than claiming guaranteed clearance.

Before release, compare the shipped inventory with the manifest, block unexplained/unverified files, check generated derivatives and dependencies, verify credits/notices/source artifacts, and re-evaluate changed distribution channels. A policy page checked on a date is not a completed per-asset verification.
