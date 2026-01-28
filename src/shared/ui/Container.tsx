import { cn } from '../lib';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn(
        'max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-2 sm:px-0',
        className
      )}
    >
      {children}
    </div>
  );
};
