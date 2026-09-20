// All site content lives here. It is loaded with a <script> tag (not fetch) so the pages
// also work when opened straight from disk (file://), where browsers block fetch().
//
//   SITE_PROJECTS   the two project write-ups (project.html?id=<id>) and their assets
//   SITE_DASHBOARDS the dashboard tiles on the home page (derived from the projects)

window.SITE_PROJECTS = [
  {
    id: "idoc",
    title: "Illinois Department of Corrections",
    short: "IDOC",
    subtitle: "Prison population, admissions and exits, parole (MSR), spending and disparity",
    abstract:
      "Scrapes the ~40 Excel files IDOC publishes for its prison population, admission, exit and " +
      "parole data sets, loads them into DuckDB, and turns them into two Shiny dashboards and a " +
      "racial-disparity analysis.",
    markdown: "markdown/idoc.md",
    tags: ["corrections", "pipeline", "dashboard"],
    repos: [
      { label: "Pipeline (idoc_con)", url: "https://github.com/jackmonaghan97/idoc_con" },
      { label: "Census denominators", url: "https://github.com/jackmonaghan97/cesnsus_illinois_county_population" },
      { label: "Disparity analysis", url: "https://github.com/jackmonaghan97/disparity_project" }
    ],
    products: [
      {
        id: "prison-dashboard",
        title: "Illinois Prisons",
        type: "Dashboard",
        description: "People in custody and incarceration rates by sentencing county, admissions and exits, recidivism, and expenses per inmate.",
        url: "https://prison-dashboard.onrender.com",
        github: "https://github.com/jackmonaghan97/prison_dashboard"
      },
      {
        id: "msr-dashboard",
        title: "Illinois MSR (Parole)",
        type: "Dashboard",
        description: "The mandatory supervised release population by county of residence, releases from prison to MSR, and the caseload profile.",
        url: "https://msr-dashboard.onrender.com",
        github: "https://github.com/jackmonaghan97/msr_dashboard"
      }
    ]
  },
  {
    id: "aoic",
    title: "Administrative Office of the Illinois Courts",
    short: "AOIC",
    subtitle: "Adult and juvenile probation legacy statistics, 2011 to present",
    abstract:
      "Synthesises the roughly 3,800 monthly-report sheets the AOIC publishes per circuit and year " +
      "into two DuckDB tables (adult and juvenile), Justice Counts exports, and dashboards of Illinois " +
      "adult and juvenile probation.",
    markdown: "markdown/aoic.md",
    tags: ["probation", "juvenile", "pipeline", "dashboard"],
    repos: [
      { label: "Pipeline (legacy_statistics)", url: "https://github.com/jackmonaghan97/legacy_statistics" }
    ],
    products: [
      {
        id: "probation-dashboard",
        title: "Illinois Adult Probation",
        type: "Dashboard",
        description: "Active caseload and rate per 100k adults, admissions, discharges, violations and revocations, and intake demographics with disparity.",
        url: "https://probation-dashboard.onrender.com",
        github: "https://github.com/jackmonaghan97/probation_dashboard"
      },
      {
        id: "juvenile-dashboard",
        title: "Illinois Juvenile Probation",
        type: "Dashboard",
        description: "Active juvenile caseload and rate per 100k youth aged 10-17, petitions, admissions and discharges, DJJ commitments, and intake demographics.",
        url: "https://juvenile-dashboard.onrender.com",
        github: "https://github.com/jackmonaghan97/juvenile_dashboard"
      }
    ]
  }
];

// one tile per dashboard, in the order they appear on the home page
window.SITE_DASHBOARDS = window.SITE_PROJECTS.flatMap(p =>
  p.products.filter(x => x.type === "Dashboard").map(x => ({ ...x, project: p.short, projectId: p.id }))
);
