import 'dotenv/config'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { FakeListChatModel } from '@langchain/core/utils/testing'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

// LLM provider 定義
type LLMProvider = 'fake' | 'google'

// llm model configuration
const LLM_PROVIDER = process.env.LLM_PROVIDER ?? 'fake'

const LLM_MODELS: Record<LLMProvider, string> = {
  fake: 'fake-model',
  google: process.env.GOOGLE_API_MODEL ?? 'gemini-2.5-flash-lite',
}

const LLM_API_KEYS: Record<LLMProvider, string | undefined> = {
  fake: undefined,
  google: process.env.GOOGLE_API_KEY,
}

// 現在の設定から使用するLangChain LLM モデルの取得
export function getLangChainLLMConfig() {
  const provider = LLM_PROVIDER as LLMProvider
  const model = LLM_MODELS[provider]
  const apiKey = LLM_API_KEYS[provider]
  let llm: BaseChatModel

  if (!(LLM_PROVIDER in LLM_MODELS)) {
    throw new Error(
      `Unsupported LLM provider: ${LLM_PROVIDER}. Supported providers are: ${Object.keys(LLM_MODELS).join(', ')}`,
    )
  } else if (!(LLM_PROVIDER in LLM_API_KEYS)) {
    throw new Error(`API key for ${LLM_PROVIDER} is not configured properly`)
  } else if (LLM_PROVIDER !== 'fake' && !apiKey) {
    throw new Error(`API key for ${LLM_PROVIDER} is not set`)
  }

  if (LLM_PROVIDER === 'google') {
    llm = new ChatGoogleGenerativeAI({
      model,
      apiKey,
    })
  } else {
    // デフォルトのフェイクモデル設定
    llm = new FakeListChatModel({ responses: ['This is a fake response.'] })
  }

  return llm
}

export const llm = getLangChainLLMConfig()
