import { ChatPromptTemplate, SystemMessagePromptTemplate, } from '@langchain/core/prompts';
export const summarizePostPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`次の文章を日本語で要約してください。
条件:
- 箇条書きで3〜6項目
- 重要な固有名詞と数値は残す
- 冗長な前置きは不要

本文:
{post}`),
]);
