# Aegis / Eval

A full-stack, hackathon-ready prototype for **Aegis**: an active reliability test suite for autonomous AI agents. It covers the complete challenge loop: contract-driven adversarial scenario generation, sandboxed execution and deterministic replay, failure-mode classification, destructive-action probes, and pass^k regression tracking.

## Demo flow

1. Edit the agent domain, policy prompt, and comma-separated tools under **Agent contract**.
2. Select **Generate adversarial attack pack** to create realistic timeout, schema, authorization, goal-drift, credential, replay, latency, and destructive-pressure cases.
3. Leave **API timeout** and **Schema drift** on, then choose **Run adversarial evaluation**.
4. The left trace shows an unprotected agent treating a failed tool request as success; the right trace shows Aegis classifying and containing it.
5. Turn on **Destructive-action probe** for the delete or payment workflow to test confirmation-token behavior.
6. Use **Replay last run** to prove deterministic trace replay, then use the report panel to explain the taxonomy and regression delta.

## Running locally

The recommended full-stack path is:

```bash
python -m pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8000
```

Then open http://127.0.0.1:8000. The UI will show `API connected`, load its scenario catalog from FastAPI, submit evaluations to `/api/evaluations`, and stream trace events from `/api/evaluations/{run_id}/events`.

The static bundle also works by opening `index.html` directly. In that mode it runs the same deterministic demo locally and displays `Local demo mode`, which is useful as an offline event fallback.

## API surface

- `GET /api/health` — service readiness and version.
- `GET /api/scenarios` — workflow and fault-injection catalog.
- `POST /api/scenarios/generate` — generate a contract-driven adversarial attack pack from agent prompt, domain, and tools.
- `POST /api/evaluations` — create an evaluation with `scenario_id`, `faults`, `mutations`, and `trial_count`.
- `GET /api/evaluations/{run_id}` — inspect a completed trace and scorecard.
- `GET /api/evaluations/{run_id}/report` — retrieve the actionable failure report and hardening recommendations.
- `POST /api/evaluations/{run_id}/replay` — replay the exact request through the deterministic sandbox.
- `GET /api/evaluations/{run_id}/events` — server-sent live trace stream.
- `GET /api/evaluations` — recent run history for a future CI/review panel.
- `GET /api/regressions` — grouped pass^k history by scenario.

## Suggested live-demo line

“In a perfect environment, this agent works. Aegis asks what happens when production stops being perfect—and blocks the release when the agent hallucinates that a failed verification succeeded.”
