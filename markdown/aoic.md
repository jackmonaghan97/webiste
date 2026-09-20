## Overview

Probation is the largest component of the Illinois penalty system. The Administrative Office of the Illinois Courts (AOIC) supervises between 90,000 and 120,000 adults at any given time, plus a few thousand minors under juvenile probation. That population dwarfs the prison system, which currently holds about 30,000 people in custody and supervises roughly 14,000 on mandatory supervised release (MSR).

To document probation, the AOIC publishes a monthly report for every county probation department. This project synthesises those reports — roughly 420 Excel workbooks and 3,800 individual sheets, 2011 to the present — into two clean tables, standard exports and two dashboards: one for adult probation and one for juvenile probation.

## The dashboards

Two Python Shiny dashboards read the tables, each with three pages:

- **Population & rate** — the active caseload, its rate per 100,000 residents (adults 18+, or youth aged 10–17 for the juvenile dashboard), a county map with non-reporting counties hatched, and the caseload over time by offense or case type, supervision level or caseload type.
- **Admissions, discharges & violations** — cases entering and leaving supervision, discharges by reason and outcome (successful, unsuccessful, other), violation reports and the revocation rate on court actions; the juvenile dashboard adds commitments to DJJ.
- **Intake demographics & disparities** — who enters probation by race/ethnicity, sex and age, intake rates per 100,000 with the Black : White disparity ratio over time, and the intakes' employment, schooling and school enrollment set against the general population from the American Community Survey.

Both dashboards follow the same accessibility conventions as the IDOC dashboards: every chart carries alternative text, maps use high-contrast fills with a black state outline, stacked charts are readable without color, and lines carry distinct markers.

## The data

Probation is a versatile sentencing option in lieu of incarceration. While prison can upend a person's life by severing social ties, probation lets people keep their community connections and employment, and lets the courts tailor a sentence: drug treatment, mental-health counseling or other rehabilitative programs can be made conditions of supervision. Supervision itself takes many forms, from **electronic monitoring** and **home confinement** through **active supervision** (what most people picture as probation) to **administrative supervision**, where virtual correspondence is enough.

The data the AOIC publishes are called the *Legacy Statistics*: a decentralized patchwork of manual reporting from 102 county departments. Every year, each of the 25 judicial circuits (Cook County files separately) publishes a Google Sheets workbook with one sheet per county court, each sheet a fixed 300-row monthly template: intakes, demographics of intakes, admissions to the active caseload, discharges by reason, the caseload classified by offense type and supervision level, violations and court actions, and more. The juvenile departments file a parallel template of their own — petitions filed, formal versus informal handling, commitments to the Department of Juvenile Justice.

The AOIC is phasing the Legacy Statistics out in favor of a real-time data-integration system, but as of 2026 the Excel workbooks are still being published and remain the only longitudinal source on Illinois probation. This project is the bridge between the two eras.

## The pipeline

`legacy_statistics` is a Python pipeline in three steps:

1. **Retrieve.** Scrape each year's page on the AOIC aggregate-data site, find every circuit workbook and export it as `.xlsx` through Google's public endpoint. Workbooks are cached on disk and re-fetched only on request.
2. **Extract.** Every sheet follows the same template, so each row is labelled by its position: a *map* file carries the metric, breakdown and section for every template row, and row *n* of a sheet gets row *n*'s labels. Because that is positional, every sheet's labels are compared with the template's and a sheet that drifts is skipped and logged rather than loaded wrong. There is one map for the adult form and one for the juvenile form.
3. **Load.** The long tables (`aoic_legacy_probation`, `aoic_legacy_juvenile`: circuit, county, year, month, metric, breakdown, section, value — about 4 million rows each) go into DuckDB, with CSV copies alongside. From there, the adult table feeds the Bureau of Justice Assistance / Justice Counts exports and the Tableau extracts the ICJIA reports on.

Coverage is tracked explicitly: the dashboards count how many departments filed a sheet each year and reported a caseload each month, hide the trailing months in which fewer than 90% of departments have reported, and mark the years still being reported.

## Sources

- [AOIC aggregate data](https://sites.google.com/probation.illinoiscourts.gov/aggregatedata/data-home) — the circuit workbooks, 2011 to the present.
- U.S. Census Bureau, American Community Survey 5-year estimates — county population by age, sex and race/ethnicity for the rates, and the employment and educational-attainment comparisons.
