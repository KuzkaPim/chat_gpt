'use client';

import { Container } from '@/src/shared/ui';
import { UIDataTypes, UIMessage, UITools } from 'ai';

interface ChatClientProps {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  isLoading: boolean;
}

export const ChatClient = ({ messages, isLoading }: ChatClientProps) => {
  return (
    <section>
      <Container className="flex flex-col min-h-screen py-2">
        <div className="flex-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`whitespace-pre-wrap p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto max-w-[85%] rounded-br-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 mr-auto max-w-[85%] rounded-bl-sm'
              }`}
            >
              <div className="text-[10px] opacity-70 mb-1 font-bold uppercase tracking-wider">
                {message.role === 'user' ? 'Вы' : 'AI'}
              </div>
              {message.parts.map((part, i) =>
                part.type === 'text' ? <div key={i}>{part.text}</div> : null
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-xs text-zinc-400 pl-4 animate-pulse font-medium">
              Печатает...
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
