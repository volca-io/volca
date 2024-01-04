import fs from 'fs';
import * as url from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const generate = async () => {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
  const basePath = `${__dirname}dist/client`;
  const links = (fs.readdirSync(basePath, { recursive: true }).filter((file) => typeof file === 'string') as string[])
    .filter((file) => file.endsWith('.html'))
    .map((file) => {
      let withoutIndex = file.replace('/index.html', '/');
      if (withoutIndex === 'index.html') withoutIndex = '/';

      return {
        url: withoutIndex,
      };
    });

  const stream = new SitemapStream({ hostname: 'https://volca.io' });
  const res = await streamToPromise(Readable.from(links).pipe(stream));

  fs.writeFileSync(`${basePath}/sitemap.xml`, res);
};

generate();
