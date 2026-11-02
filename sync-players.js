// Usage: node sync-players.js            (reads players.json + index.html in this folder, updates index.html)
// Appends every player from players.json that is not already in the game to RAW3 (ids of existing players never change).
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const data = JSON.parse(fs.readFileSync("players.json", "utf8"));
const list = Array.isArray(data) ? data : data.players;
const norm = t => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const key = (n, c) => norm(n) + "|" + norm(c);
const have = new Set();
for (const m of html.matchAll(/^\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","(?:[^"\\]|\\.)*","[A-Z]+",\d+/gm)) have.add(key(JSON.parse('"' + m[1] + '"'), JSON.parse('"' + m[2] + '"')));
const add = [], bad = [];
for (const p of list) {
  if (have.has(key(p.name, p.club))) continue;
  const f = [p.ovr, p.pace, p.shooting, p.passing, p.dribbling, p.defending, p.physical];
  if (!p.name || !p.club || !p.nation || !["ST","LW","RW","CAM","CM","CDM","CB","LB","RB","GK"].includes(p.position) || f.some(v => !Number.isFinite(v) || v < 0 || v > 150)) { bad.push(p.name || "(no name)"); continue; }
  have.add(key(p.name, p.club));
  add.push(`[${JSON.stringify(p.name)},${JSON.stringify(p.club)},${JSON.stringify(p.nation)},"${p.position}",${f.join(",")}]`);
}
if (bad.length) console.log("Skipped (bad data):", bad.join(", "));
if (!add.length) { console.log("Nothing new to add."); process.exit(0); }
const start = html.indexOf("const RAW3 = [");
const end = html.indexOf("\n];", start);
if (start < 0 || end < 0) throw new Error("RAW3 block not found");
const out = html.slice(0, end) + ",\n" + add.join(",\n") + html.slice(end);
fs.writeFileSync("index.html", out);
console.log("Added " + add.length + " player(s) to the game.");
