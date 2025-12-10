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
    // 最新のモデルを使用: gemini-1.5-flash (高速で無料枠が大きい)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    const errorMessage = error instanceof Error ? error.message : String(error);

    // より詳細なエラー情報をログ出力
    console.error('Error details:', errorMessage);

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key not valid') || errorMessage.includes('API key expired')) {
      throw new Error('APIキーが無効です。Google AI Studioで新しいキーを取得してください。');
    } else if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('quota')) {
      throw new Error('APIの使用制限に達しました。しばらくしてから再度お試しください。');
    } else if (errorMessage.includes('NETWORK_ERROR') || errorMessage.includes('fetch')) {
      throw new Error('ネットワークエラーが発生しました。接続を確認してください。');
    } else {
      // 元のエラーメッセージを含める（デバッグ用）
      throw new Error(`メッセージの送信に失敗しました: ${errorMessage}`);
    }
  }
}
