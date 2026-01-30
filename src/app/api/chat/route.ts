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
    const { messages, token }: { messages: UIMessage[]; token: string } =
      await req.json();

    const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is missing in environment variables');
      return new Response('Server configuration error', { status: 500 });
    }

    if (token) {
      const forwardedFor = req.headers.get('x-forwarded-for');
      const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

      const formData = new FormData();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', token);
      formData.append('remoteip', ip);

      const result = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          body: formData,
          method: 'POST',
        }
      );

      const outcome = await result.json();
      if (!outcome.success) {
        return new Response('Captcha verification failed', { status: 403 });
      }
    } else {
      return new Response('Captcha token required', { status: 403 });
    }

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
