#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const pagePath = path.join(ROOT, "topics.html");
const dataPath = path.join(ROOT, "data", "topics.json");
const html = fs.readFileSync(pagePath, "utf8");

const decode = value => value.replace(/&amp;/g, "&").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&rarr;/g, "→");
const escape = value => String(value).replace(/[&<>\"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

if (!fs.existsSync(dataPath)) {
  const cardPattern = /<article class="topic-card" data-topic-card data-branch="([^"]+)" data-keywords="([^"]*)"><span>([^<]+)<\/span><h2>([^<]+)<\/h2><p>([^<]+)<\/p><a href="([^"]+)">([^<]+)<\/a><\/article>/g;
  const topics = [...html.matchAll(cardPattern)].map(([, branch, keywords, label, title, summary, href, linkText], index) => ({
    id: `${branch}-${index + 1}`,
    branch,
    status: branch === "today" ? "researching" : branch === "shared" ? "active" : "proposed",
    label: decode(label),
    title: decode(title),
    summary: decode(summary),
    keywords: decode(keywords).split(/\s+/).filter(Boolean),
    href,
    linkText: decode(linkText)
  }));
  if (topics.length < 20) throw new Error(`Expected at least 20 existing topics, found ${topics.length}`);
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify({ reviewed: "2026-10-19", topics }, null, 2) + "\n");
}

const registry = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const topics = registry.topics;
const cards = topics.map(topic => {
  const related = topics
    .filter(other => other.id !== topic.id && other.branch === topic.branch)
    .map(other => ({ title: other.title, href: other.href, overlap: other.keywords.filter(word => topic.keywords.includes(word)).length }))
    .sort((a, b) => b.overlap - a.overlap || a.title.localeCompare(b.title))
    .slice(0, 2);
  return `        <article class="topic-card" data-topic-card data-branch="${escape(topic.branch)}" data-status="${escape(topic.status)}" data-keywords="${escape(topic.keywords.join(" "))}"><div class="topic-card-meta"><span>${escape(topic.label)}</span><span class="status-pill status-${escape(topic.status)}">${escape(topic.status.replace(/^./, c => c.toUpperCase()))}</span></div><h2>${escape(topic.title)}</h2><p>${escape(topic.summary)}</p><p class="topic-related"><strong>Related:</strong> ${related.map(item => `<a href="${escape(item.href)}">${escape(item.title)}</a>`).join(" · ")}</p><a class="topic-primary-link" href="${escape(topic.href)}">${escape(topic.linkText)}</a></article>`;
}).join("\n");

const start = '      <div class="topic-grid" data-topic-grid>';
const end = '      <div class="topic-empty" data-topic-empty hidden>';
const startAt = html.indexOf(start);
const endAt = html.indexOf(end);
if (startAt === -1 || endAt === -1 || endAt <= startAt) throw new Error("Could not find topic grid boundaries");
const next = html.slice(0, startAt) + `${start}\n${cards}\n      </div>\n` + html.slice(endAt);
fs.writeFileSync(pagePath, next.replace(/<p class="topic-count" data-topic-count aria-live="polite">[^<]+<\/p>/, `<p class="topic-count" data-topic-count aria-live="polite">${topics.length} topics shown</p>`));
console.log(`Rendered ${topics.length} topics from data/topics.json`);
