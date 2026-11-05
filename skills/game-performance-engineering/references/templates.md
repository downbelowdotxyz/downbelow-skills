# Copyable performance templates

Fill applicable fields. Use `unknown`, `not measured`, or `not applicable` explicitly. Replace provisional budgets after measurement. No universal device limits are supplied.

## Performance contract

```yaml
contract_version: 1
target_tier: null
device_cpu_gpu_ram: null
os_driver_backend: null
build_and_content_revision: null
resolution_quality_refresh: null
fps_target: null
simulation_hz: null
server_tick_hz: null
scenario_route_seed_input: null
entity_and_client_counts: null
warmup_seconds: null
capture_seconds: null
repetitions: null
budgets:
  presented_frame_p95_ms: null
  presented_frame_p99_ms: null
  hitch_threshold_ms: null
  hitches_allowed_per_minute: null
  cpu_critical_path_ms: null
  gpu_frame_ms: null
  tick_p99_ms: null
  deadline_miss_fraction: null
  cpu_resident_peak_mib: null
  gpu_resident_peak_mib: null
  cold_to_playable_seconds: null
  transition_p95_ms: null
  upload_per_frame_ms: null
  bytes_per_second_per_client: null
  correction_p95_world_units: null
required_quality_and_behavior: []
measurement_gaps: []
```

## Experiment report

```text
Symptom and player/server impact:
Baseline build, content, target and scenario:
Capture method, timer meanings, percentile method and sample counts:
Evidence and limiting dependency:
Hypothesis and expected metric change:
Change and rollback:
Required behavior/quality and tradeoffs:

Metric | Baseline per-run values | Candidate per-run values | Budget | Decision

Warmup, duration, repetitions and cache state:
Correctness and visual/motion checks:
Memory, loading, bandwidth and latency side effects:
Raw evidence and exact reproduction steps:
Remaining uncertainty and next experiment:
```

## Benchmark scenario

```text
ID and purpose:
Device/tier and required build settings:
Content/route/input/seed version:
Setup and start/end markers:
Warmup and capture duration:
Cold/warm cache procedure:
Load and network conditions:
Metrics, units, sample definition and aggregation:
Absolute budgets and regression/noise rule:
Correctness assertions:
Artifact location and run status:
```
