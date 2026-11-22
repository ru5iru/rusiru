import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from '@/pages/NotFound';
import { I18nProvider } from '@/i18n/i18n';
import en from '@/locales/en.json';

afterEach(cleanup);

describe('rendered route metadata', () => {
  it('uses the localized error description for standard and social metadata', async () => {
    render(
      <HelmetProvider>
        <I18nProvider>
          <NotFound />
        </I18nProvider>
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.head.querySelector('meta[property="og:description"]')).toHaveAttribute('content', en.notFound.description);
    });
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute('content', en.notFound.description);
    expect(document.head.querySelector('meta[name="twitter:description"]')).toHaveAttribute('content', en.notFound.description);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
  });
});
