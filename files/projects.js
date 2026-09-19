// Data for the home page. Loaded with a <script> tag so it works when index.html is opened
// straight from disk (file://), where browsers block fetch() of local JSON.
window.SITE_PROJECTS = [
  {
    "id": "idoc",
    "title": "Illinois Department of Corrections",
    "short": "IDOC",
    "subtitle": "Prison population, parole (MSR) and racial disparity",
    "abstract": "Scrapes the ~40 Excel files IDOC publishes for its prison population, admission, exit and parole data sets, loads them into DuckDB, and turns them into public datasets, two Shiny dashboards and a disparity analysis.",
    "markdown": "markdown/idoc.md",
    "tags": [
      "corrections",
      "dashboard",
      "pipeline"
    ],
    "repos": [
      {
        "label": "Pipeline (idoc_con)",
        "url": "https://github.com/jackmonaghan97/idoc_con"
      },
      {
        "label": "Census denominators",
        "url": "https://github.com/jackmonaghan97/cesnsus_illinois_county_population"
      }
    ],
    "products": [
      {
        "id": "prison_dashboard",
        "title": "Illinois Prisons",
        "type": "Dashboard",
        "description": "Population and incarceration rates by sentencing county, admissions and exits, recidivism, and expenses per inmate.",
        "url": "https://prison-dashboard.onrender.com/",
        "github": "https://github.com/jackmonaghan97/prison_dashboard"
      },
      {
        "id": "msr_dashboard",
        "title": "Illinois MSR (Parole)",
        "type": "Dashboard",
        "description": "The mandatory supervised release population by county of residence, releases to MSR, returns to prison, and caseload profile.",
        "url": "https://msr-dashboard.onrender.com/",
        "github": null
      },
      {
        "id": "disparity_project",
        "title": "Incarceration Disparity",
        "type": "Analysis",
        "description": "Incarceration rates and Black : White disparity by race, sex and age, comparing Cook County, other urban counties and the rest of Illinois.",
        "url": null,
        "github": "https://github.com/jackmonaghan97/disparity_project"
      }
    ]
  },
  {
    "id": "aoic",
    "title": "Administrative Office of the Illinois Courts",
    "short": "AOIC",
    "subtitle": "Adult probation legacy statistics, 2011 to present",
    "abstract": "Synthesises the ~900 Excel sheets the AOIC publishes per circuit and year into a single DuckDB table, Justice Counts exports and a dashboard of Illinois adult probation.",
    "markdown": "markdown/aoic_probation.md",
    "tags": [
      "probation",
      "dashboard",
      "pipeline"
    ],
    "repos": [
      {
        "label": "Pipeline (legacy_statistics)",
        "url": "https://github.com/jackmonaghan97/legacy_statistics"
      }
    ],
    "products": [
      {
        "id": "probation_dashboard",
        "title": "Illinois Adult Probation",
        "type": "Dashboard",
        "description": "Active caseload and rate per 100k adults, admissions, discharges, violations and revocations, and intake demographics with disparity.",
        "url": "https://probation-dashboard.onrender.com/",
        "github": "https://github.com/jackmonaghan97/probation_dashboard"
      }
    ]
  }
];
