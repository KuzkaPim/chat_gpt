'use client';

import dynamic from 'next/dynamic';

import { useChat } from '@ai-sdk/react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { ChatClient, FormSkeleton, Promo } from './sections';
import { useState } from 'react';

const Form = dynamic(() => import('./sections').then((m) => m.Form), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

export const Chat = () => {
  const { messages, sendMessage, status } = useChat();
  const [taHeight, setTaHeight] = useState(44);
  const [isChatting, setIsChatting] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const isLoading = status === 'submitted' || status === 'streaming';

  const submitMessage = (message: { text: string }) => {
    setIsChatting(true);
    sendMessage(message);
  };

  return (
    <>
      <Promo isChatting={isChatting} />
      <ChatClient
        messages={messages}
        isLoading={isLoading}
        taHeight={taHeight}
        isChatting={isChatting}
      />
      <Form
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        isLoading={isLoading}
        sendMessage={submitMessage}
        setTaHeight={setTaHeight}
      />
    </>
  );
};
