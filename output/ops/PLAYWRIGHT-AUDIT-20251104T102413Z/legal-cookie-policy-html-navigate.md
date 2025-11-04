### Ran Playwright code
```js
await page.goto('http://localhost:8000/legal/cookie-policy.html');
```

### Page state
- Page URL: http://localhost:8000/legal/cookie-policy.html
- Page Title: Cookie & Storage Policy — Equilens
- Page Snapshot:
```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - navigation "Primary" [ref=e3]:
    - generic [ref=e4]:
      - link "Equilens home" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]: Equilens
      - button "Menu" [ref=e7] [cursor=pointer]
  - main [ref=e8]:
    - heading "Cookie & Storage Policy" [level=1] [ref=e9]
    - paragraph [ref=e10]:
      - strong [ref=e11]: "Status:"
      - text: Provisional for LexPro review. No consent banner is required while we continue to set no non-essential cookies or storage.
    - generic [ref=e12]:
      - heading "Summary" [level=2] [ref=e13]
      - paragraph [ref=e14]:
        - text: We do
        - strong [ref=e15]: not
        - text: use analytics, advertising, or social media cookies. Pages are static and no third-party scripts run.
    - generic [ref=e16]:
      - heading "Strictly necessary operation" [level=2] [ref=e17]
      - paragraph [ref=e18]: Our hosting provider may use infrastructure-level caching or logs to deliver the site reliably. These mechanisms fall under the UK PECR exemption for strictly necessary storage/access and are not used for profiling.
    - generic [ref=e19]:
      - heading "Future changes" [level=2] [ref=e20]
      - paragraph [ref=e21]: If we introduce functionality that requires cookies or similar technologies (for example, analytics or authenticated docs), we will update this policy and deploy appropriate consent controls before enabling them.
    - generic [ref=e22]:
      - heading "Contact" [level=2] [ref=e23]
      - paragraph [ref=e24]:
        - text: "Questions:"
        - link "equilens@equilens.io" [ref=e25] [cursor=pointer]:
          - /url: mailto:equilens@equilens.io
  - contentinfo [ref=e26]:
    - generic [ref=e27]:
      - navigation "Footer" [ref=e28]:
        - link "Trust Center" [ref=e29] [cursor=pointer]:
          - /url: /trust-center/
        - link "Procurement" [ref=e30] [cursor=pointer]:
          - /url: /procurement/
        - link "Press" [ref=e31] [cursor=pointer]:
          - /url: /press/
        - generic [ref=e32]: •
        - link "Legal Hub" [ref=e33] [cursor=pointer]:
          - /url: /legal/
        - link "Privacy" [ref=e34] [cursor=pointer]:
          - /url: /legal/privacy.html
        - link "Cookies" [ref=e35] [cursor=pointer]:
          - /url: /legal/cookie-policy.html
        - link "Contact" [ref=e36] [cursor=pointer]:
          - /url: /contact/
      - paragraph [ref=e37]:
        - text: © 2025 Valfox Ltd. Equilens
        - superscript [ref=e38]: ®
        - text: is a registered mark of Valfox Ltd.
```
