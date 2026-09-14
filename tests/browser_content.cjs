// Optional browser smoke check. Set PLAYWRIGHT_MODULE to an installed Playwright
// module path when it is not on NODE_PATH. Uses an isolated Chrome test profile.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8765';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    const localFailures = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) localFailures.push(response.url()); });
    await page.goto(base, { waitUntil: 'networkidle' });
    const records = await page.evaluate(() => JSON.parse(document.getElementById('project-data').textContent));
    const api = await (await context.request.get(`${base}/projects`)).json();
    assert.deepEqual(records, api);
    for (const project of records.filter(project => project.card)) {
      const card = page.locator(`#${project.id}-project`);
      assert.equal((await card.locator('.project-content > p').textContent()).trim(), project.description);
      await card.locator('[data-project]').click();
      assert.equal(await page.locator('#dialog-title').textContent(), project.name);
      assert.equal(await page.locator('#dialog-summary').textContent(), project.description);
      assert.equal(await page.locator('#dialog-github').getAttribute('href'), project.github_url);
      const details = await page.locator('#dialog-content').textContent();
      for (const capability of project.capabilities) assert(details.includes(capability.text));
      for (const limitation of project.limitations) assert(details.includes(limitation));
      if (project.architecture) {
        assert(details.includes('Current implemented architecture'));
        assert(details.includes('Product direction'));
        assert(details.includes('Act — Planned'));
        assert(details.includes('Verify — Planned'));
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#project-dialog').evaluate(dialog => dialog.open), false);
      assert.equal(await page.evaluate(() => document.activeElement.dataset.project), project.id);
    }
    for (const [filter, count] of [['data', 2], ['ml', 2], ['ai', 2], ['all', 4]]) {
      await page.locator(`[data-filter="${filter}"]`).click();
      assert.equal(await page.locator('.project-card:visible').count(), count);
    }
    await page.locator('[data-filter="ai"]').click();
    await page.locator('#tab-data').click();
    const reporting = records.find(project => project.id === 'pay').capabilities.find(capability => capability.id === 'reporting').text;
    assert((await page.locator('#panel-data .skill-evidence').textContent()).includes(reporting));
    await page.locator('#panel-data .skill-evidence a').click();
    assert.equal(await page.locator('#pay-project').isVisible(), true);
    assert.equal(await page.locator('[data-filter="all"]').getAttribute('aria-pressed'), 'true');
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `horizontal overflow at ${width}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#campus-project [data-project]').click();
    assert.equal(await page.locator('#dialog-title').textContent(), records[0].name);
    await page.keyboard.press('Escape');
    const resume = await context.request.get(`${base}/resume`);
    assert.equal(resume.status(), 200);
    assert.equal(resume.headers()['content-type'], 'application/pdf');
    assert((await resume.body()).subarray(0, 5).equals(Buffer.from('%PDF-')));
    assert.deepEqual(errors, []);
    assert.deepEqual(localFailures, []);
    console.log('PASS: shared JSON/API, four card/dialog pairs, model visibility, current/planned architecture, links, Escape/focus, filters, evidence navigation, four widths, mobile dialog, existing resume, no JS errors or local 404s.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
