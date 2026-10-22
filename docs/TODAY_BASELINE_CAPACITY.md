# Today baseline and service-capacity assessment

Prepared 22 October 2026. Status: draft planning aid for T03. No local baseline, supplier commitment, or pilot is established. T03 depends on [T01 selection](TODAY_PILOT_SELECTION.md); this template does not close that dependency. Align the assessment with the service definitions in the [coverage worksheet](TODAY_COVERAGE_WORKSHEET.md) and the [economic transition backlog](TODAY_ECONOMIC_TRANSITION.md).

## Define the observation before collecting data

Record the candidate reference, assessment version, geographic boundary, observation period, population definition, service scope, analyst, operator reviewer, resident reviewer, and next review date. Roles remain unassigned until accepted. Describe seasonal variation and people omitted by the available sources. Distinguish people, households, visits, and service units; do not combine them without a documented conversion.

Use public or permissioned aggregate sources first. This worksheet does not authorize collecting household records. Any new survey or sensitive linkage requires a separately approved purpose, access controls, retention, and privacy review under T05. Research participation must not determine essential-service eligibility.

## Evidence register

Every value needs an evidence reference. Maintain the following fields for each source:

| Field | Required content |
| --- | --- |
| Identification | Source ID, publisher or consenting organization, title, accessible link or controlled record reference, version. |
| Time | Publication date, observation dates, retrieval date, next refresh date, and reason for refresh frequency. |
| Coverage | Geography, population, exclusions, sample or administrative coverage, and whether the source counts people or transactions. |
| Meaning | Definition, unit, measurement method, uncertainty, known bias, and comparability limits. |
| Status | Observed, estimated, scenario assumption, unknown, not applicable, or withheld for privacy. Zero is a measured value, never a missing-data substitute. |
| Stewardship | Permitted use, publication restrictions, responsible owner, reviewer, correction record, and approval for release. |

Keep original values and conversion steps traceable. Record conflicting sources with reasons for the chosen interpretation. Do not silently average incompatible definitions or treat an old observation as current. Store changes as dated revisions.

## Baseline measures

For every measure record a value or explicit missing-data status, numerator, denominator where applicable, unit, geography, period, source IDs, method, uncertainty, owner, and refresh date. Select definitions with residents and operators before comparing outcomes.

| Measure | Definition to settle locally |
| --- | --- |
| Unmet need | People or households lacking the defined service standard during the stated period. Explain how need is observed and how people outside existing services are represented. |
| Access | Eligible population, enrollment, attempted access, refusals, and successful receipt. These are separate counts; existing enrollment does not measure everyone in need. |
| Reliability | Scheduled service obligations and fulfilled obligations, interruption duration, waiting time, and quality failures. Define an obligation and the treatment of partial delivery. |
| Household burden | Out-of-pocket costs, travel, waiting, and administrative effort. State currency, price date, and any method used to value time. |
| Delivery cost | Operating, administration, maintenance, capital, and transition costs, with payer and accounting basis. Keep cash and noncash costs separate for T04. |
| Workforce | Staffing, hours, vacancies, training needs, pay and working conditions using safe aggregates. Distinguish existing staffing from proposed hires. |
| Environmental burden | Locally relevant energy, emissions, water, materials, land impacts, and waste. State boundaries and imported impacts omitted; avoid claiming improvement from intensity alone. |
| Exclusion and complaints | Mistaken refusals, corrections, unresolved complaints, and resolution time, with definitions and ascertainment limits. Low reporting may mean inaccessible complaints. |

Report variation within the service area when safe. Set subgroup definitions and disclosure controls with the data steward; small counts, repeated releases, and linked tables can reveal identities. Record withheld results and their reason. Do not publish a fixed small-cell threshold as a guarantee of anonymity. Missing or suppressed groups remain limitations, not evidence of equal outcomes.

## Capacity map

Create one record per service, delivery area, and period. A map may be an accessible table; precise household locations are unnecessary. Record:

- Service unit, required quality, delivery window, population served, existing obligations, and proposed additional obligations.
- Operator and evidence of consent to be named; actual output, usable stocks, contracted inbound supply, outbound commitments, losses, and protected reserves.
- Staff, equipment, premises, transport, storage, energy, network, and accessibility constraints; the limiting step and realistic lead time to expand it.
- Supplier share, shared upstream dependencies, alternative providers, switching time, and evidence that any backup has spare capacity.
- Contract or commitment status, expiry, conditions, review date, operator confirmation, and independent check.

For a consistent unit, area, and period, calculate:

Available capacity = deliverable output + usable opening stocks + confirmed inbound supply - outbound commitments - losses - required closing reserves.

Remaining capacity = available capacity - existing local obligations.

Additional-service gap = maximum of zero and proposed additional obligations minus remaining capacity.

Also report any shortfall in existing obligations separately. Do not use negative remaining capacity as evidence that existing residents can be displaced. Explain stock timing, replenishment, and any overlap between output and inbound supply. Transfers within the same system must not create duplicate capacity. Stock is finite and cannot be counted as recurring output each period.

Nominal capacity, planned construction, unsigned offers, and unconstrained theoretical output belong in scenarios, not confirmed supply. Quality, travel, opening hours, affordability, and accessibility may make physically present supply unusable. Test daily or peak periods when annual totals hide a shortage. Different resources cannot be added together without a justified conversion and the required equipment and logistics.

## Worked example: fictional planning arithmetic

All numbers here are invented service units for one period, not local evidence or a delivery target.

| Item | Units |
| --- | ---: |
| Deliverable output | 100 |
| Usable opening stocks | 20 |
| Confirmed inbound supply | 10 |
| Outbound commitments | 5 |
| Losses | 5 |
| Required closing reserves | 10 |
| Available capacity | 110 |
| Existing local obligations | 90 |
| Remaining capacity | 20 |
| Proposed additional obligations | 30 |
| Additional-service gap | 10 |

The additional offer cannot be described as fully supplied. A planner must resolve the gap and check delivery timing, quality, access, and funding; buying power alone does not remove it.

## Review, gaps, and handoff

Maintain a gap register with the missing evidence or constraint, affected decision, severity and rationale, owner, proposed action, due date, cost, and status. Use unknown where evidence is absent; do not invent local measurements to complete the table.

Before T03 closes, analysts and operators must reconcile units and periods, review source freshness, check duplicate supply claims, document unmet needs and missing groups, and publish a privacy-reviewed baseline and capacity assessment after T01 is complete. Include resident review, uncertainty, unresolved constraints, and an independent challenge record. Material unknowns affecting delivery must remain visible and prevent an unsupported readiness claim.

Pass costs and expansion lead times to T04, data restrictions to T05, baseline definitions and measurement limitations to T06, and supplier loss, peak demand, and outage cases to T07. T06 must set the evaluation design and thresholds before trial results are known. This assessment does not authorize enrollment, procurement, or T08 launch.
