import { CanopyEnvironment, CanopyLocale } from '@customTypes/canopy';
import { CanopyProvider, defaultState } from '../context/canopy';
import React, { useEffect, useState } from 'react';
import { dm_sans, dm_serif_display } from '../styles/theme/fonts';
import { getDefaultLang, getLocale } from '@hooks/useLocale';
import { AppProps } from 'next/app';

import COLLECTIONS from '@.canopy/collections.json';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextSeo } from 'next-seo';
import { ObjectLiteral } from '@customTypes/index';
import { ThemeProvider } from 'next-themes';
import { buildDefaultSEO } from '@lib/seo';
import { darkTheme } from '../styles/stitches';
import globalStyles from '../styles/global';
import { BlockEditor } from '../blocks/block-editor.lazy';

import '@page-blocks/react/dist/index.css';
import '@page-blocks/react-editor/dist/index.css';
import '@page-blocks/web-components/dist/index.css';

interface CanopyAppProps extends AppProps {
  pageProps: ObjectLiteral;
}

export const queryClient = new QueryClient();

export default function CanopyAppProps({ Component, pageProps }: CanopyAppProps) {
  globalStyles();

  const config = process.env.CANOPY_CONFIG as unknown as CanopyEnvironment;
  const root = COLLECTIONS.find((collection) => collection.depth === 0);
  const label = root?.label;

  const { locales, theme } = config;
  const seo = pageProps.seo
    ? pageProps.seo
    : buildDefaultSEO({
        ...config,
        label,
      });

  const [locale, setLocale] = useState<CanopyLocale>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !locale) {
      (async () => {
        const defaultLang = getDefaultLang(locales);
        const defaultLocale = await getLocale(locales, defaultLang);
        setLocale(defaultLocale as CanopyLocale);
      })();
    }
  }, [locale, locales, mounted]);

  return (
    <>
      <style jsx global>{`
        html {
          --canopy-sans-font: ${dm_sans};
          --canopy-display-font: ${dm_serif_display};
        }
      `}</style>
      <NextSeo {...seo} />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme={theme.defaultTheme ? theme.defaultTheme : 'light'}
          value={{
            dark: darkTheme.className,
            light: 'light',
          }}
        >
          {locale && (
            <CanopyProvider
              initialState={{
                ...defaultState,
                config: config,
                locale: locale,
              }}
            >
              {mounted && <Component {...pageProps} />}
              {process.env.NODE_ENV !== 'production' ? <BlockEditor showToggle /> : null}
            </CanopyProvider>
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
