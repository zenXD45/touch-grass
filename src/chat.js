let engine = null

const SHADER_F16_FALLBACKS = {
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
  'SmolLM2-360M-Instruct-q4f16_1-MLC': 'SmolLM2-360M-Instruct-q4f32_1-MLC',
}

export function webgpuAvailable() {
  return typeof navigator !== 'undefined' && !!navigator.gpu
}

export function modelLoaded() {
  return !!engine
}

export async function loadModel(modelId, onProgress, onFallback = () => {}) {
  const adapter = await navigator.gpu?.requestAdapter()
  if (!adapter) {
    throw new Error('This browser could not create a WebGPU adapter. Check chrome://gpu and restart the browser.')
  }

  let compatibleModelId = modelId
  if (!adapter.features.has('shader-f16')) {
    compatibleModelId = SHADER_F16_FALLBACKS[modelId] || modelId
    if (compatibleModelId !== modelId) onFallback(compatibleModelId)
  }

  const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
  engine = await CreateMLCEngine(compatibleModelId, {
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
