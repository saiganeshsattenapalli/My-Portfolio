// Design foundation checks. Uses an isolated desktop Chrome profile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8765';
const output = path.resolve(__dirname, '../docs/previews/current');
(async () => {
 fs.mkdirSync(output, { recursive: true });
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  const foundation = await page.evaluate(() => {
   const css = el=>getComputedStyle(document.querySelector(el));
   return {
    sheets:[...document.querySelectorAll('link[rel=stylesheet]')].map(el=>el.getAttribute('href')),
    background:css('.hero').backgroundColor,font:css('body').fontFamily,emphasis:css('.hero h1 span').fontStyle,
    accent:css('.resume-nav').backgroundColor,glass:css('.nav-container').backgroundColor,
    blur:css('.nav-container').backdropFilter,navWidth:document.querySelector('.nav-container').getBoundingClientRect().width,
    canvas:document.querySelectorAll('canvas').length,
    missingTokens:[...new Set([...document.styleSheets].flatMap(sheet=>{
     const walk=rules=>[...rules].flatMap(rule=>rule.cssRules?walk(rule.cssRules):[...(rule.cssText||'').matchAll(/var\((--[\w-]+)\)/g)].map(m=>m[1]));return walk(sheet.cssRules);
    }))].filter(name=>!getComputedStyle(document.documentElement).getPropertyValue(name))
   };
  });
  assert.deepEqual(foundation.sheets,['design-system','base','components','animations','portfolio'].map(n=>`/static/css/${n}.css`));
  assert.equal(foundation.background,'rgb(245, 247, 250)');assert.equal(foundation.accent,'rgb(0, 113, 227)');
  assert.equal(foundation.glass,'rgba(255, 255, 255, 0.68)');assert.equal(foundation.blur,'blur(28px) saturate(1.8)');
  assert.equal(foundation.emphasis,'normal');assert.equal(foundation.canvas,0);assert(foundation.font.includes('-apple-system'));
  assert.deepEqual(foundation.missingTokens,[]);assert.equal(foundation.navWidth,1120);
  await page.waitForFunction(()=>document.querySelector('.hero-art').dataset.motion==='running');
  const stage=page.locator('.hero-art'),box=await stage.boundingBox();
  await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);
  await page.waitForFunction(()=>document.querySelector('.hero-art').style.getPropertyValue('--tilt-y')!=='');
  assert(await stage.evaluate(el=>el.style.getPropertyValue('--mouse-x')!==''));
  await page.mouse.move(20,900);
  assert.equal(await stage.evaluate(el=>el.style.getPropertyValue('--mouse-x')),'');
  await page.locator('.hero-actions .button').hover();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-actions .button')).transform !== 'none');
  await page.locator('#motion-toggle').click();assert.equal(await stage.getAttribute('data-motion'),'paused');
  await page.mouse.move(20,900);
  await page.locator('.hero').screenshot({path:path.join(output,'hero-chrome.png')});
  await page.locator('.nav-container').screenshot({path:path.join(output,'navbar-chrome.png')});
  await page.locator('#motion-toggle').focus();await page.keyboard.press('Enter');assert.equal(await stage.getAttribute('data-motion'),'running');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.hero-art').dataset.motion==='paused');
  assert(await page.locator('#motion-toggle').isDisabled());
  assert.equal(await page.locator('.orbit-a').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.locator('#work').screenshot({path:path.join(output,'work-chrome.png')});
  await page.evaluate(()=>scrollTo(0,0));
  for (const width of [1440,1024,768,600,390,320]) {
   await page.setViewportSize({width,height:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
  }
  await page.setViewportSize({width:390,height:1000});await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(output,'mobile-chrome.png')});
  await page.locator('.menu-toggle').click();assert(await page.locator('#mobile-nav').isVisible());
  await page.keyboard.press('Escape');assert(!(await page.locator('#mobile-nav').isVisible()));
  await page.evaluate(()=>scrollTo(0,1200));await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-scrolled'));
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'chrome-verification.json'),JSON.stringify({browser:await browser.version(),foundation,checks:['pointer tilt and moving highlight/reset','button hover lift','pause/play keyboard','reduced motion','mobile navigation Escape','scroll glass','no overflow at 1440/1024/768/600/390/320','no JS errors']},null,2)+'\n');
  console.log('Curiora Chrome design checks passed. Screenshots: '+output);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
