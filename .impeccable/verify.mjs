import { chromium } from 'playwright-core'

const EXE = '/home/zen/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome'
const BASE = 'http://127.0.0.1:4173/touch-grass/'
const OUT = '/home/zen/Work/touch-grass/.impeccable/review'
const results = []
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' :: ' + detail : ''}`)

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox'],
  ignoreDefaultArgs: ['--hide-scrollbars'],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const dashes = await page.evaluate(() => {
  const t = document.body.innerText
  return { em: (t.match(/[—]/g) || []).length, en: (t.match(/[–]/g) || []).length }
})
check('no em/en dashes in rendered text', dashes.em === 0 && dashes.en === 0, JSON.stringify(dashes))

const cta = await page.locator('.hero-cta .btn-primary').boundingBox()
check('hero CTA visible without scroll', !!cta && cta.y + cta.height < 900, cta ? `bottom=${Math.round(cta.y + cta.height)}` : 'missing')

const navBox = await page.locator('.nav-inner').boundingBox()
check('nav single line under 80px', !!navBox && navBox.height <= 80, `h=${navBox?.height}`)

await page.screenshot({ path: `${OUT}/slop-desktop-light.png`, fullPage: false })
await page.screenshot({ path: `${OUT}/slop-desktop-full.png`, fullPage: true })

await page.fill('[data-crop-search]', 'tom')
await page.waitForTimeout(120)
const noAnim = await page.evaluate(() => document.querySelector('[data-crop-grid]').classList.contains('no-anim'))
const cardsShown = await page.locator('.crop-card').count()
check('search re-render suppresses entrance animation', noAnim && cardsShown > 0, `no-anim=${noAnim} cards=${cardsShown}`)

await page.fill('[data-crop-search]', '')
await page.click('.chip[data-cat="herb"]')
await page.waitForTimeout(120)
const animBack = await page.evaluate(() => !document.querySelector('[data-crop-grid]').classList.contains('no-anim'))
check('category change re-enables entrance animation', animBack)

await page.click('.chip[data-cat="all"]')
await page.waitForTimeout(120)
const lastDelay = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.crop-card')]
  if (!cards.length) return -1
  const d = getComputedStyle(cards[cards.length - 1]).animationDelay
  return parseFloat(d) * 1000
})
check('crop stagger capped <= 400ms on full grid', lastDelay >= 0 && lastDelay <= 400, `${lastDelay}ms`)

await page.click('.week-tab[data-week="1"]')
const tabOk = await page.getAttribute('.week-tab[data-week="1"]', 'aria-selected')
check('week tab switches', tabOk === 'true')

await page.waitForTimeout(900)
await page.hover('.crop-card')
const hover = await page.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.crop-card'))
  const m = cs.transform.match(/matrix\(([^)]+)\)/)
  const tx = m ? Number(m[1].split(',')[4]) : 0
  const ty = m ? Number(m[1].split(',')[5]) : 0
  return { tx, ty, shadow: cs.boxShadow }
})
check('crop card no longer lifts on hover', hover.tx === 0 && hover.ty === 0 && hover.shadow === 'none', JSON.stringify(hover))

await page.click('[data-theme-toggle]')
await page.waitForTimeout(250)
const dark = await page.evaluate(() => document.documentElement.dataset.theme)
await page.screenshot({ path: `${OUT}/slop-desktop-dark.png`, fullPage: false })
check('dark theme applies', dark === 'dark')

const mob = await browser.newPage({ viewport: { width: 390, height: 780 } })
const mobErrors = []
mob.on('pageerror', (e) => mobErrors.push(String(e)))
await mob.goto(BASE, { waitUntil: 'networkidle' })
await mob.waitForTimeout(400)
await mob.click('[data-nav-toggle]')
await mob.waitForTimeout(240)
const menu = await mob.evaluate(() => {
  const el = document.querySelector('.nav-links')
  const cs = getComputedStyle(el)
  return {
    visible: cs.display !== 'none',
    animation: cs.animationName,
    opacity: Number(cs.opacity),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }
})
check('mobile menu opens with entrance animation', menu.visible && menu.animation === 'nav-in' && menu.opacity > 0.9, JSON.stringify(menu))
check('no horizontal overflow at 390px', !menu.overflow)
await mob.screenshot({ path: `${OUT}/slop-mobile-menu.png` })

check('zero page errors (desktop)', errors.length === 0, errors.slice(0, 3).join(' | '))
check('zero page errors (mobile)', mobErrors.length === 0, mobErrors.slice(0, 3).join(' | '))

await browser.close()
console.log(results.join('\n'))
console.log(results.some((r) => r.startsWith('FAIL')) ? '\nRESULT: FAIL' : '\nRESULT: ALL PASS')
