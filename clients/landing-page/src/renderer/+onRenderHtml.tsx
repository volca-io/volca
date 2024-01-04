import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import { OnRenderHtmlAsync } from 'vike/types';
import type { PageContextServer } from '../types/PageContext';
import { config } from '../../../../app.config';
import { getDescription, getTitle, renderWithPageShell } from './utils';

const render: OnRenderHtmlAsync = async (pageContext: PageContextServer) => {
  const pageHtml = renderWithPageShell({ pageContext });

  const title = getTitle(pageContext);
  const description = getDescription(pageContext);

  const crispWidget = config.crisp
    ? `<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="${config.crisp.websiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>`
    : '';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />

        ${dangerouslySkipEscape(crispWidget)}
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
