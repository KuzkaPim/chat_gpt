import { Container } from '@/src/shared/ui';
import TextareaAutosize from 'react-textarea-autosize';
import { Mic, Send, Square } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import { ChatStatus } from 'ai';
import { cn } from '@/src/shared/lib';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import Link from 'next/link';

interface FormProps {
  listening: boolean;
  transcript: string;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  status: ChatStatus;
  sendMessage: (message: { text: string }, token?: string) => void;
  setTaHeight: Dispatch<SetStateAction<number>>;
  stop: () => Promise<void>;
}

export const Form = ({
  listening,
  transcript,
  resetTranscript,
  browserSupportsSpeechRecognition,
  status,
  sendMessage,
  setTaHeight,
  stop,
}: FormProps) => {
  const [input, setInput] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const isLoading = status === 'submitted' || status === 'streaming';

  const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!SITE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing in .env');
    }
  }

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'ru-RU' });
    }
  };

  const stopRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
  };

  const handleSend = (e?: React.SubmitEvent) => {
    e?.preventDefault();

    if (!input.trim() || !token) return;

    stopRecording();
    sendMessage({ text: input }, token);

    setInput('');
    resetTranscript();
    turnstileRef.current?.reset();
  };

  useEffect(() => {
    if (transcript) {
      const timer = setTimeout(() => {
        setInput(transcript);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [transcript]);

  return (
    <section className="fixed bottom-2 w-full">
      <Container>
        <form className="flex gap-1.5 sm:gap-2 items-end" onSubmit={handleSend}>
          {browserSupportsSpeechRecognition && (
            <button
              type="button"
              aria-label="Голосовой ввод"
              onClick={toggleRecording}
              disabled={isLoading}
              className="size-12 flex bg-content-primary hover:bg-content-primary/90 justify-center items-center rounded-2xl transition active:scale-95 outline-none focus:ring focus:ring-primary"
            >
              <Mic
                className={`${listening ? 'text-accent animate-pulse' : 'text-primary'}`}
                size={22}
              />
            </button>
          )}

          <TextareaAutosize
            minRows={1}
            maxRows={6}
            className="flex-1 box-border min-h-12 p-3 max-h-32 bg-content-primary border-none rounded-2xl text-primary transition placeholder:text-primary/60 resize-none text-md outline-none focus:ring focus:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сообщение..."
            disabled={isLoading}
            onFocus={stopRecording}
            onHeightChange={(h) => setTaHeight(h)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="relative flex justify-center items-center">
            <button
              type="button"
              aria-label="Остановить генерацию"
              onClick={stop}
              className={cn(
                'z-0 scale-0 absolute size-10 flex justify-center items-center bg-content-primary hover:bg-content-primary/90 text-primary rounded-xl transition active:scale-95 disabled:opacity-60 outline-none focus:ring focus:ring-primary duration-250',
                isLoading && 'translate-y-[-125%] scale-100'
              )}
            >
              <Square size={22} />
            </button>
            <button
              type="submit"
              aria-label="Отправить сообщение"
              disabled={isLoading || !input.trim() || !token}
              className="z-10 size-12 flex justify-center items-center pr-0.5 bg-content-primary hover:bg-content-primary/90 text-primary rounded-2xl transition active:scale-95 disabled:opacity-60 outline-none focus:ring focus:ring-primary"
            >
              <Send
                size={22}
                className={cn(
                  !token && input.trim() && 'animate-pulse opacity-50'
                )}
              />
            </button>
          </div>

          <div className="hidden">
            <Turnstile
              ref={turnstileRef}
              siteKey={SITE_KEY || ''}
              onSuccess={(t) => setToken(t)}
              onExpire={() => setToken(null)}
              onError={() => setToken(null)}
              options={{
                action: 'submit-chat',
                size: 'invisible',
              }}
            />
          </div>
        </form>
        <div className="text-center text-[10px] sm:text-xs text-content-primary mt-2 pb-1 opacity-60">
          Protected by Cloudflare Turnstile.{' '}
          <Link
            href="/privacy"
            className="underline hover:text-content-primary/80 transition-colors"
          >
            Privacy
          </Link>{' '}
          •{' '}
          <Link
            href="/terms"
            className="underline hover:text-content-primary/80 transition-colors"
          >
            Terms
          </Link>
          . AI can make mistakes.
        </div>
      </Container>
    </section>
  );
};
