### Ran Playwright code
```js
await page.goto('http://localhost:8000/404.html');
```

### Page state
- Page URL: http://localhost:8000/404.html
- Page Title: Page not found — Equilens
- Page Snapshot:
```yaml
- generic [active] [ref=e1]:
  - navigation "Primary" [ref=e2]:
    - generic [ref=e3]:
      - link "Equilens home" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]: Equilens
      - button "Menu" [ref=e6] [cursor=pointer]
  - main [ref=e7]:
    - heading "Page not found" [level=1] [ref=e8]
    - paragraph [ref=e9]:
      - text: The page you’re looking for doesn’t exist. Return to the
      - link "home page" [ref=e10] [cursor=pointer]:
        - /url: ./
      - text: .
  - contentinfo [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e13]:
        - heading "Company" [level=3] [ref=e14]
        - list [ref=e15]:
          - listitem [ref=e16]:
            - link "Press" [ref=e17] [cursor=pointer]:
              - /url: press/
          - listitem [ref=e18]:
            - link "Procurement" [ref=e19] [cursor=pointer]:
              - /url: procurement/
          - listitem [ref=e20]:
            - link "Trust Center" [ref=e21] [cursor=pointer]:
              - /url: trust-center/
      - generic [ref=e22]:
        - heading "Legal" [level=3] [ref=e23]
        - list [ref=e24]:
          - listitem [ref=e25]:
            - link "Privacy" [ref=e26] [cursor=pointer]:
              - /url: legal/privacy.html
          - listitem [ref=e27]:
            - link "Cookie Policy" [ref=e28] [cursor=pointer]:
              - /url: legal/cookie-policy.html
          - listitem [ref=e29]:
            - link "Terms of Service" [ref=e30] [cursor=pointer]:
              - /url: legal/tos.html
          - listitem [ref=e31]:
            - link "Imprint" [ref=e32] [cursor=pointer]:
              - /url: legal/imprint.html
      - generic [ref=e33]:
        - heading "Resources" [level=3] [ref=e34]
        - list [ref=e35]:
          - listitem [ref=e36]:
            - link "Open Source" [ref=e37] [cursor=pointer]:
              - /url: legal/open-source.html
          - listitem [ref=e38]:
            - link "Accessibility" [ref=e39] [cursor=pointer]:
              - /url: legal/accessibility.html
    - generic [ref=e40]: © Equilens. All rights reserved.
```
