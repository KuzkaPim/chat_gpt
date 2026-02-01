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

import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { messages, token }: { messages: UIMessage[]; token?: string } =
      await req.json();

    const cookieStore = await cookies();
    const isVerified = cookieStore.get('cf-verified');

    if (!isVerified) {
      if (token) {
        const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

        if (!TURNSTILE_SECRET_KEY) {
          console.error(
            'TURNSTILE_SECRET_KEY is missing in environment variables'
          );
          return new Response('Ошибка конфигурации сервера.', { status: 500 });
        }

        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor
          ? forwardedFor.split(',')[0].trim()
          : '127.0.0.1';

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

        if (outcome.success) {
          // Set verification cookie for future requests
          cookieStore.set('cf-verified', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
          });
        } else {
          return new Response('Ошибка проверки безопасности.', {
            status: 403,
          });
        }
      } else {
        return new Response('Требуется проверка безопасности (Captcha).', {
          status: 403,
        });
      }
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
          return `Произошла ошибка при обращении к языковой модели. Попробуйте позже.`;
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
