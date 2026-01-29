import { Container } from '@/src/shared/ui';
import TextareaAutosize from 'react-textarea-autosize';
import { Mic, Send, Square } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import { ChatStatus } from 'ai';
import { cn } from '@/src/shared/lib';

interface FormProps {
  listening: boolean;
  transcript: string;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  status: ChatStatus;
  sendMessage: (message: { text: string }) => void;
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
  const isLoading = status === 'submitted' || status === 'streaming';

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

    if (!input.trim()) return;

    stopRecording();
    sendMessage({ text: input });

    setInput('');
    resetTranscript();
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
              onClick={toggleRecording}
              disabled={isLoading}
              className="size-11 flex bg-content-primary hover:bg-content-primary/90 justify-center items-center rounded-2xl transition active:scale-95 outline-none focus:ring focus:ring-primary"
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
            className="flex-1 box-border min-h-11 p-3 max-h-32 bg-content-primary border-none rounded-2xl text-primary transition placeholder:text-primary/60 resize-none text-sm outline-none focus:ring focus:ring-primary"
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
              onClick={stop}
              className={cn(
                'z-0 scale-0 absolute size-9 flex justify-center items-center bg-content-primary hover:bg-content-primary/90 text-primary rounded-xl transition active:scale-95 disabled:opacity-60 outline-none focus:ring focus:ring-primary duration-250',
                isLoading && 'translate-y-[-125%] scale-100'
              )}
            >
              <Square size={22} />
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="z-10 size-11 flex justify-center items-center pr-0.5 bg-content-primary hover:bg-content-primary/90 text-primary rounded-2xl transition active:scale-95 disabled:opacity-60 outline-none focus:ring focus:ring-primary"
            >
              <Send size={22} />
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
};
