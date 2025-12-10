import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessageToGemini(
  apiKey: string,
  messages: Message[]
): Promise<string> {
  try {
    // Gemini SDK初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 最新のユーザーメッセージを取得
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // API呼び出し
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);

    // エラーメッセージのカスタマイズ
    const errorMessage = error instanceof Error ? error.message : '';

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key not valid')) {
      throw new Error('APIキーが無効です。設定を確認してください。');
    } else if (errorMessage.includes('QUOTA_EXCEEDED')) {
      throw new Error('APIの使用制限に達しました。しばらくしてから再度お試しください。');
    } else if (errorMessage.includes('NETWORK_ERROR')) {
      throw new Error('ネットワークエラーが発生しました。接続を確認してください。');
    } else {
      throw new Error('メッセージの送信に失敗しました。');
    }
  }
}
