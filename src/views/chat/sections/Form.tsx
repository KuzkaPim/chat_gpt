import { Container } from '@/src/shared/ui';
import TextareaAutosize from 'react-textarea-autosize';
import { Mic, Send } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SpeechRecognition from 'react-speech-recognition';

interface FormProps {
  listening: boolean;
  transcript: string;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  isLoading: boolean;
  sendMessage: (message: { text: string }) => void;
  setTaHeight: Dispatch<SetStateAction<number>>;
}

export const Form = ({
  listening,
  transcript,
  resetTranscript,
  browserSupportsSpeechRecognition,
  isLoading,
  sendMessage,
  setTaHeight,
}: FormProps) => {
  const [input, setInput] = useState('');

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

    stopRecording();
    if (!input.trim()) return;

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

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 text-red-500">
        Ваш браузер не поддерживает голосовой ввод. Попробуйте Chrome.
      </div>
    );
  }

  return (
    <section className="fixed bottom-2 w-full">
      <Container>
        <form className="flex gap-1.5 sm:gap-2 items-end" onSubmit={handleSend}>
          <button
            type="button"
            onClick={toggleRecording}
            className="size-11 flex bg-content-primary hover:bg-content-primary/90 justify-center items-center rounded-2xl transition active:scale-95 outline-none focus:ring focus:ring-primary"
          >
            <Mic
              className={`${listening ? 'text-accent animate-pulse' : 'text-secondary'}`}
              size={22}
            />
          </button>

          <TextareaAutosize
            minRows={1}
            maxRows={6}
            className="flex-1 box-border min-h-11 p-3 max-h-32 bg-content-primary border-none rounded-2xl transition placeholder:text-zinc-400 resize-none text-sm outline-none focus:ring focus:ring-primary"
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

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="size-11 flex justify-center items-center pr-0.5 bg-content-primary hover:bg-content-primary/90 text-secondary rounded-2xl transition active:scale-95 disabled:opacity-60 outline-none focus:ring focus:ring-primary"
          >
            <Send size={22} />
          </button>
        </form>
      </Container>
    </section>
  );
};
