import { Container } from '@/src/shared/ui';

export const FormSkeleton = () => {
  return (
    <section className="fixed bottom-2 w-full">
      <Container className="flex gap-2 animate-pulse">
        <div className="bg-content-primary rounded-2xl size-11"></div>
        <div className="bg-content-primary rounded-2xl h-11 flex-1" />
        <div className="bg-content-primary rounded-2xl size-11 opacity-60"></div>
      </Container>
    </section>
  );
};
