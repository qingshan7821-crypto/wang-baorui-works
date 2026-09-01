import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");

function loadPortfolioConfig() {
  const source = readFileSync(resolve(projectRoot, "assets/site-config.js"), "utf8");
  const sandbox = { window: {} };
  runInNewContext(source, sandbox, { filename: "site-config.js" });
  return sandbox.window.PORTFOLIO_CONFIG;
}

test("publishes the seven selected Bilibili portfolio films", () => {
  const config = loadPortfolioConfig();
  const expectedBvids = [
    "BV1citg6qELa",
    "BV1katg6uEdk",
    "BV15Wt86jE85",
    "BV1eWt86jEXY",
    "BV15st861E7H",
    "BV1dnt86EEQH",
    "BV1Lnt86EE17",
  ].sort();

  assert.equal(config.works.length, 7);
  assert.deepEqual(
    Array.from(config.works, (work) => work.bvid).sort(),
    expectedBvids,
  );
  assert.equal(config.works.some((work) => work.bvid === "BV15st861Exc"), false);
  assert.equal(config.works.some((work) => work.bvid === "BV1fL4y1e7KW"), false);
  assert.equal(new Set(config.works.map((work) => work.bvid)).size, 7);
  assert.ok(config.works.every((work) => work.poster && work.duration && work.summary));
});

test("places the two newest publications first and features the newest film", () => {
  const { works } = loadPortfolioConfig();

  assert.deepEqual(
    Array.from(works.slice(0, 2), (work) => work.bvid),
    ["BV1citg6qELa", "BV1katg6uEdk"],
  );
  assert.equal(works[0].featured, true);
  assert.equal(works.filter((work) => work.featured).length, 1);
});

test("uses the current phone number and resume-derived professional profile", () => {
  const { profile } = loadPortfolioConfig();

  assert.equal(profile.contact.phone, "17740507389");
  assert.deepEqual(Object.keys(profile.contact), ["phone"]);
  assert.match(profile.bio, /AIGC/);
  assert.ok(profile.experience.length >= 3);
  assert.ok(profile.skills.length >= 6);
});

test("uses clean portfolio titles for the two new publications", () => {
  const { works } = loadPortfolioConfig();
  const professorFilm = works.find((work) => work.bvid === "BV1citg6qELa");
  const drawingBoardFilm = works.find((work) => work.bvid === "BV1katg6uEdk");

  assert.equal(professorFilm?.title, "我要问教授｜测试 3");
  assert.equal(drawingBoardFilm?.title, "画板测试");
});

test("builds a non-autoplay Bilibili player URL from a BV id", () => {
  const require = createRequire(import.meta.url);
  const { buildBilibiliPlayerUrl } = require("../assets/bilibili-player.js");
  const playerUrl = new URL(buildBilibiliPlayerUrl("BV15Wt86jE85"));

  assert.equal(playerUrl.origin, "https://player.bilibili.com");
  assert.equal(playerUrl.pathname, "/player.html");
  assert.equal(playerUrl.searchParams.get("bvid"), "BV15Wt86jE85");
  assert.equal(playerUrl.searchParams.get("page"), "1");
  assert.equal(playerUrl.searchParams.get("high_quality"), "1");
  assert.equal(playerUrl.searchParams.get("autoplay"), "0");
});

test("rejects malformed Bilibili video ids", () => {
  const require = createRequire(import.meta.url);
  const { buildBilibiliPlayerUrl } = require("../assets/bilibili-player.js");

  assert.throws(() => buildBilibiliPlayerUrl("https://example.com"), /BV id/i);
});
