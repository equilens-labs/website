### Ran Playwright code
```js
await page.goto('http://localhost:8000/contact/');
```

### Page state
- Page URL: http://localhost:8000/contact/
- Page Title: Contact — Equilens
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
    - heading "Contact" [level=1] [ref=e9]
    - generic [ref=e10]:
      - paragraph [ref=e11]:
        - text: Email
        - link "equilens@equilens.io" [ref=e12] [cursor=pointer]:
          - /url: mailto:equilens@equilens.io
        - text: .
      - paragraph [ref=e13]: "Privacy: This site has no forms or analytics. Email only; include what you choose to share."
      - paragraph [ref=e14]: "Please include: your role, bank/firm, region, preferred tier, and whether data can leave your network (default: no)."
  - contentinfo [ref=e15]:
    - generic [ref=e16]:
      - generic [ref=e17]:
        - heading "Company" [level=3] [ref=e18]
        - list [ref=e19]:
          - listitem [ref=e20]:
            - link "Press" [ref=e21] [cursor=pointer]:
              - /url: ../press/
          - listitem [ref=e22]:
            - link "Procurement" [ref=e23] [cursor=pointer]:
              - /url: ../procurement/
          - listitem [ref=e24]:
            - link "Trust Center" [ref=e25] [cursor=pointer]:
              - /url: ../trust-center/
      - generic [ref=e26]:
        - heading "Legal" [level=3] [ref=e27]
        - list [ref=e28]:
          - listitem [ref=e29]:
            - link "Privacy" [ref=e30] [cursor=pointer]:
              - /url: ../legal/privacy.html
          - listitem [ref=e31]:
            - link "Cookie Policy" [ref=e32] [cursor=pointer]:
              - /url: ../legal/cookie-policy.html
          - listitem [ref=e33]:
            - link "Terms of Service" [ref=e34] [cursor=pointer]:
              - /url: ../legal/tos.html
          - listitem [ref=e35]:
            - link "Imprint" [ref=e36] [cursor=pointer]:
              - /url: ../legal/imprint.html
      - generic [ref=e37]:
        - heading "Resources" [level=3] [ref=e38]
        - list [ref=e39]:
          - listitem [ref=e40]:
            - link "Open Source" [ref=e41] [cursor=pointer]:
              - /url: ../legal/open-source.html
          - listitem [ref=e42]:
            - link "Accessibility" [ref=e43] [cursor=pointer]:
              - /url: ../legal/accessibility.html
    - generic [ref=e44]: © Equilens. All rights reserved.
```
