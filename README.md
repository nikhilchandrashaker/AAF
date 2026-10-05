# Demand Without a Runway: Why the Alliance of American Football Failed

A research package on why the AAF suspended operations after eight weeks and filed Chapter 7 in 2019, despite a strong television debut.

## What is in this folder

| File | What it is |
|---|---|
| `AAF_Why_It_Failed_Research_Paper.pdf` | The 7-page paper: abstract, data and corrections, results, mechanism, competing explanations, limitations, conclusion, appendices. Replaces the earlier draft. |
| `AAF_failure_research_dataset_v2_corrected.xlsx` | The dataset with fixes, plus new sheets: `AAF_Weekly_TV`, `AAF_Bankruptcy_Finance`, `Corrections_Log`, `Evidence_Scoring`. |
| `AAF_Explorer.jsx` | Interactive companion (React): audience decay, attendance, teams, a runway slider, a clickable mechanism diagram, and a re-codable evidence rubric. |
| `figures/` | The eight paper figures as PNGs, plus the scripts that produce them. |

## Thesis in one paragraph

The AAF did not fail because nobody cared. Demand was real but front-loaded: the week-2 audience fell 69%. The decisive problem was financial. Reported year-to-date revenue of $11.8M covered about one week of a reported burn near $10M per week, the lead investor largely stopped funding after the first games, and the replacement owner paid about $70M of a publicly announced $250M. No audited financials are public, and the trustee's claim that the shutdown was a choice is litigated, not adjudicated.

## Figures

![Figure 1. Audience decay: AAF weekly audience and week-2 retention vs other spring-league launches.](figures/f1_audience.png)
*Figure 1. Audience decay: AAF weekly audience and week-2 retention vs other spring-league launches.*

![Figure 2. Announced attendance by week.](figures/f2_attendance.png)
*Figure 2. Announced attendance by week.*

![Figure 3. Competitive balance: points scored and allowed per game.](figures/f3_teams.png)
*Figure 3. Competitive balance: points scored and allowed per game.*

![Figure 4. Weeks of operations covered by each pool of money at a reported $10M weekly burn.](figures/f4_runway.png)
*Figure 4. Weeks of operations covered by each pool of money at a reported $10M weekly burn.*

![Figure 5. Chapter 7 snapshot (April 17, 2019).](figures/f5_filing.png)
*Figure 5. Chapter 7 snapshot (April 17, 2019).*

![Figure 6. Timeline from funding to bankruptcy (schematic).](figures/f6_timeline.png)
*Figure 6. Timeline from funding to bankruptcy (schematic).*

![Figure 7. Proposed failure mechanism.](figures/f7_pathway.png)
*Figure 7. Proposed failure mechanism.*

![Figure 8. Rubric-based evidence scores.](figures/f8_evidence.png)
*Figure 8. Rubric-based evidence scores.*

## What changed from the earlier paper

1. The headline 2.913M audience is a fast-national estimate; the final CBS figure was 3.25M and the week-1 all-game average was 1.95M. The old chart compared a premiere with the XFL 2023 season average. It is replaced by a week-2 retention comparison.
2. The $250M "commitment" is no longer an open question: the term sheet reportedly said $70M and about $70M was paid.
3. New evidence: bankruptcy figures ($48.3M liabilities, $11.3M assets, about $0.5M cash), $11.8M revenue, about $10M weekly loss, and a runway-in-weeks analysis.
4. The leaders sheet had tackles and sacks under a rushing-touchdown column; fixed.
5. The unsupported claim that San Antonio and Orlando drew larger crowds is removed (no per-team attendance in the dataset).
6. Placeholder source tokens (`turn0search...`) are replaced with named publishers.
7. Open item: this workbook cites USFL 715K and UFL 816K; the FCF workbook uses 695K and 832K. Reconcile before any joint use.

## Running the explorer

`AAF_Explorer.jsx` is a single-file React component with a default export. It needs `react` and `recharts`.

```bash
npm create vite@latest aaf-explorer -- --template react
cd aaf-explorer && npm install recharts
# copy AAF_Explorer.jsx into src/, then in src/main.jsx:
#   import App from "./AAF_Explorer.jsx"
npm run dev
```

All data is inline at the top of the file. No network access or storage is used.

## Rebuilding figures and paper

```bash
pip install pandas numpy scipy matplotlib reportlab openpyxl pillow
python figures/make_figures.py
python figures/build_paper.py
```

Edit the `X=` input path in `make_figures.py` and the output path at the bottom of `build_paper.py` for your machine.

## Known limits

- Eight teams and eight weeks: description and exploratory association only.
- Revenue and burn come from trade reporting on different bases, not audited statements; the $10M weekly burn is a single estimate.
- Cross-league audience comparisons use different broadcast mixes.
- Evidence scores (0-2 on three criteria) are analyst judgments; re-code them in `Evidence_Scoring` or the explorer.
