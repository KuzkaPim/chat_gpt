'use client';

import { cn } from '@/src/shared/lib';
import { Container } from '@/src/shared/ui';
import { ChatStatus, UIDataTypes, UIMessage, UITools } from 'ai';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatClientProps {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  status: ChatStatus;
  taHeight: number;
  isChatting: boolean;
  error: Error | undefined;
}

export const ChatClient = ({
  messages,
  status,
  taHeight,
  isChatting,
  error,
}: ChatClientProps) => {
  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <section
      className={cn(
        'min-h-screen scale-0 pt-2 transition duration-250 origin-top-right',
        isChatting && 'scale-100'
      )}
      style={{ paddingBottom: `${Math.min(taHeight, 128) + 16}px` }}
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
                part.type === 'text' ? (
                  <div
                    key={i}
                    className="text-inherit prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-li:text-inherit prose-code:text-inherit marker:text-inherit"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        code({ inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-lg mt-2! mb-2!"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              {...props}
                              className={cn(
                                className,
                                'bg-black/10 px-1 py-0.5 rounded font-mono text-[0.9em]'
                              )}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  </div>
                ) : null
              )}
            </li>
          ))}
          {isLoading && (
            <div className="text-xs text-content-primary animate-pulse font-medium">
              Печатает...
            </div>
          )}
          {status === 'error' && error && (
            <div className="p-3.5 rounded-2xl text-sm bg-content-primary text-primary mr-auto max-w-[85%] rounded-bl-sm">
              <div className="text-xs opacity-70 mb-1 text-accent font-bold uppercase">
                Ошибка
              </div>
              {error.message || 'Произошла неизвестная ошибка.'}
            </div>
          )}
        </ul>
      </Container>
    </section>
  );
};
