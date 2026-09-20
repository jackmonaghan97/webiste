## Overview

The Illinois Department of Corrections (IDOC) publishes its statistical data as Excel files on its *Reports and Statistics* pages: a stock-population file for each quarterly snapshot, and yearly files of prison admissions, prison exits and the parole (mandatory supervised release, MSR) population. Around 40 files, each one a person-level extract with a slightly different layout than the last.

This project scrapes those pages, cleans and appends the files into four DuckDB tables, publishes them as open CSV datasets, and builds two Shiny dashboards on top: one for the prisons and one for MSR. A separate analysis measures the racial disparity in incarceration across the state.

## The dashboards

**Illinois Prisons** — four pages:

- *Population & rates*: people in custody by sentencing county, the incarceration rate per 100,000 residents of the same sex, race and age group, the Black : White disparity ratio over time, and a county map with a sortable table.
- *Admissions & exits*: flows per month, quarter or year, admissions by type and exits by reason.
- *Recidivism*: for each release cohort, the share back in IDOC within one, two or three years, split by the type of the first return, with cumulative return curves by race.
- *Expenses*: IDOC spending from the Illinois Comptroller by fiscal year and category, and the cost per inmate against the average headcount.

**Illinois MSR (Parole)** — three pages: the MSR population by county of residence with rates and disparity (on a log color scale, because one county hosts a treatment and detention facility), admissions to MSR by release type, sex, race, age or offense with the releasing institutions, and a caseload profile of sentence class and length, time on MSR and time to projected discharge.

Both dashboards are built to the same accessibility conventions: alternative text on every chart, high-contrast map fills with a black state outline, stacked charts that read without color, and distinct markers on every line.

## The datasets

The four tables are published as plain CSV on the [datasets page](datasets.html) — each link downloads the whole file, from 34 MB to 291 MB.

| Data set | What a row is | Coverage |
|---|---|---|
| Prison population | one person in custody on the snapshot date | quarterly snapshots, 2011 – present |
| Prison admissions | one admission (court, new-sentence violator, technical violator, …) | 2018 – present |
| Prison exits | one exit, with the reason (MSR, expiration of sentence, …) and releasing institution | 2014 – present |
| Parole population | one person on MSR on the snapshot date, with county of residence | semi-annual 2016–17, quarterly since 2018 |

Every row carries sex, race, date of birth, the holding offense, sentencing county and the relevant dates, so the tables support rates by demographic group as well as flows over time.

## The pipeline

`idoc_con` does the collection:

1. **Scrape.** Read each data-set page, find every workbook link, download anything new.
2. **Normalise.** IDOC's column names and layouts vary between years (and one file is a duplicate under a different name); a name map and a skip list reconcile them into one schema per data set. Dates are parsed, offense descriptions are mapped to an offense class (person, property, drug, public order) through a public look-up table.
3. **Load and publish.** The four tables are written to DuckDB and, as CSV, to a Cloudflare R2 bucket served from `jack-monaghan.com/datasets` by a small Worker — the [datasets](datasets.html) on this site.

Population denominators come from a second small pipeline, `cesnsus_illinois_county_population`, which loads the American Community Survey 5-year county population by sex, age and race/ethnicity for every vintage since 2009 and checks each year's total against the Census Bureau's own.

## Disparity analysis

`disparity_project` joins the year-end prison population to the ACS and computes incarceration rates and Black : White ratios by race, sex and age group, comparing Cook County, the other urban counties and the rest of Illinois.

## Sources

- IDOC [prison population](https://idoc.illinois.gov/reportsandstatistics/prison-population-data-sets.html), [admissions](https://idoc.illinois.gov/reportsandstatistics/prison-admission-data-sets.html), [exits](https://idoc.illinois.gov/reportsandstatistics/prison-exit-data-sets.html) and [parole population](https://idoc.illinois.gov/reportsandstatistics/parole-population-data-sets.html) data sets.
- U.S. Census Bureau, American Community Survey 5-year estimates (tables B01001A–I).
- Illinois Office of the Comptroller, agency expenditures by object code.
