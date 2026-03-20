import enTranslations from './en.json';
import esTranslations from './es.json';

export type Locale = 'es' | 'en';
export type TranslationKey = keyof typeof enTranslations;

const translations: Record<Locale, typeof enTranslations> = {
  en: enTranslations,
  es: esTranslations as typeof enTranslations,
};

export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    return translations[locale]?.[key] ?? translations['es'][key] ?? key;
  };
}

export interface ContactFormTranslations {
  labels: {
    name: string;
    email: string;
    eventType: string;
    message: string;
  };
  placeholders: {
    eventType: string;
  };
  events: string[];
  errors: {
    name: string;
    emailRequired: string;
    emailInvalid: string;
    eventType: string;
    message: string;
  };
  success: {
    heading: string;
    text: string;
  };
  submitError: string;
  sending: string;
  submit: string;
}

export interface LightboxAriaLabels {
  close: string;
  prev: string;
  next: string;
}

export function getContactFormTranslations(
  t: ReturnType<typeof useTranslations>
): ContactFormTranslations {
  return {
    labels: {
      name: t('form.name'),
      email: t('form.email'),
      eventType: t('form.eventType'),
      message: t('form.message'),
    },
    placeholders: {
      eventType: t('form.select'),
    },
    events: [
      t('form.events.wedding'),
      t('form.events.corporate'),
      t('form.events.party'),
      t('form.events.photo'),
      t('form.events.other'),
    ],
    errors: {
      name: t('form.error.name'),
      emailRequired: t('form.error.email.required'),
      emailInvalid: t('form.error.email.invalid'),
      eventType: t('form.error.eventType'),
      message: t('form.error.message'),
    },
    success: {
      heading: t('form.success.heading'),
      text: t('form.success.text'),
    },
    submitError: t('form.error.submit'),
    sending: t('form.sending'),
    submit: t('form.submit'),
  };
}

export function getLightboxAriaLabels(
  t: ReturnType<typeof useTranslations>
): LightboxAriaLabels {
  return {
    close: t('lightbox.close'),
    prev: t('lightbox.prev'),
    next: t('lightbox.next'),
  };
}
