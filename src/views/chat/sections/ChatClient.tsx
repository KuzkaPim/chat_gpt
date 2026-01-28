'use client';

import { Container } from '@/src/shared/ui';
import { UIDataTypes, UIMessage, UITools } from 'ai';

interface ChatClientProps {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  isLoading: boolean;
  taHeight: number;
}

export const ChatClient = ({
  messages,
  isLoading,
  taHeight,
}: ChatClientProps) => {
  return (
    <section
      className=" min-h-screen pt-2"
      style={{ paddingBottom: `${taHeight + 16}px` }}
    >
      <Container className="flex flex-col">
        <ul className="flex-1 flex flex-col gap-2">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`p-3.5 rounded-2xl text-sm ${
                message.role === 'user'
                  ? 'bg-secondary text-content-primary ml-auto max-w-[85%] rounded-br-sm'
                  : 'bg-content-primary text-primary mr-auto max-w-[85%] rounded-bl-sm'
              }`}
            >
              <div className="text-xs opacity-70 mb-1 font-bold uppercase">
                {message.role === 'user' ? 'Вы' : 'AI'}
              </div>
              {message.parts.map((part, i) =>
                part.type === 'text' ? <div key={i}>{part.text}</div> : null
              )}
            </li>
          ))}
          {isLoading && (
            <div className="text-xs text-content-primary animate-pulse font-medium">
              Печатает...
            </div>
          )}
        </ul>
      </Container>
    </section>
  );
};
