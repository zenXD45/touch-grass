let engine = null

export function webgpuAvailable() {
  return typeof navigator !== 'undefined' && !!navigator.gpu
}

export function modelLoaded() {
  return !!engine
}

export async function loadModel(modelId, onProgress) {
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
  engine = await CreateMLCEngine(modelId, {
    initProgressCallback: (r) => onProgress(r.progress ?? 0, r.text ?? ''),
  })
  return engine
}

export async function ask(question, system, onChunk) {
  if (!engine) throw new Error('model-not-loaded')
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: question },
  ]
  const stream = await engine.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.4,
    max_tokens: 700,
  })
  let acc = ''
  for await (const part of stream) {
    const delta = part.choices?.[0]?.delta?.content || ''
    if (delta) {
      acc += delta
      onChunk(acc)
    }
  }
  return acc
}
