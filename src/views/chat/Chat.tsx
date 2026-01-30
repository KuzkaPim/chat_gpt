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
  const { messages, sendMessage, status, error, stop } = useChat();
  const [taHeight, setTaHeight] = useState(48);
  const [isChatting, setIsChatting] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const submitMessage = (message: { text: string }) => {
    setIsChatting(true);
    sendMessage(message);
  };

  return (
    <>
      <Promo isChatting={isChatting} />
      <ChatClient
        messages={messages}
        status={status}
        taHeight={taHeight}
        isChatting={isChatting}
        error={error}
      />
      <Form
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        status={status}
        sendMessage={submitMessage}
        setTaHeight={setTaHeight}
        stop={stop}
      />
    </>
  );
};
