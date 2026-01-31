'use client';

import dynamic from 'next/dynamic';

import { useChat } from '@ai-sdk/react';
import { FormSkeleton, Promo } from './sections';
import { useState } from 'react';

const Form = dynamic(() => import('./sections').then((m) => m.Form), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

const ChatClient = dynamic(
  () => import('./sections').then((m) => m.ChatClient),
  {
    ssr: false,
  }
);

export const Chat = () => {
  const { messages, sendMessage, status, error, stop } = useChat();
  const [taHeight, setTaHeight] = useState(48);
  const [isChatting, setIsChatting] = useState(false);

  const submitMessage = (message: { text: string }, token?: string) => {
    setIsChatting(true);
    sendMessage(message, { body: { token } });
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
        status={status}
        sendMessage={submitMessage}
        setTaHeight={setTaHeight}
        stop={stop}
      />
    </>
  );
};
