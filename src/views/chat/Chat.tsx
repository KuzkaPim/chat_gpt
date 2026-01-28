'use client';

import dynamic from 'next/dynamic';

import { useChat } from '@ai-sdk/react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { ChatClient, FormSkeleton } from './sections';
import { useState } from 'react';

const Form = dynamic(() => import('./sections').then((m) => m.Form), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

export const Chat = () => {
  const { messages, sendMessage, status } = useChat();
  const [taHeight, setTaHeight] = useState(44);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <>
      <ChatClient
        messages={messages}
        isLoading={isLoading}
        taHeight={taHeight}
      />
      <Form
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        isLoading={isLoading}
        sendMessage={sendMessage}
        setTaHeight={setTaHeight}
      />
    </>
  );
};
