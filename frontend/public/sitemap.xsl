<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | KalkulatorTik</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #0B1120;
            color: #E2E8F0;
            padding: 32px 16px;
            line-height: 1.5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 28px;
            margin-bottom: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }
          .brand-logo {
            width: 36px;
            height: 36px;
            background: #0D9488;
            border: 1.5px solid #5EEAD4;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #FFFFFF;
            font-size: 18px;
          }
          .brand-name {
            font-size: 22px;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.02em;
          }
          .brand-accent {
            color: #2DD4BF;
          }
          h1 {
            font-size: 26px;
            font-weight: 800;
            color: #FFFFFF;
            margin-bottom: 8px;
          }
          p.desc {
            color: #94A3B8;
            font-size: 14px;
            max-width: 800px;
            margin-bottom: 20px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
          }
          .stat-card {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 12px 16px;
          }
          .stat-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748B;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: #2DD4BF;
          }
          .table-wrapper {
            background: #0F172A;
            border: 1px solid #334155;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
          }
          thead {
            background: #1E293B;
            border-bottom: 2px solid #334155;
          }
          th {
            padding: 14px 16px;
            font-weight: 700;
            color: #F1F5F9;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            font-size: 11px;
            white-space: nowrap;
          }
          tbody tr {
            border-bottom: 1px solid #1E293B;
            transition: background-color 0.15s ease;
          }
          tbody tr:hover {
            background: rgba(45, 212, 191, 0.06);
          }
          td {
            padding: 12px 16px;
            vertical-align: middle;
          }
          .url-cell {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12.5px;
            max-width: 480px;
            word-break: break-all;
          }
          .url-link {
            color: #38BDF8;
            text-decoration: none;
            transition: color 0.15s ease;
          }
          .url-link:hover {
            color: #7DD3FC;
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
          }
          .badge-p10 {
            background: rgba(34, 197, 94, 0.15);
            color: #4ADE80;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }
          .badge-p09 {
            background: rgba(45, 212, 191, 0.15);
            color: #2DD4BF;
            border: 1px solid rgba(45, 212, 191, 0.3);
          }
          .badge-p08 {
            background: rgba(56, 189, 248, 0.15);
            color: #38BDF8;
            border: 1px solid rgba(56, 189, 248, 0.3);
          }
          .badge-p07 {
            background: rgba(168, 85, 247, 0.15);
            color: #C084FC;
            border: 1px solid rgba(168, 85, 247, 0.3);
          }
          .badge-p06 {
            background: rgba(245, 158, 11, 0.15);
            color: #FBBF24;
            border: 1px solid rgba(245, 158, 11, 0.3);
          }
          .badge-p05, .badge-p04 {
            background: rgba(148, 163, 184, 0.15);
            color: #CBD5E1;
            border: 1px solid rgba(148, 163, 184, 0.3);
          }
          .badge-freq {
            background: #1E293B;
            color: #94A3B8;
            border: 1px solid #334155;
          }
          .badge-alt {
            background: rgba(99, 102, 241, 0.15);
            color: #A5B4FC;
            border: 1px solid rgba(99, 102, 241, 0.3);
          }
          .date-cell {
            color: #94A3B8;
            font-size: 12px;
            white-space: nowrap;
            font-family: ui-monospace, SFMono-Regular, monospace;
          }
          .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748B;
          }
          .footer a {
            color: #2DD4BF;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">
              <div class="brand-logo">KT</div>
              <div class="brand-name">Kalkulator<span class="brand-accent">Tik</span></div>
            </div>
            <h1>XML Sitemap</h1>
            <p class="desc">
              This XML Sitemap is structured for search engines (such as Google and Bing) to index all canonical localized pages. It includes full reciprocal hreflang alternates across 8 languages plus x-default.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Indexable URLs</div>
                <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Supported Languages</div>
                <div class="stat-value">8 + x-default</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Excluded Utility Routes</div>
                <div class="stat-value">8 (/calculator)</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Sitemap Protocol</div>
                <div class="stat-value">0.9 + xhtml:link</div>
              </div>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">#</th>
                  <th>URL (Location)</th>
                  <th style="text-align: center;">Priority</th>
                  <th style="text-align: center;">Change Freq</th>
                  <th style="text-align: center;">Alternates</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td style="text-align: center; color: #64748B; font-weight: 600;">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td class="url-cell">
                      <a class="url-link" target="_blank" rel="noopener">
                        <xsl:attribute name="href">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:attribute>
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td style="text-align: center;">
                      <xsl:choose>
                        <xsl:when test="sitemap:priority = '1.0'">
                          <span class="badge badge-p10">1.0</span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority = '0.9'">
                          <span class="badge badge-p09">0.9</span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority = '0.8'">
                          <span class="badge badge-p08">0.8</span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority = '0.7'">
                          <span class="badge badge-p07">0.7</span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority = '0.6'">
                          <span class="badge badge-p06">0.6</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="badge badge-p05"><xsl:value-of select="sitemap:priority"/></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td style="text-align: center;">
                      <span class="badge badge-freq"><xsl:value-of select="sitemap:changefreq"/></span>
                    </td>
                    <td style="text-align: center;">
                      <span class="badge badge-alt">
                        <xsl:value-of select="count(xhtml:link)"/> langs
                      </span>
                    </td>
                    <td class="date-cell">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>
              Generated by <a href="https://www.kalkulatortik.com/">KalkulatorTik</a> • Free TikTok Analytics &amp; Sponsorship Tools
            </p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

