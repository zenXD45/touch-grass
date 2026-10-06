const CACHE_PREFIX = 'gardenwise:frost:v1:'
const NORMALS_TTL = 180 * 24 * 60 * 60 * 1000
const FORECAST_TTL = 6 * 60 * 60 * 1000

const CLIMATE_URL = 'https://climate-api.open-meteo.com/v1/climate'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export function pad(n) {
  return String(n).padStart(2, '0')
}

export function toMMDD(date) {
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromMMDD(mmdd, year) {
  const [m, d] = mmdd.split('-').map(Number)
  return new Date(year, m - 1, d)
}

export function addDays(date, n) {
  const out = new Date(date)
  out.setDate(out.getDate() + n)
  return out
}

export function weekStart(date) {
  const out = new Date(date)
  const day = (out.getDay() + 6) % 7
  out.setDate(out.getDate() - day)
  out.setHours(0, 0, 0, 0)
  return out
}

export function fmtDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function weekKey(start) {
  return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function loadNormals(lat, lon) {
  const hit = readJSON(`${CACHE_PREFIX}n:${lat.toFixed(3)},${lon.toFixed(3)}`)
  if (hit && Date.now() - hit.fetchedAt < NORMALS_TTL) return hit
  return null
}

export function saveNormals(lat, lon, data) {
  writeJSON(`${CACHE_PREFIX}n:${lat.toFixed(3)},${lon.toFixed(3)}`, data)
}

export function loadForecast(lat, lon) {
  const hit = readJSON(`${CACHE_PREFIX}f:${lat.toFixed(3)},${lon.toFixed(3)}`)
  if (hit && Date.now() - hit.fetchedAt < FORECAST_TTL) return hit
  return null
}

export function saveForecast(lat, lon, data) {
  writeJSON(`${CACHE_PREFIX}f:${lat.toFixed(3)},${lon.toFixed(3)}`, data)
}

function crossingsForYear(times, mins, year) {
  let lastSpring = null
  let firstFall = null
  for (let i = 0; i < times.length; i++) {
    const t = mins[i]
    if (t == null || t > 0) continue
    const date = new Date(times[i] + 'T00:00:00')
    if (date.getFullYear() !== year) continue
    const month = date.getMonth()
    if (month <= 5) lastSpring = date
    if (month >= 6 && !firstFall) firstFall = date
  }
  return { lastSpring, firstFall }
}

export async function fetchNormals(lat, lon) {
  const endYear = new Date().getFullYear() - 1
  const startYear = endYear - 5
  const url = `${CLIMATE_URL}?latitude=${lat}&longitude=${lon}&start_date=${startYear}-01-01&end_date=${endYear}-12-31&daily=temperature_2m_min&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`climate api ${res.status}`)
  const json = await res.json()
  const times = json.daily.time
  const mins = json.daily.temperature_2m_min
  const springs = []
  const falls = []
  for (let year = startYear; year <= endYear; year++) {
    const { lastSpring, firstFall } = crossingsForYear(times, mins, year)
    if (lastSpring) springs.push(lastSpring)
    if (firstFall) falls.push(firstFall)
  }
  const avg = (list) => {
    if (!list.length) return null
    const sum = list.reduce((acc, d) => acc + (d.getMonth() * 31 + d.getDate()), 0)
    const avgVal = Math.round(sum / list.length)
    const month = Math.min(11, Math.floor(avgVal / 31))
    const day = Math.max(1, avgVal - month * 31)
    return `${pad(month + 1)}-${pad(day)}`
  }
  const last = avg(springs)
  const first = avg(falls)
  return {
    lat,
    lon,
    last,
    first,
    noFrost: springs.length < 2 && falls.length < 2,
    years: springs.length,
    source: 'Open-Meteo climate API',
    fetchedAt: Date.now(),
  }
}

export async function fetchForecast(lat, lon) {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min&forecast_days=7&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`forecast api ${res.status}`)
  const json = await res.json()
  const times = json.daily.time
  const mins = json.daily.temperature_2m_min
  const cold = []
  for (let i = 0; i < times.length; i++) {
    const t = mins[i]
    if (t == null || t > 2) continue
    cold.push({ date: times[i], min: Math.round(t * 10) / 10 })
  }
  return { lat, lon, cold, fetchedAt: Date.now() }
}

export function loadPlace() {
  return readJSON(`${CACHE_PREFIX}place`)
}

export function savePlace(place) {
  writeJSON(`${CACHE_PREFIX}place`, place)
}

export function loadManual() {
  return readJSON(`${CACHE_PREFIX}manual`)
}

export function saveManual(manual) {
  writeJSON(`${CACHE_PREFIX}manual`, manual)
}

export function loadChecks() {
  return readJSON(`${CACHE_PREFIX}checks`) || {}
}

export function saveChecks(checks) {
  writeJSON(`${CACHE_PREFIX}checks`, checks)
}
