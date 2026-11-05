# Copyable evaluation and provenance templates

Adapt these to existing project formats. Null values are unfilled fields, not successful checks. Create a record per asset/component when a pack contains different grants. Do not approve a mixed pack with one undifferentiated license field.

## Candidate scorecard

```text
Need, target runtime/device and distribution:
Candidate and official source URL:
Classification: complete world / demo scene / modular kit / tileset / prop / material / data
Exact version and checked date:
License status and evidence URL:
Hard blockers: rights / format / dependencies / device support

Criterion | Evidence | Score (0-3 or unknown) | Integration cost/risk
Visual and scale fit:
Playable layout and interaction fit:
Runtime/import support:
Editable source and dependency completeness:
Measured performance and memory:
Maintenance and reproducibility:
License suitability for stated use:

Decision: adopt / prototype / reject / unresolved
Reason, alternatives, and next verification:
```

Use scores to compare viable candidates, not to override hard blockers. Unknown performance remains unknown until a representative import is measured.

## Asset/component manifest

```yaml
manifest_version: 1
asset_id: null
classification: null
title: null
creators: []
rights_holders_as_supplied: []
upstream:
  asset_page_url: null
  repository_url: null
  download_url: null
  version_tag_commit: null
  acquired_on: null
  archive_sha256: null
  local_original_path: null
  included_file_inventory_path: null
license:
  status: unverified  # unverified | blocked | verified-for-use
  identifier_or_expression: null
  chosen_alternative_if_allowed: null
  verified_on: null
  reviewer: null
  evidence:
    - source_url: null
      local_snapshot_or_license_path: null
      source_revision_or_capture_date: null
      applies_to_files: []
  excluded_or_uncovered_files: []
  obligations: []
  attribution_text: null
  changed_files_and_notices: []
  required_source_or_offer_artifacts: []
  compatibility_notes: null
  unresolved_questions: []
intended_use:
  commercial: null
  modified: null
  embedded_game_distribution: null
  public_source_repository: null
  raw_asset_or_template_distribution: null
  platforms_channels_and_drm: []
dependencies: []  # Reference other component IDs with their own records.
derived_outputs:
  - path: null
    sha256: null
    source_component_ids: []
    transform_recipe_path: null
technical:
  formats_and_required_extensions: []
  engine_loader_version: null
  units_axes_or_tile_scale: null
  collision_navigation_animation: null
  measured_target_and_scenario: null
  load_ms: null
  frame_p95_ms: null
  frame_p99_ms: null
  resident_peak_mib: null
  measurement_artifact_path: null
release:
  shipped_paths: []
  credit_notice_license_paths: []
  required_source_delivery_paths_or_urls: []
  inventory_checked_on: null
```

## Import recipe

```text
Input asset/component IDs, hashes and source locations:
Tool/engine/exporter/loader versions:
Dependency acquisition and verification:
Units, axes, scale, pivots or tile conventions:
Material/channel/color-space mappings:
Collision, navigation, animation and gameplay mapping:
Conversion, simplification, LOD and compression settings:
Cell/shared-resource layout and output paths:
Source-to-derived file/provenance mapping:
Reproduction steps and expected outputs:
Visual, behavior, load/unload and device-budget results:
Notices/credits/source artifacts and unresolved items:
```

## Attribution record

```text
Title and component ID:
Creator/rights-holder credit as supplied:
Original source URL and version:
Exact license name/version and URL:
Supplied copyright/notice/disclaimer text to preserve:
Changes and modifying party, where required:
Placement in game, repository and distribution:
Related source/offer artifacts where applicable:
```

Attribution wording and placement follow the actual grant; this record is not a universal legal notice. Optional courtesy credit should be distinguishable from mandatory obligations.
