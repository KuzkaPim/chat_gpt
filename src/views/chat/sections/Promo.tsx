import { cn } from '@/src/shared/lib';
import { Container } from '@/src/shared/ui';

interface PromoProps {
  isChatting: boolean;
}

export const Promo = ({ isChatting }: PromoProps) => {
  return (
    <section
      className={cn(
        'absolute w-full pt-2 pb-22 min-h-dvh flex items-center transition duration-250 origin-top-left',
        isChatting && 'scale-0 pointer-events-none'
      )}
    >
      <Container className="relative text-content-primary text-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div
            className="w-50 h-50 rounded-full blur-[160px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(239,68,68,1) 0%, rgba(239,68,68,1) 40%)',
            }}
          />
        </div>

        <div className="relative z-10">
          <h1 className="font-bold text-xl sm:text-3xl">Привет!</h1>
          <p className="font-bold text-3xl sm:text-5xl mt-4">
            Что бы вы хотели узнать?
          </p>
          <p className="opacity-60 max-w-120 text-sm sm:text-lg mx-auto mt-4">
            Используйте один из наиболее распространенных запросов ниже или
            задайте свой собственный вопрос.
          </p>
        </div>
      </Container>
    </section>
  );
};
