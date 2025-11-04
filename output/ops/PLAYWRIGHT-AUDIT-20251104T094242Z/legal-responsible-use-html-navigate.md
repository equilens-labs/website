### Ran Playwright code
```js
await page.goto('http://localhost:8000/legal/responsible-use.html');
```

### Page state
- Page URL: http://localhost:8000/legal/responsible-use.html
- Page Title: Responsible Use — Equilens
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
    - heading "Responsible Use" [level=1] [ref=e9]
    - generic [ref=e10]:
      - paragraph [ref=e11]: FL-BSA runs entirely within your environment and generates synthetic data for fairness testing. You are responsible for ensuring that any inputs are lawfully obtained and that outputs are interpreted by qualified personnel.
      - paragraph [ref=e12]:
        - text: Do not use FL-BSA to make production lending decisions without human review. Contact
        - link "equilens@equilens.io" [ref=e13] [cursor=pointer]:
          - /url: mailto:equilens@equilens.io
        - text: if you need guidance on governance controls or model risk policies.
  - contentinfo [ref=e14]:
    - generic [ref=e15]:
      - navigation "Footer" [ref=e16]:
        - link "Trust Center" [ref=e17] [cursor=pointer]:
          - /url: /trust-center/
        - link "Procurement" [ref=e18] [cursor=pointer]:
          - /url: /procurement/
        - link "Press" [ref=e19] [cursor=pointer]:
          - /url: /press/
        - generic [ref=e20]: •
        - link "Legal Hub" [ref=e21] [cursor=pointer]:
          - /url: /legal/
        - link "Privacy" [ref=e22] [cursor=pointer]:
          - /url: /legal/privacy.html
        - link "Cookies" [ref=e23] [cursor=pointer]:
          - /url: /legal/cookie-policy.html
        - link "Contact" [ref=e24] [cursor=pointer]:
          - /url: /contact/
      - paragraph [ref=e25]:
        - text: © 2025 Valfox Ltd. Equilens
        - superscript [ref=e26]: ®
        - text: is a registered mark of Valfox Ltd.
```
