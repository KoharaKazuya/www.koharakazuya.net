import { formatISO } from "date-fns";

export type SitemapUrl = {
  loc: string;
  lastmodDate: Date;
};

export function createSitemap({ urls }: { urls: SitemapUrl[] }) {
  let result =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (const { loc, lastmodDate } of urls) {
    const lastmod = formatISO(lastmodDate);
    result += `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  }
  result += `</urlset>`;

  return result;
}
