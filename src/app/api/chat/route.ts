import {
  streamText,
  UIMessage,
  convertToModelMessages,
  NoSuchToolError,
  InvalidToolInputError,
  APICallError,
} from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai('gpt-4.1-nano'),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error('Error during streaming:', error);
        if (NoSuchToolError.isInstance(error)) {
          return 'Модель попыталась использовать несуществующий инструмент.';
        } else if (InvalidToolInputError.isInstance(error)) {
          return 'Модель предоставила неверные входные данные для инструмента.';
        } else if (APICallError.isInstance(error)) {
          return `Ошибка API`;
        } else if (typeof error === 'object') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const type = (error as any).error?.type;
          if (type === 'insufficient_quota') {
            return 'Недостаточно средств на аккаунте для выполнения запроса.';
          } else {
            return 'Произошла неизвестная ошибка.';
          }
        } else {
          return 'Произошла неизвестная ошибка.';
        }
      },
    });
  } catch (error) {
    console.error('Error in /api/chat route:', error);

    return new Response('Ошибка сервера. Попробуйте позже.', { status: 500 });
  }
}
