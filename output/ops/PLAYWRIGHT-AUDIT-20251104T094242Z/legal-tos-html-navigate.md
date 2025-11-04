### Ran Playwright code
```js
await page.goto('http://localhost:8000/legal/tos.html');
```

### Page state
- Page URL: http://localhost:8000/legal/tos.html
- Page Title: Website Terms — Equilens
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
    - heading "Website Terms" [level=1] [ref=e9]
    - paragraph [ref=e10]:
      - strong [ref=e11]: "Status:"
      - text: Provisional; not a license for FL-BSA. LexPro to finalize.
    - generic [ref=e12]:
      - heading "Scope" [level=2] [ref=e13]
      - paragraph [ref=e14]: This website provides information about Equilens and FL-BSA. Content is provided “as-is” for general information and does not constitute legal, regulatory, or technical advice.
    - generic [ref=e15]:
      - heading "Intellectual property" [level=2] [ref=e16]
      - paragraph [ref=e17]: Logos and other marks are owned by Equilens/Valfox Ltd. Do not reuse or modify without permission. References to third-party trademarks are for identification only.
    - generic [ref=e18]:
      - heading "No warranties & liability" [level=2] [ref=e19]
      - paragraph [ref=e20]: We make no warranties as to accuracy, completeness, or fitness. To the fullest extent permitted by law, we disclaim liability for reliance on this site’s content.
    - generic [ref=e21]:
      - heading "Governing law" [level=2] [ref=e22]
      - paragraph [ref=e23]: These website terms are governed by the laws of England & Wales. Courts of England & Wales have exclusive jurisdiction over any disputes relating to this site.
    - generic [ref=e24]:
      - heading "Links" [level=2] [ref=e25]
      - paragraph [ref=e26]: External links (e.g., GitHub documentation) are provided for convenience. We are not responsible for third-party content.
    - generic [ref=e27]:
      - heading "Contact" [level=2] [ref=e28]
      - paragraph [ref=e29]:
        - text: "Questions:"
        - link "equilens@equilens.io" [ref=e30] [cursor=pointer]:
          - /url: mailto:equilens@equilens.io
    - paragraph [ref=e31]: Product terms and SLAs are supplied separately via contract or marketplace listings.
  - contentinfo [ref=e32]:
    - generic [ref=e33]:
      - navigation "Footer" [ref=e34]:
        - link "Trust Center" [ref=e35] [cursor=pointer]:
          - /url: /trust-center/
        - link "Procurement" [ref=e36] [cursor=pointer]:
          - /url: /procurement/
        - link "Press" [ref=e37] [cursor=pointer]:
          - /url: /press/
        - generic [ref=e38]: •
        - link "Legal Hub" [ref=e39] [cursor=pointer]:
          - /url: /legal/
        - link "Privacy" [ref=e40] [cursor=pointer]:
          - /url: /legal/privacy.html
        - link "Cookies" [ref=e41] [cursor=pointer]:
          - /url: /legal/cookie-policy.html
        - link "Contact" [ref=e42] [cursor=pointer]:
          - /url: /contact/
      - paragraph [ref=e43]:
        - text: © 2025 Valfox Ltd. Equilens
        - superscript [ref=e44]: ®
        - text: is a registered mark of Valfox Ltd.
```
