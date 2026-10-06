import plants from './plants.json'
import { addDays, fmtDate, fromMMDD, weekKey } from './frost.js'

export const GROUPS = [
  { id: 'protect', label: 'Protect tonight', icon: 'ph-snowflake' },
  { id: 'indoors', label: 'Start indoors', icon: 'ph-sprout' },
  { id: 'direct', label: 'Direct sow', icon: 'ph-shovel' },
  { id: 'transplant', label: 'Transplant out', icon: 'ph-arrows-left-right' },
]

export function allPlants() {
  return plants
}

function inWindow(date, start, end) {
  return date >= start && date <= end
}

function chipsFor(plant, extra = []) {
  const chips = [{ label: `${plant.dtm} days`, kind: 'flat' }]
  chips.push({ label: plant.sun === 'full' ? 'full sun' : 'part shade', kind: 'flat' })
  chips.push({ label: plant.spacing, kind: 'flat' })
  return [...extra.map((label) => ({ label, kind: 'flat' })), ...chips]
}

function springTasks(lastDate, week) {
  const out = []
  for (const p of plants) {
    if (p.indoors != null) {
      const t = addDays(lastDate, -p.indoors * 7)
      if (inWindow(t, week.start, week.end)) {
        out.push({
          id: `${week.key}:${p.id}:ind`,
          group: 'indoors',
          name: `Start ${p.name.toLowerCase()} indoors`,
          detail: p.note,
          chips: chipsFor(p, [`${fmtDate(t)} · ${p.indoors} wk before last frost`]),
        })
      }
    }
    if (p.direct) {
      const from = addDays(lastDate, p.direct[0] * 7)
      const to = addDays(lastDate, p.direct[1] * 7)
      if (week.start <= to && week.end >= from) {
        out.push({
          id: `${week.key}:${p.id}:dir`,
          group: 'direct',
          name: `Sow ${p.name.toLowerCase()}`,
          detail: p.note,
          chips: chipsFor(p, [`${fmtDate(from)} → ${fmtDate(to)} around last frost`]),
        })
      }
    }
    if (p.transplant != null) {
      const from = addDays(lastDate, p.transplant * 7)
      const to = addDays(lastDate, Math.max(0, p.transplant + 2) * 7)
      if (week.start <= to && week.end >= from) {
        out.push({
          id: `${week.key}:${p.id}:tr`,
          group: 'transplant',
          name: `Transplant ${p.name.toLowerCase()}`,
          detail: p.note,
          chips: chipsFor(p, [`${fmtDate(from)} → ${fmtDate(to)} after hardening off`]),
        })
      }
    }
  }
  return out
}

function fallTasks(firstDate, week) {
  const out = []
  for (const p of plants) {
    if (!p.hardy) continue
    if (p.indoors != null) {
      const t = addDays(firstDate, -p.indoors * 7)
      if (inWindow(t, week.start, week.end)) {
        out.push({
          id: `${week.key}:${p.id}:find`,
          group: 'indoors',
          name: `Start ${p.name.toLowerCase()} for fall`,
          detail: p.note,
          chips: chipsFor(p, [`${fmtDate(t)} · ${p.indoors} wk before first frost`]),
        })
      }
    }
    if (p.direct) {
      const from = addDays(firstDate, p.direct[0] * 7)
      const to = addDays(firstDate, p.direct[1] * 7)
      if (week.start <= to && week.end >= from) {
        out.push({
          id: `${week.key}:${p.id}:fdir`,
          group: 'direct',
          name: `Sow ${p.name.toLowerCase()} for fall`,
          detail: p.note,
          chips: chipsFor(p, [`${fmtDate(from)} → ${fmtDate(to)} around first frost`]),
        })
      }
    }
  }
  return out
}

function protectTasks(firstDate, forecast, week) {
  const nights = (forecast?.cold || []).filter((c) => {
    const d = new Date(c.date + 'T00:00:00')
    return inWindow(d, week.start, week.end)
  })
  if (!nights.length) return []
  const tender = plants.filter((p) => !p.hardy).slice(0, 6).map((p) => p.name.toLowerCase())
  return nights.map((n) => {
    const d = new Date(n.date + 'T00:00:00')
    return {
      id: `${week.key}:protect:${n.date}`,
      group: 'protect',
      name: `Cover tender crops, night of ${fmtDate(d)}`,
      detail: `Forecast low ${n.min} °C. Row cover or a bucket is enough; remove it in the morning.`,
      chips: [
        { label: `${n.min} °C forecast`, kind: 'frost' },
        { label: tender.slice(0, 4).join(', '), kind: 'flat' },
      ],
    }
  })
}

export function buildPlan({ last, first, forecast }, week) {
  const year = new Date().getFullYear()
  const tasks = []
  if (last) tasks.push(...springTasks(fromMMDD(last, year), week))
  if (first) tasks.push(...fallTasks(fromMMDD(first, year), week))
  tasks.push(...protectTasks(first ? fromMMDD(first, year) : null, forecast, week))
  const groups = GROUPS.map((g) => ({ ...g, tasks: tasks.filter((t) => t.group === g.id) })).filter(
    (g) => g.tasks.length > 0,
  )
  return groups
}

export function makeWeek(offset = 0) {
  const now = new Date()
  const start = addDays(startOfWeek(now), offset * 7)
  const end = addDays(start, 6)
  return { start, end, key: weekKey(start) }
}

function startOfWeek(date) {
  const out = new Date(date)
  const day = (out.getDay() + 6) % 7
  out.setDate(out.getDate() - day)
  out.setHours(0, 0, 0, 0)
  return out
}

export function summarize(groups) {
  const count = groups.reduce((n, g) => n + g.tasks.length, 0)
  return count
}
