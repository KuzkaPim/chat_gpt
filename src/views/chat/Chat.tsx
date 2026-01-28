'use client';

import { useChat } from '@ai-sdk/react';
import dynamic from 'next/dynamic';
import { useSpeechRecognition } from 'react-speech-recognition';
import { ChatClient } from './sections';

const Form = dynamic(() => import('./sections').then((m) => m.Form), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Загрузка...</div>,
});

export const Chat = () => {
  const { messages, sendMessage, status } = useChat();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <>
      <ChatClient messages={messages} isLoading={isLoading} />
      <Form
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        isLoading={isLoading}
        sendMessage={sendMessage}
      />
    </>
  );
};
