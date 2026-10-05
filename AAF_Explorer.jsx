import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList, LineChart, Line } from "recharts";

const C = { ink: "#1b2a41", teal: "#1f7a8c", org: "#d9480f", grey: "#8d99ae", light: "#e9ecef", bg: "#f4f6f8" };
const serif = "Georgia, 'Times New Roman', serif";
const sans = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const TEAMS = [["Orlando Apollos", "E", 7, 1, 236, 136], ["Birmingham Iron", "E", 5, 3, 165, 133], ["Atlanta Legends", "E", 2, 6, 88, 213], ["Memphis Express", "E", 2, 6, 152, 194],
  ["Arizona Hotshots", "W", 5, 3, 186, 144], ["San Antonio Commanders", "W", 5, 3, 158, 154], ["Salt Lake Stallions", "W", 3, 5, 135, 143], ["San Diego Fleet", "W", 3, 5, 158, 161]]
  .map(([team, conf, w, l, pf, pa]) => ({ team, conf, w, l, pf, pa, diff: pf - pa }));
const ATT = [19210, 19624, 14078, 9582, 13578, 14528, 16320, 15414].map((v, i) => ({ wk: `Wk ${i + 1}`, v }));
const LEAGUES = [["AAF 2019", 1.95, 0.607], ["USFL 2022", 1.57, 0.661], ["XFL 2023", 1.3, 0.655], ["XFL 2020", 3.1, 2.1]].map(([n, a, b]) => ({ n, a, b, pct: Math.round((b / a) * 100) }));
const HYP = [
  ["Capital runway / funder default", 2, 2, 2, "Lead investor largely stopped funding after the first games; rescue was conditional."],
  ["Monetization gap", 2, 2, 2, "$11.8M year-to-date revenue vs a reported ~$10M weekly loss."],
  ["Owner decision to stop funding", 1, 2, 2, "Trustee alleges shutdown was a choice; Dundon disputes. Litigated, not adjudicated."],
  ["Rapid national launch", 2, 1, 1, "Eight teams and national TV from day one raised fixed cost."],
  ["Audience decay", 2, 1, 1, "Week-2 audience fell 69%, the steepest among compared launches."],
  ["Attendance weakness", 1, 1, 1, "About 15.3K average announced; respectable for a startup, uneven by week."],
  ["Competition (XFL 2020)", 1, 0, 1, "A future threat; the league ended before the XFL launched."],
];
const NODES = {
  scale: { x: 10, y: 20, t: "Eight-team national launch", d: "High fixed cost: a reported loss near $10M per week.", k: "ok" },
  aud: { x: 250, y: 20, t: "Front-loaded demand", d: "3.25M for the CBS opener, 1.95M week-1 average, then 607K in week 2.", k: "ok" },
  rev: { x: 490, y: 20, t: "Thin revenue", d: "$11.8M year to date and a single official sponsor.", k: "gap" },
  fow: { x: 10, y: 130, t: "Lead investor stops", d: "Fowler paid about $28M after pledging $50M plus a $120M credit line.", k: "gap" },
  dun: { x: 250, y: 130, t: "Conditional rescue", d: "$250M announced; the term sheet said $70M and about $70M was reportedly paid, with no equity purchase.", k: "gap" },
  gap: { x: 490, y: 130, t: "Burn exceeds funding", d: "At $10M a week, $70M is 7 weeks of operations.", k: "gap" },
  sus: { x: 250, y: 240, t: "Operations suspended", d: "April 2, 2019, after eight weeks of games; weeks 9-10 and the title game cancelled.", k: "gap" },
  ch7: { x: 490, y: 240, t: "Chapter 7", d: "April 17: $48.3M liabilities, $11.3M assets, about $0.5M cash.", k: "end" },
};
const EDGES = [["scale", "aud", 0], ["aud", "rev", 0], ["scale", "fow", 0], ["rev", "gap", 1], ["fow", "dun", 1], ["dun", "gap", 1], ["dun", "sus", 1], ["gap", "sus", 1], ["sus", "ch7", 1]];

const Card = ({ title, note, children }) => (
  <section style={{ background: "#fff", border: `1px solid ${C.light}`, borderRadius: 6, padding: 20, marginBottom: 20 }}>
    <h2 style={{ fontFamily: serif, fontSize: 20, margin: "0 0 4px" }}>{title}</h2>
    {note && <p style={{ margin: "0 0 14px", color: C.grey, fontSize: 13, maxWidth: 640, lineHeight: 1.5 }}>{note}</p>}
    {children}
  </section>
);
const Btn = ({ on, children, ...p }) => (
  <button {...p} aria-pressed={on} style={{ padding: "6px 14px", border: `1.5px solid ${C.ink}`, background: on ? C.ink : "#fff", color: on ? "#fff" : C.ink, borderRadius: 4, cursor: "pointer", fontFamily: sans }}>{children}</button>
);

function Audience() {
  const [sel, setSel] = useState("AAF 2019");
  const s = LEAGUES.find((l) => l.n === sel);
  return (
    <Card title="The audience that arrived did not stay" note="Week-2 audience as a share of week 1 for four spring-league launches. Broadcast mixes differ, so read the comparison as indicative.">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={[...LEAGUES].sort((a, b) => a.pct - b.pct)} layout="vertical" margin={{ left: 20, right: 30 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <YAxis type="category" dataKey="n" width={80} tick={{ fontSize: 12, fill: C.ink }} axisLine={false} tickLine={false} />
          <Bar dataKey="pct" radius={2}>{LEAGUES.map((l) => <Cell key={l.n} fill={l.n === "AAF 2019" ? C.org : C.grey} />)}<LabelList dataKey="pct" position="right" fontSize={11} formatter={(v) => v + "%"} /></Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>{LEAGUES.map((l) => <Btn key={l.n} on={sel === l.n} onClick={() => setSel(l.n)}>{l.n}</Btn>)}</div>
      <p style={{ fontFamily: serif, fontSize: 16, margin: 0 }}>{s.n}: {s.a}M in week 1 to {s.b * 1000}K in week 2, a {100 - s.pct}% decline.</p>
    </Card>
  );
}

function Teams() {
  const [mode, setMode] = useState("diff");
  const rows = useMemo(() => [...TEAMS].sort((a, b) => b[mode] - a[mode]), [mode]);
  return (
    <Card title="Competitive product" note="Orlando finished 7-1 at +100; Atlanta finished 2-6 at -125. Win percentage and point differential are strongly associated (r = 0.89, n = 8, exploratory).">
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}><Btn on={mode === "diff"} onClick={() => setMode("diff")}>Point differential</Btn><Btn on={mode === "w"} onClick={() => setMode("w")}>Wins</Btn></div>
      <ResponsiveContainer width="100%" height={rows.length * 34 + 30}>
        <BarChart data={rows} layout="vertical" margin={{ left: 40, right: 30 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="team" width={150} tick={{ fontSize: 12, fill: C.ink }} axisLine={false} tickLine={false} />
          <ReferenceLine x={0} stroke={C.ink} />
          <Tooltip formatter={(v, n, p) => [`${v} (${p.payload.w}-${p.payload.l})`, mode === "diff" ? "Point diff" : "Wins"]} />
          <Bar dataKey={mode} radius={2}>{rows.map((t, i) => <Cell key={i} fill={t[mode] >= (mode === "diff" ? 0 : 4) ? C.teal : C.org} />)}<LabelList dataKey={mode} position="right" fontSize={11} /></Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function Attendance() {
  const mean = Math.round(ATT.reduce((a, b) => a + b.v, 0) / ATT.length);
  return (
    <Card title="Announced attendance" note={`Mean ${mean.toLocaleString()} per game across 32 games. The week-4 trough was 51% below week 2, then attendance recovered 70% by week 7.`}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={ATT} margin={{ top: 10, right: 20, left: 0 }}>
          <XAxis dataKey="wk" tick={{ fontSize: 11 }} axisLine={{ stroke: C.ink }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 22000]} />
          <ReferenceLine y={mean} stroke={C.grey} strokeDasharray="4 4" />
          <Tooltip formatter={(v) => v.toLocaleString()} />
          <Line dataKey="v" stroke={C.teal} strokeWidth={2.5} dot={{ r: 4, fill: C.teal }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

function Runway() {
  const [burn, setBurn] = useState(10);
  const pools = [["Revenue to date", 11.8], ["Fowler cash", 28], ["Dundon paid", 70], ["Dundon announced", 250]];
  const data = pools.map(([n, v]) => ({ n, w: +(v / burn).toFixed(1) }));
  return (
    <Card title="Runway in weeks" note="Each pool of money divided by the weekly burn. The reported burn is about $10M a week, from one trade-press estimate. Move the slider to test it.">
      <label style={{ fontSize: 13 }}>Weekly burn: <b>${burn}M</b>
        <input type="range" min={3} max={20} value={burn} onChange={(e) => setBurn(+e.target.value)} style={{ display: "block", width: "100%", maxWidth: 360, accentColor: C.org, margin: "6px 0 14px" }} />
      </label>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 30, right: 50 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="n" width={120} tick={{ fontSize: 12, fill: C.ink }} axisLine={false} tickLine={false} />
          <Bar dataKey="w" radius={2}>{data.map((d, i) => <Cell key={i} fill={i === 3 ? C.org : i === 0 ? C.grey : C.teal} />)}<LabelList dataKey="w" position="right" fontSize={11} formatter={(v) => v + " wk"} /></Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 12, color: C.grey, margin: 0 }}>Orange: announced, never paid in full.</p>
    </Card>
  );
}

function Mechanism() {
  const [sel, setSel] = useState("dun");
  const mid = (k) => [NODES[k].x + 85, NODES[k].y + 30];
  const fill = (k) => (sel === k ? C.ink : "#fff");
  return (
    <Card title="Failure mechanism" note="Select a step. Solid orange arrows are documented in filings and trade reporting; dashed grey arrows are inferred.">
      <svg viewBox="0 0 600 320" style={{ width: "100%", maxWidth: 700 }} role="img" aria-label="Failure mechanism diagram">
        <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={C.ink} /></marker></defs>
        {EDGES.map(([a, b, s], i) => { const [x1, y1] = mid(a), [x2, y2] = mid(b); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={s ? C.org : C.grey} strokeWidth={s ? 2 : 1.4} strokeDasharray={s ? "" : "5 4"} markerEnd="url(#ar)" />; })}
        {Object.entries(NODES).map(([k, n]) => (
          <g key={k} onClick={() => setSel(k)} onKeyDown={(e) => e.key === "Enter" && setSel(k)} tabIndex={0} role="button" aria-label={n.t} style={{ cursor: "pointer" }}>
            <rect x={n.x} y={n.y} width={170} height={60} rx={8} fill={fill(k)} stroke={n.k === "gap" ? C.org : n.k === "end" ? C.ink : C.teal} strokeWidth={n.k === "gap" ? 2.5 : 1.5} />
            <text x={n.x + 85} y={n.y + 34} textAnchor="middle" fontSize={13} fontFamily={sans} fill={sel === k ? "#fff" : C.ink}>{n.t}</text>
          </g>
        ))}
      </svg>
      <p style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.5, borderLeft: `3px solid ${C.teal}`, paddingLeft: 14, margin: "8px 0 0" }}><b>{NODES[sel].t}.</b> {NODES[sel].d}</p>
    </Card>
  );
}

function Evidence() {
  const [s, setS] = useState(HYP.map((h) => [h[1], h[2], h[3]]));
  const rows = HYP.map((h, i) => ({ name: h[0], note: h[4], sc: s[i], tot: s[i].reduce((a, b) => a + b, 0), i })).sort((a, b) => b.tot - a.tot);
  const set = (i, j, v) => setS((p) => p.map((r, k) => (k === i ? r.map((x, m) => (m === j ? v : x)) : r)));
  return (
    <Card title="Re-code the evidence" note="Score each hypothesis 0-2 on: documented, causal proximity to shutdown, and AAF-specific. The ranking updates. Defaults are the paper's judgments.">
      {rows.map((r) => (
        <div key={r.name} style={{ padding: "10px 0", borderTop: `1px solid ${C.light}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: serif, fontSize: 16 }}><span>{r.name}</span><b style={{ color: r.tot >= 5 ? C.org : C.ink }}>{r.tot}/6</b></div>
          <div style={{ height: 6, background: C.light, borderRadius: 3, margin: "6px 0" }}><div style={{ width: `${(r.tot / 6) * 100}%`, height: 6, background: r.tot >= 5 ? C.org : C.teal, borderRadius: 3, transition: "width .25s" }} /></div>
          <div style={{ fontSize: 12, color: C.grey, marginBottom: 6 }}>{r.note}</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12 }}>
            {["Documented", "Proximity", "AAF-specific"].map((l, j) => <label key={l}>{l} <select value={r.sc[j]} onChange={(e) => set(r.i, j, +e.target.value)}>{[0, 1, 2].map((n) => <option key={n}>{n}</option>)}</select></label>)}
          </div>
        </div>
      ))}
    </Card>
  );
}

const TABS = [["Thesis", null], ["Audience", Audience], ["Attendance", Attendance], ["Teams", Teams], ["Runway", Runway], ["Mechanism", Mechanism], ["Evidence", Evidence]];

export default function AAFExplorer() {
  const [tab, setTab] = useState("Thesis");
  const View = TABS.find((t) => t[0] === tab)[1];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "28px 16px", fontFamily: sans, color: C.ink }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontFamily: serif, fontSize: 34, margin: 0, lineHeight: 1.15 }}>Demand Without a Runway</h1>
        <p style={{ color: C.grey, margin: "6px 0 18px" }}>An interactive companion to the paper on why the Alliance of American Football failed, 2019.</p>
        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }} aria-label="Sections">
          {TABS.map(([n]) => <button key={n} onClick={() => setTab(n)} aria-current={tab === n} style={{ padding: "7px 14px", fontFamily: sans, fontSize: 14, cursor: "pointer", border: "none", borderBottom: `3px solid ${tab === n ? C.org : "transparent"}`, background: "transparent", color: C.ink, fontWeight: tab === n ? 700 : 400 }}>{n}</button>)}
        </nav>
        {View ? <View /> : (
          <Card title="The AAF did not fail because nobody cared">
            <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.6, margin: "0 0 12px" }}>The league opened to 3.25M viewers on CBS and averaged about 15,300 in announced attendance. It suspended operations on April 2, 2019 and filed Chapter 7 on April 17 with $48.3M in liabilities against $11.3M in assets.</p>
            <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.6, margin: 0 }}>Reported revenue of $11.8M covered about one week of a reported $10M weekly loss. The lead investor stopped funding, and the replacement owner paid about $70M of a publicly announced $250M. Burn and revenue figures come from trade reporting, not audited statements.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
