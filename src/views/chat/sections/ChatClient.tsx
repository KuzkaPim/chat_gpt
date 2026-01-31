'use client';

import { cn } from '@/src/shared/lib';
import { Container } from '@/src/shared/ui';
import { ChatStatus, UIDataTypes, UIMessage, UITools } from 'ai';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ChatClientProps {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  status: ChatStatus;
  taHeight: number;
  isChatting: boolean;
  error: Error | undefined;
}

const CopyButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-1.5 rounded-lg transition hover:bg-black/10 text-inherit outline-none',
        className
      )}
      aria-label="Копировать"
    >
      {isCopied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
};

const CodeBlock = ({
  language,
  children,
  ...props
}: {
  language: string;
  children: React.ReactNode;
}) => {
  const codeText = String(children).replace(/\n$/, '');

  return (
    <div className="relative rounded-lg overflow-hidden mt-2! mb-2!">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton
          text={codeText}
          className="bg-black/20 hover:bg-black/30 text-white opacity-100"
        />
      </div>
      <SyntaxHighlighter
        {...props}
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="m-0! rounded-lg"
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
};

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
        'min-h-dvh scale-0 pt-2 transition duration-250 origin-top-right pb-[calc(var(--ta-height)+52px)] sm:pb-[calc(var(--ta-height)+40px)]',
        isChatting && 'scale-100'
      )}
      style={
        {
          '--ta-height': `${Math.min(taHeight, 128)}px`,
        } as React.CSSProperties
      }
    >
      <Container className="flex flex-col">
        <ul className="flex-1 flex flex-col gap-2">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`group relative p-3.5 rounded-2xl text-sm ${
                message.role === 'user'
                  ? 'bg-secondary text-content-primary ml-auto min-w-[40%] sm:min-w-[30%] md:min-w-[20%] lg:min-w-[15%] max-w-[85%] rounded-br-sm'
                  : 'bg-content-primary text-primary mr-auto min-w-[15%] sm:min-w-[30%] md:min-w-[20%] lg:min-w-[15%] max-w-[85%] rounded-bl-sm'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs opacity-70 font-bold uppercase">
                  {message.role === 'user' ? 'Вы' : 'AI'}
                </div>
                <CopyButton
                  text={message.parts
                    .filter((p) => p.type === 'text')
                    .map((p) => (p as { text: string }).text)
                    .join('')}
                />
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
                            <CodeBlock language={match[1]} {...props}>
                              {children}
                            </CodeBlock>
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        table({ children, ...props }: any) {
                          return (
                            <div className="overflow-x-auto my-4 max-w-full">
                              <table
                                {...props}
                                className="w-full border-collapse"
                              >
                                {children}
                              </table>
                            </div>
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
