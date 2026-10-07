import './styles.css'
import '@fontsource-variable/outfit'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@phosphor-icons/web/regular'

import {
  fetchForecast,
  fetchNormals,
  fmtDate,
  loadChecks,
  loadForecast,
  loadManual,
  loadNormals,
  loadPlace,
  saveChecks,
  saveForecast,
  saveManual,
  saveNormals,
  savePlace,
} from './frost.js'
import { allPlants, buildPlan, makeWeek, summarize } from './plan.js'
import { ask, loadModel, modelLoaded, webgpuAvailable } from './chat.js'

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => Array.from(document.querySelectorAll(sel))

const EXAMPLE_PLACE = {
  lat: 42.2808,
  lon: -83.743,
  label: 'Ann Arbor, MI (example)',
  example: true,
}

const state = {
  place: null,
  normals: null,
  forecast: null,
  manual: false,
  weekOffset: 0,
  booted: false,
  checks: loadChecks(),
}

function setNetUI() {
  const online = navigator.onLine
  const pill = $('[data-net-pill]')
  pill.hidden = false
  pill.textContent = online ? 'Online' : 'Offline · cached'
  pill.classList.toggle('is-offline', !online)
  const line = $('[data-net-line]')
  if (line) {
    line.textContent = online
      ? 'Connected now. Frost dates refresh automatically.'
      : 'Offline right now. Everything below still works.'
  }
}

function status(text, isError = false) {
  const el = $('[data-loc-status]')
  el.textContent = text
  el.classList.toggle('is-error', isError)
}

async function refreshForecast() {
  if (!state.place || state.manual) return
  const cached = loadForecast(state.place.lat, state.place.lon)
  if (cached) state.forecast = cached
  try {
    const fresh = await fetchForecast(state.place.lat, state.place.lon)
    saveForecast(state.place.lat, state.place.lon, fresh)
    state.forecast = fresh
  } catch {
    if (!state.forecast) state.forecast = null
  }
}

async function ensureNormals() {
  if (state.manual && state.normals) return true
  if (!state.place) return false
  const cached = loadNormals(state.place.lat, state.place.lon)
  if (cached) {
    state.normals = cached
    return true
  }
  status('Reading 6 years of daily frost normals…')
  try {
    const fresh = await fetchNormals(state.place.lat, state.place.lon)
    saveNormals(state.place.lat, state.place.lon, fresh)
    state.normals = fresh
    return true
  } catch {
    status(
      navigator.onLine
        ? 'Could not reach the climate service. Try again, or enter your frost dates below.'
        : 'Offline, and no cached frost dates for this plot yet. Enter your frost dates below.',
      true,
    )
    return false
  }
}

function restampCard() {
  if (!state.booted) return
  const card = $('[data-hero-card]')
  if (!card) return
  card.classList.remove('is-restamp')
  void card.offsetWidth
  card.classList.add('is-restamp')
}

async function setPlace(place, { keepManualDates = false } = {}) {
  state.place = place
  state.manual = false
  if (!keepManualDates) saveManual(null)
  savePlace(place)
  status('Reading 6 years of daily frost normals…')
  const ok = await ensureNormals()
  await refreshForecast()
  if (ok) status(`Frost dates ready for ${place.label}.`)
  renderAll()
  restampCard()
}

function applyManual(lastMMDD, firstMMDD) {
  state.manual = true
  state.normals = {
    last: lastMMDD,
    first: firstMMDD,
    noFrost: false,
    years: 0,
    source: 'entered by hand',
    fetchedAt: Date.now(),
  }
  state.place = state.place && !state.place.example ? state.place : null
  saveManual({ last: lastMMDD, first: firstMMDD })
  status('Using the frost dates you entered.')
  renderAll()
  restampCard()
}

function currentWeek() {
  return makeWeek(state.weekOffset)
}

function planGroups() {
  if (!state.normals) return []
  if (state.normals.noFrost) return []
  return buildPlan(state.normals, currentWeek())
}

function renderHero() {
  const week = currentWeek()
  $('[data-hero-week]').textContent = `WEEK OF ${fmtDate(week.start)}`
  const placeLabel = state.place
    ? state.place.label
    : state.manual
      ? 'Manual frost dates'
      : 'Example plot'
  $('[data-hero-place]').textContent = placeLabel
  $('[data-hero-last]').textContent = state.normals?.last
    ? fmtDate(fromMMDDLocal(state.normals.last))
    : 'Not set'
  $('[data-hero-first]').textContent = state.normals?.first
    ? fmtDate(fromMMDDLocal(state.normals.first))
    : 'Not set'
  const groups = planGroups()
  const firstTask = groups[0]?.tasks[0]
  $('[data-hero-task]').textContent = firstTask
    ? firstTask.name
    : state.normals?.noFrost
      ? 'No typical frost: sow heat-lovers'
      : 'Quiet week'
  const note = $('[data-hero-note]')
  note.textContent = state.place?.example
    ? 'Showing an example plot until you set your own.'
    : state.manual
      ? 'Dates you entered; no coordinates were sent anywhere.'
      : 'Your plot, computed on this device and cached for offline.'
}

function fromMMDDLocal(mmdd) {
  const [m, d] = mmdd.split('-').map(Number)
  return new Date(new Date().getFullYear(), m - 1, d)
}

function renderTitleblock() {
  const n = state.normals
  $('[data-tb-place]').textContent = state.place
    ? state.place.label
    : state.manual
      ? 'Manual dates (no coordinates)'
      : 'Not set'
  $('[data-tb-last]').textContent = n?.noFrost
    ? 'None typical'
    : n?.last
      ? fmtDate(fromMMDDLocal(n.last))
      : 'Not set'
  $('[data-tb-first]').textContent = n?.noFrost
    ? 'None typical'
    : n?.first
      ? fmtDate(fromMMDDLocal(n.first))
      : 'Not set'
  if (n?.last && n?.first) {
    const a = fromMMDDLocal(n.last)
    const b = fromMMDDLocal(n.first)
    const days = Math.max(0, Math.round((b - a) / 86400000))
    $('[data-tb-season]').textContent = `${days} days`
  } else {
    $('[data-tb-season]').textContent = 'Not set'
  }
  $('[data-tb-method]').textContent = n?.source?.startsWith('entered')
    ? 'Entered by hand; nothing was transmitted.'
    : n
      ? `${n.years || '6'}-year daily normals, ≤ 0 °C crossings averaged, from Open-Meteo climate API (CC BY 4.0)`
      : '2020-2025 daily normals, ≤ 0 °C crossings, averaged, from Open-Meteo climate API (CC BY 4.0)'
  const note = $('[data-cache-note]')
  if (n) {
    const when = new Date(n.fetchedAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    note.textContent = `Cached on this device ${when}. Works offline from here on.`
  } else {
    note.textContent = 'No frost dates cached yet for this plot.'
  }
}

function taskHTML(task, index) {
  const checked = state.checks[task.id] ? 'checked' : ''
  const chips = task.chips
    .map(
      (c) =>
        `<span class="meta-chip${c.kind === 'frost' ? ' is-frost' : ''}">${c.label}</span>`,
    )
    .join('')
  return `<li class="task-item" style="--i:${index}">
    <label>
      <input type="checkbox" data-task-id="${task.id}" ${checked} />
      <span class="task-box"><i class="ph ph-check"></i></span>
    </label>
    <div class="task-body">
      <span class="task-name">${task.name}</span>
      <div class="task-meta">${chips}</div>
    </div>
  </li>`
}

function renderChecklist() {
  const root = $('[data-checklist]')
  const groups = planGroups()
  if (!state.normals) {
    root.innerHTML = `<div class="empty-state">
      <i class="ph ph-plant"></i>
      <h3>Your week will print here</h3>
      <p>Set your location above, or your own frost dates, and this fills with actions for your ground.</p>
    </div>`
    return
  }
  if (state.normals.noFrost) {
    root.innerHTML = `<div class="empty-state">
      <i class="ph ph-sun"></i>
      <h3>No typical frost on this plot</h3>
      <p>Your ground rarely crosses 0 °C, so frost-anchored scheduling does not apply. Plant heat-lovers whenever suits you, and keep the crop notes below as a guide.</p>
    </div>`
    return
  }
  if (!groups.length) {
    root.innerHTML = `<div class="empty-state">
      <i class="ph ph-coffee"></i>
      <h3>Quiet week for your plot</h3>
      <p>Nothing lands inside this week's windows. Check next week, mulch something, or enjoy the fact that the garden is asking nothing of you.</p>
    </div>`
    return
  }
  let counter = 0
  root.innerHTML = groups
    .map((g) => {
      const items = g.tasks.map((t) => taskHTML(t, counter++)).join('')
      return `<section class="task-group">
        <header class="task-group-head">
          <i class="ph ${g.icon}"></i>
          <h3>${g.label}</h3>
          <span class="task-group-count">${g.tasks.length}</span>
        </header>
        <ul class="task-list">${items}</ul>
      </section>`
    })
    .join('')
}

function renderBanner() {
  const banner = $('[data-frost-banner]')
  const protect = planGroups().find((g) => g.id === 'protect')
  if (!protect) {
    banner.hidden = true
    return
  }
  banner.hidden = false
  const firstTask = protect.tasks[0]
  $('[data-frost-banner-title]').textContent = `${protect.tasks.length} cold night${protect.tasks.length > 1 ? 's' : ''} in your week`
  $('[data-frost-banner-text]').textContent = firstTask.detail
}

const CROPS = allPlants()
const cropPageSize = () => (window.matchMedia('(max-width: 760px)').matches ? 4 : 8)
let cropFilter = { cat: 'all', q: '', page: 1 }

function renderCrops({ animate = true, focusPage = false } = {}) {
  const grid = $('[data-crop-grid]')
  const pager = $('[data-crop-pager]')
  const count = $('[data-crop-count]')
  const pageLabel = $('[data-crop-page-label]')
  const previous = $('[data-crop-prev]')
  const next = $('[data-crop-next]')
  grid.classList.toggle('no-anim', !animate)
  const q = cropFilter.q.trim().toLowerCase()
  const list = CROPS.filter(
    (p) =>
      (cropFilter.cat === 'all' || p.cat === cropFilter.cat) &&
      (!q || p.name.toLowerCase().includes(q) || p.note.toLowerCase().includes(q)),
  )
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><i class="ph ph-magnifying-glass"></i><h3>No crops match</h3><p>Clear the search or pick another category.</p></div>`
    count.textContent = 'No crops match your search.'
    pageLabel.textContent = ''
    previous.disabled = true
    next.disabled = true
    $('[data-crop-pagination]').hidden = true
    if (focusPage) $('[data-crop-page-heading]').focus({ preventScroll: true })
    return
  }
  const pageSize = cropPageSize()
  const pageCount = Math.ceil(list.length / pageSize)
  cropFilter.page = Math.min(cropFilter.page, pageCount)
  const start = (cropFilter.page - 1) * pageSize
  const visible = list.slice(start, start + pageSize)
  count.textContent = `Showing ${start + 1}–${start + visible.length} of ${list.length} crops`
  pageLabel.textContent = `Page ${cropFilter.page} of ${pageCount}`
  previous.disabled = cropFilter.page === 1
  next.disabled = cropFilter.page === pageCount
  $('[data-crop-pagination]').hidden = pageCount < 2
  pager.hidden = false
  grid.innerHTML = visible
    .map((p, i) => {
      const catLabel = p.cat === 'veg' ? 'vegetable' : p.cat === 'herb' ? 'herb' : 'flower'
      const chips = [
        `<span class="meta-chip">${p.dtm} days</span>`,
        `<span class="meta-chip">${p.sun === 'full' ? 'full sun' : 'part shade'}</span>`,
        p.hardy ? '' : '<span class="meta-chip is-frost">frost-tender</span>',
      ].join('')
      return `<article class="crop-card" style="--i:${i}">
        <h3>${p.name}</h3>
        <div class="task-meta">${chips}</div>
        <p class="crop-note">${p.note}</p>
        <div class="task-meta"><span class="meta-chip">${catLabel} · ${p.spacing}</span></div>
      </article>`
    })
    .join('')
  if (focusPage) {
    const heading = $('[data-crop-page-heading]')
    heading.textContent = `Crop notes, page ${cropFilter.page}`
    heading.focus()
  }
}

function renderAll() {
  renderHero()
  renderTitleblock()
  renderChecklist()
  renderBanner()
  renderCrops()
}

function initTheme() {
  const stored = localStorage.getItem('gardenwise:theme')
  if (stored === 'dark' || stored === 'light') {
    document.documentElement.dataset.theme = stored
  }
  $('[data-theme-toggle]').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark'
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('gardenwise:theme', next)
  })
}

function initNav() {
  const nav = $('.nav')
  const toggle = $('[data-nav-toggle]')
  if (!nav || !toggle) return
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')))
  $$('.nav-links a').forEach((a) => a.addEventListener('click', () => setOpen(false)))
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) setOpen(false)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })
}

function initLocation() {
  $('[data-use-location]').addEventListener('click', () => {
    if (!navigator.geolocation) {
      status('This browser cannot share a location; enter coordinates instead.', true)
      return
    }
    status('Asking your browser for your location…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPlace({
          lat: latitude,
          lon: longitude,
          label: `${latitude.toFixed(3)}, ${longitude.toFixed(3)} (your device)`,
          example: false,
        })
      },
      () => status('Location declined. Type coordinates instead, or set dates by hand.', true),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    )
  })

  $('[data-loc-form]').addEventListener('submit', (e) => {
    e.preventDefault()
    const rawLat = $('#in-lat').value.trim()
    const rawLon = $('#in-lon').value.trim()
    const lat = Number(rawLat)
    const lon = Number(rawLon)
    if (
      !rawLat ||
      !rawLon ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      Math.abs(lat) > 90 ||
      Math.abs(lon) > 180
    ) {
      status('Enter a latitude between -90 and 90 and a longitude between -180 and 180.', true)
      return
    }
    setPlace({ lat, lon, label: `${lat.toFixed(3)}, ${lon.toFixed(3)}`, example: false })
  })

  $('[data-use-manual]').addEventListener('click', () => {
    const last = $('#in-last').value
    const first = $('#in-first').value
    if (!last || !first) {
      status('Pick both dates, or use the coordinates instead.', true)
      return
    }
    applyManual(last.slice(5), first.slice(5))
  })
}

function initWeekTabs() {
  $$('.week-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.weekOffset = Number(btn.dataset.week)
      $$('.week-tab').forEach((b) => {
        const active = b === btn
        b.classList.toggle('is-active', active)
        b.setAttribute('aria-selected', String(active))
      })
      renderHero()
      renderChecklist()
      renderBanner()
    })
  })
}

function initChecklist() {
  $('[data-checklist]').addEventListener('change', (e) => {
    const input = e.target.closest('input[data-task-id]')
    if (!input) return
    state.checks[input.dataset.taskId] = input.checked
    saveChecks(state.checks)
  })
  $('[data-print]').addEventListener('click', () => window.print())
}

function initCrops() {
  const search = $('[data-crop-search]')
  search.placeholder = `Search ${CROPS.length} crops…`
  search.addEventListener('input', () => {
    cropFilter.q = search.value
    cropFilter.page = 1
    renderCrops({ animate: false })
  })
  $('[data-crop-chips]').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip')
    if (!chip) return
    cropFilter.cat = chip.dataset.cat
    cropFilter.page = 1
    $$('.chip').forEach((c) => {
      const active = c === chip
      c.classList.toggle('is-active', active)
      c.setAttribute('aria-pressed', String(active))
    })
    renderCrops()
  })

  $('[data-crop-prev]').addEventListener('click', () => {
    if (cropFilter.page <= 1) return
    cropFilter.page -= 1
    renderCrops({ focusPage: true })
  })
  $('[data-crop-next]').addEventListener('click', () => {
    cropFilter.page += 1
    renderCrops({ focusPage: true })
  })
  window.matchMedia('(max-width: 760px)').addEventListener('change', () => {
    cropFilter.page = 1
    renderCrops({ animate: false })
  })
}

function initNet() {
  window.addEventListener('online', setNetUI)
  window.addEventListener('offline', setNetUI)
  setNetUI()
}

let deferredInstall = null
function initInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredInstall = e
    const btn = $('[data-install]')
    btn.hidden = false
    btn.addEventListener(
      'click',
      async () => {
        deferredInstall.prompt()
        await deferredInstall.userChoice
        deferredInstall = null
        btn.hidden = true
      },
      { once: true },
    )
  })
}

function systemContext() {
  const n = state.normals
  const week = currentWeek()
  const tasks = planGroups()
    .flatMap((g) => g.tasks.map((t) => t.name))
    .slice(0, 12)
  const lines = CROPS.slice(0, 45).map(
    (p) =>
      `${p.name}: ${p.dtm} days, ${p.sun} sun, ${p.hardy ? 'frost-hardy' : 'frost-tender'}. ${p.note}`,
  )
  return [
    'You are Gardenwise, a concise gardening assistant. Answer in under 120 words, practical, metric units.',
    `User's plot: ${state.place?.label || 'not set'}.`,
    n?.last ? `Last spring frost: ${n.last}. First autumn frost: ${n.first}.` : '',
    `Week of ${fmtDate(week.start)} plan: ${tasks.length ? tasks.join('; ') : 'nothing scheduled'}.`,
    'Crop reference:',
    ...lines,
    'Ground rules: never invent frost dates or locations; if asked something outside the data, say so and give general guidance.',
  ]
    .filter(Boolean)
    .join('\n')
}

function initChat() {
  const setup = $('[data-chat-setup]')
  const loadBtn = $('[data-load-model]')
  const hint = $('[data-chat-hint]')
  const progress = $('[data-chat-progress]')
  const bar = $('[data-chat-progress-bar]')
  const label = $('[data-chat-progress-label]')
  const log = $('[data-chat-log]')
  const form = $('[data-chat-form]')
  const welcome = $('[data-chat-welcome]')

  if (!webgpuAvailable()) {
    loadBtn.disabled = true
    hint.textContent =
      'This browser has no WebGPU, so the model cannot run here; the planner above works regardless.'
  }

  loadBtn.addEventListener('click', async () => {
    const modelId = $('[data-model-pick]').value
    loadBtn.disabled = true
    progress.hidden = false
    label.hidden = false
    label.textContent = 'Preparing…'
    try {
      await loadModel(modelId, (p, text) => {
        bar.style.transform = `scaleX(${p})`
        label.textContent = `${Math.round(p * 100)}% · ${text.slice(0, 80)}`
      })
      setup.querySelector('.field').hidden = true
      loadBtn.hidden = true
      label.textContent = modelLoaded() ? 'Model ready. It lives in this tab now.' : ''
      progress.hidden = true
      log.hidden = false
      form.hidden = false
      welcome.hidden = false
      welcome.textContent =
        'Loaded. Ask anything about your plot; every answer is computed on your device.'
    } catch (err) {
      label.textContent = `Could not load the model: ${err?.message || err}. The planner above still works.`
      loadBtn.disabled = false
    }
  })

  let busy = false
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = $('[data-chat-text]')
    const text = input.value.trim()
    if (!text || busy || !modelLoaded()) return
    busy = true
    input.value = ''
    log.hidden = false
    welcome.hidden = true
    const user = document.createElement('div')
    user.className = 'chat-msg chat-msg-user'
    user.textContent = text
    log.appendChild(user)
    const ai = document.createElement('div')
    ai.className = 'chat-msg chat-msg-ai'
    ai.textContent = '…'
    log.appendChild(ai)
    log.scrollTop = log.scrollHeight
    try {
      await ask(text, systemContext(), (acc) => {
        ai.textContent = acc
        log.scrollTop = log.scrollHeight
      })
    } catch (err) {
      ai.textContent = `Something went wrong running the model (${err?.message || err}).`
    }
    busy = false
  })
}

async function boot() {
  initTheme()
  initNav()
  initNet()
  initLocation()
  initWeekTabs()
  initChecklist()
  initCrops()
  initInstall()
  initChat()

  const manual = loadManual()
  const place = loadPlace()
  if (manual?.last && manual?.first) {
    state.place = place
    applyManual(manual.last, manual.first)
    await refreshForecast()
    renderAll()
    status('Using your saved frost dates.')
    state.booted = true
    return
  }
  state.place = place || EXAMPLE_PLACE
  if (!place) savePlace(EXAMPLE_PLACE)
  const ok = await ensureNormals()
  await refreshForecast()
  renderAll()
  state.booted = true
  if (ok) status(`Frost dates ready for ${state.place.label}.`)
  else status('Set your location to compute frost dates.', false)
}

boot()
