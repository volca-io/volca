import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import { OnRenderHtmlAsync } from 'vike/types';
import type { PageContextServer } from '../types/PageContext';
import { config } from '@project/config';
import { getDescription, getTitle, renderWithPageShell } from './utils';

const render: OnRenderHtmlAsync = async (pageContext: PageContextServer) => {
  const pageHtml = renderWithPageShell({ pageContext });

  const title = getTitle(pageContext);
  const description = getDescription(pageContext);

  const analyticsTag = config.googleAnalytics
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics.measurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${config.googleAnalytics.measurementId}');
  </script>`
    : '';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
      ${dangerouslySkipEscape(analyticsTag)}

        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />

      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
};

export default render;
