import { Container } from '@/src/shared/ui';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <Container className="py-8 sm:py-12 px-4 sm:px-0 prose prose-sm sm:prose-base prose-invert max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-bold leading-tight">
        Политика конфиденциальности (Privacy Policy)
      </h1>
      <p className="text-sm opacity-70">
        Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
      </p>

      <h2>1. Сбор данных</h2>
      <p>Мы уважаем вашу конфиденциальность. Данный демонстрационный проект:</p>
      <ul>
        <li>
          <strong>НЕ</strong> сохраняет историю ваших сообщений в базе данных
          (чат существует только в рамках текущей сессии).
        </li>
        <li>
          <strong>НЕ</strong> требует регистрации или создания учетной записи.
        </li>
        <li>
          <strong>НЕ</strong> осуществляет отслеживание пользователей в
          рекламных целях.
        </li>
      </ul>

      <h2>2. Сторонние сервисы</h2>
      <p>
        Для обеспечения работы сервиса мы передаем минимально необходимые данные
        следующим партнерам:
      </p>

      <h3>OpenAI (LLM Provider)</h3>
      <p>
        Ваши текстовые сообщения отправляются в OpenAI через API исключительно
        для генерации ответов.
      </p>
      <div className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10 text-xs sm:text-sm wrap-break-word">
        <strong>Важно:</strong> Пожалуйста, не отправляйте в чат личные данные,
        пароли или финансовую информацию. Хотя мы не сохраняем историю, данные
        обрабатываются на серверах OpenAI в соответствии с их
        <a
          href="https://openai.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          Политикой конфиденциальности
        </a>
        .
      </div>

      <h3>Cloudflare Turnstile (Security)</h3>
      <p>
        Для защиты от спама и DDoS-атак мы используем сервис Cloudflare
        Turnstile. Этот сервис может анализировать технические параметры вашего
        устройства (например, IP-адрес, версия браузера) для проверки того, что
        вы — человек. Использование регулируется{' '}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Политикой конфиденциальности Cloudflare
        </a>
        .
      </p>

      <h3>Хостинг-провайдер (Vercel)</h3>
      <p>
        Сайт размещен на платформе Vercel. Провайдер может временно сохранять
        технические логи (Access Logs) с IP-адресами для диагностики сбоев и
        защиты от кибератак.
      </p>

      <h2>3. Cookies и Локальное хранилище</h2>
      <p>
        Мы используем технологии локального хранения (LocalStorage) и файлы
        Cookie только для технических нужд, например:
      </p>
      <ul>
        <li>Сохранение выбранной темы оформления (светлая/темная).</li>
        <li>
          Временное хранение токена проверки Turnstile (для предотвращения
          повторных проверок).
        </li>
      </ul>

      <h2>4. Контакты</h2>
      <p>
        Если у вас есть вопросы касательно работы сайта, вы можете связаться с
        автором через GitHub или форму обратной связи.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <Link
          href="/"
          className="text-content-primary hover:text-content-primary/80 no-underline"
        >
          &larr; Вернуться к чату
        </Link>
      </div>
    </Container>
  );
}
