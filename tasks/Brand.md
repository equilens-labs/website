Amazing—thanks for the clean wordmark SVG. Below is a ready‑to‑ship brand assets package you can copy‑paste into your repo. It includes production‑ready SVGs for the logo (light/dark/mono), the favicon + app icons, OG/social templates, web manifest, CSS/JSON design tokens, and concise usage guidelines (clearspace, min sizes, color/contrast, do/don’ts).

Note: I haven’t changed your design language; I’ve only packaged it, added robust variants, and fixed edge‑case pitfalls (dark mode contrast, tiny sizes, metadata hygiene).

⸻

0. Suggested folder structure

/brand
/logo
equilens-wordmark-light.svg
equilens-wordmark-dark.svg
equilens-wordmark-mono.svg
/symbol
equilens-symbol.svg
safari-pinned-tab.svg
/icons
favicon.svg
favicon.ico ← generate from favicon.svg (command below)
apple-touch-icon-180.png ← export from maskable.svg
icon-192-maskable.png ← export from maskable.svg
icon-512-maskable.png ← export from maskable.svg
maskable.svg
site.webmanifest
/social
og-1200x630.svg
og-1200x600.svg
/tokens
tokens.css
tokens.json
/guidelines
brand-guidelines.md
README.md

⸻

1. Logo — wordmark SVGs (light / dark / mono)

Your original geometry is preserved. I’ve only cleaned the wrapper and organized color tokens.
Light is for white/very light backgrounds. Dark is for charcoal/dark imagery (tuned for contrast).
Mono is one‑color (uses currentColor) for prints, emboss, and special cases.

/brand/logo/equilens-wordmark-light.svg

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" role="img" aria-labelledby="equilens-wordmark">
  <title id="equilens-wordmark">Equilens</title>
  <style>
    .bracket { fill: #4F46E5; }   /* brand indigo */
    .text    { fill: #111827; }   /* near-black */
    .accent  { fill: #4F46E5; }   /* i-dot accent */
  </style>
  <g transform="scale(0.717,0.717)">
    <!-- Left Bracket [ -->
    <path class="bracket" d="M 53.38 1.56 L 64.36 1.56 L 64.36 5.24 L 58.14 5.24 L 58.14 44.85 L 64.36 44.85 L 64.36 48.53 L 53.38 48.53 L 53.38 1.56 Z"/>
    <!-- e -->
    <path class="text" d="M 106.00 28.45 L 106.00 30.40 L 87.56 30.40 Q 87.82 34.52 90.05 36.67 Q 92.29 38.83 96.28 38.83 Q 98.58 38.83 100.75 38.27 Q 102.92 37.71 105.06 36.58 L 105.06 40.35 Q 102.90 41.25 100.64 41.73 Q 98.37 42.21 96.04 42.21 Q 90.19 42.21 86.78 38.84 Q 83.37 35.45 83.37 29.69 Q 83.37 23.74 86.61 20.24 Q 89.84 16.74 95.34 16.74 Q 100.27 16.74 103.13 19.90 Q 106.00 23.04 106.00 28.45 Z M 101.99 27.28 Q 101.95 24.02 100.15 22.07 Q 98.35 20.12 95.38 20.12 Q 92.03 20.12 90.01 22.00 Q 88.00 23.89 87.69 27.31 L 101.99 27.28 Z"/>
    <!-- q -->
    <path class="text" d="M 115.42 29.47 Q 115.42 33.87 117.24 36.37 Q 119.06 38.87 122.24 38.87 Q 125.42 38.87 127.24 36.37 Q 129.08 33.87 129.08 29.47 Q 129.08 25.08 127.24 22.58 Q 125.42 20.08 122.24 20.08 Q 119.06 20.08 117.24 22.58 Q 115.42 25.08 115.42 29.47 Z M 129.08 37.94 Q 127.82 40.10 125.88 41.16 Q 123.96 42.21 121.25 42.21 Q 116.83 42.21 114.05 38.70 Q 111.27 35.19 111.27 29.47 Q 111.27 23.76 114.05 20.25 Q 116.83 16.74 121.25 16.74 Q 123.96 16.74 125.88 17.80 Q 127.82 18.84 129.08 21.00 L 129.08 17.33 L 133.09 17.33 L 133.09 50.80 L 129.08 50.80 L 129.08 37.94 Z"/>
    <!-- u -->
    <path class="text" d="M 140.50 32.01 L 140.50 17.33 L 144.52 17.33 L 144.52 31.86 Q 144.52 35.30 145.86 37.03 Q 147.21 38.75 149.92 38.75 Q 153.16 38.75 155.05 36.69 Q 156.94 34.63 156.94 31.07 L 156.94 17.33 L 160.95 17.33 L 160.95 41.58 L 156.94 41.58 L 156.94 37.85 Q 155.48 40.06 153.55 41.14 Q 151.62 42.21 149.07 42.21 Q 144.86 42.21 142.68 39.61 Q 140.50 37.01 140.50 32.01 Z"/>
    <!-- i -->
    <path class="text"   d="M 168.82 17.33 L 172.83 17.33 L 172.83 41.58 L 168.82 41.58 L 168.82 17.33 Z"/>
    <path class="accent" d="M 168.82 7.88  L 172.83 7.88  L 172.83 12.93 L 168.82 12.93 L 168.82 7.88 Z"/>
    <!-- l -->
    <path class="text" d="M 185.56 7.88 L 189.57 7.88 L 189.57 41.58 L 185.56 41.58 L 185.56 7.88 Z"/>
    <!-- e -->
    <path class="text" d="M 223.18 28.45 L 223.18 30.40 L 204.74 30.40 Q 205.00 34.52 207.23 36.67 Q 209.47 38.83 213.46 38.83 Q 215.76 38.83 217.93 38.27 Q 220.10 37.71 222.24 36.58 L 222.24 40.35 Q 220.08 41.25 217.82 41.73 Q 215.55 42.21 213.22 42.21 Q 207.37 42.21 203.96 38.84 Q 200.55 35.45 200.55 29.69 Q 200.55 23.74 203.79 20.24 Q 207.02 16.74 212.52 16.74 Q 217.45 16.74 220.31 19.90 Q 223.18 23.04 223.18 28.45 Z M 219.17 27.28 Q 219.13 24.02 217.33 22.07 Q 215.53 20.12 212.56 20.12 Q 209.21 20.12 207.19 22.00 Q 205.18 23.89 204.87 27.31 L 219.17 27.28 Z"/>
    <!-- n -->
    <path class="text" d="M 250.49 26.94 L 250.49 41.58 L 246.48 41.58 L 246.48 27.07 Q 246.48 23.62 245.13 21.92 Q 243.78 20.21 241.08 20.21 Q 237.83 20.21 235.95 22.27 Q 234.07 24.32 234.07 27.87 L 234.07 41.58 L 230.04 41.58 L 230.04 17.33 L 234.07 17.33 L 234.07 21.09 Q 235.52 18.91 237.46 17.82 Q 239.42 16.74 241.97 16.74 Q 246.18 16.74 248.33 19.33 Q 250.49 21.91 250.49 26.94 Z"/>
    <!-- s -->
    <path class="text" d="M 273.66 18.04 L 273.66 21.81 Q 271.96 20.94 270.13 20.51 Q 268.30 20.08 266.33 20.08 Q 263.35 20.08 261.86 20.98 Q 260.36 21.89 260.36 23.71 Q 260.36 25.10 261.43 25.89 Q 262.50 26.68 265.73 27.39 L 267.10 27.70 Q 271.37 28.61 273.17 30.26 Q 274.97 31.92 274.97 34.89 Q 274.97 38.27 272.28 40.24 Q 269.58 42.21 264.88 42.21 Q 262.92 42.21 260.79 41.83 Q 258.66 41.45 256.31 40.69 L 256.31 36.58 Q 258.54 37.73 260.69 38.30 Q 262.85 38.87 264.97 38.87 Q 267.80 38.87 269.32 37.91 Q 270.85 36.94 270.85 35.19 Q 270.85 33.57 269.74 32.70 Q 268.65 31.84 264.92 31.03 L 263.52 30.71 Q 259.80 29.93 258.14 28.32 Q 256.48 26.70 256.48 23.89 Q 256.48 20.46 258.93 18.61 Q 261.37 16.74 265.86 16.74 Q 268.08 16.74 270.04 17.07 Q 272.00 17.39 273.66 18.04 Z"/>
    <!-- Right Bracket ] -->
    <path class="bracket" d="M 302.10 1.56 L 302.10 48.53 L 291.13 48.53 L 291.13 44.85 L 297.31 44.85 L 297.31 5.24 L 291.13 5.24 L 291.13 1.56 L 302.10 1.56 Z"/>
  </g>
</svg>

/brand/logo/equilens-wordmark-dark.svg
(Use on dark backgrounds; brackets + i‑dot lightened for contrast, text reversed to white.)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" role="img" aria-labelledby="equilens-wordmark-dark">
  <title id="equilens-wordmark-dark">Equilens (dark)</title>
  <style>
    .bracket { fill: #A5B4FC; }   /* light indigo for dark BGs (AA+) */
    .text    { fill: #FFFFFF; }   /* reversed */
    .accent  { fill: #A5B4FC; }   /* i-dot */
  </style>
  <g transform="scale(0.717,0.717)">
    <!-- same paths as light version -->
    <!-- Left Bracket [ -->
    <path class="bracket" d="M 53.38 1.56 L 64.36 1.56 L 64.36 5.24 L 58.14 5.24 L 58.14 44.85 L 64.36 44.85 L 64.36 48.53 L 53.38 48.53 L 53.38 1.56 Z"/>
    <!-- e -->
    <path class="text" d="M 106.00 28.45 L 106.00 30.40 L 87.56 30.40 Q 87.82 34.52 90.05 36.67 Q 92.29 38.83 96.28 38.83 Q 98.58 38.83 100.75 38.27 Q 102.92 37.71 105.06 36.58 L 105.06 40.35 Q 102.90 41.25 100.64 41.73 Q 98.37 42.21 96.04 42.21 Q 90.19 42.21 86.78 38.84 Q 83.37 35.45 83.37 29.69 Q 83.37 23.74 86.61 20.24 Q 89.84 16.74 95.34 16.74 Q 100.27 16.74 103.13 19.90 Q 106.00 23.04 106.00 28.45 Z M 101.99 27.28 Q 101.95 24.02 100.15 22.07 Q 98.35 20.12 95.38 20.12 Q 92.03 20.12 90.01 22.00 Q 88.00 23.89 87.69 27.31 L 101.99 27.28 Z"/>
    <!-- q -->
    <path class="text" d="M 115.42 29.47 Q 115.42 33.87 117.24 36.37 Q 119.06 38.87 122.24 38.87 Q 125.42 38.87 127.24 36.37 Q 129.08 33.87 129.08 29.47 Q 129.08 25.08 127.24 22.58 Q 125.42 20.08 122.24 20.08 Q 119.06 20.08 117.24 22.58 Q 115.42 25.08 115.42 29.47 Z M 129.08 37.94 Q 127.82 40.10 125.88 41.16 Q 123.96 42.21 121.25 42.21 Q 116.83 42.21 114.05 38.70 Q 111.27 35.19 111.27 29.47 Q 111.27 23.76 114.05 20.25 Q 116.83 16.74 121.25 16.74 Q 123.96 16.74 125.88 17.80 Q 127.82 18.84 129.08 21.00 L 129.08 17.33 L 133.09 17.33 L 133.09 50.80 L 129.08 50.80 L 129.08 37.94 Z"/>
    <!-- u -->
    <path class="text" d="M 140.50 32.01 L 140.50 17.33 L 144.52 17.33 L 144.52 31.86 Q 144.52 35.30 145.86 37.03 Q 147.21 38.75 149.92 38.75 Q 153.16 38.75 155.05 36.69 Q 156.94 34.63 156.94 31.07 L 156.94 17.33 L 160.95 17.33 L 160.95 41.58 L 156.94 41.58 L 156.94 37.85 Q 155.48 40.06 153.55 41.14 Q 151.62 42.21 149.07 42.21 Q 144.86 42.21 142.68 39.61 Q 140.50 37.01 140.50 32.01 Z"/>
    <!-- i -->
    <path class="text"   d="M 168.82 17.33 L 172.83 17.33 L 172.83 41.58 L 168.82 41.58 L 168.82 17.33 Z"/>
    <path class="bracket" d="M 168.82 7.88  L 172.83 7.88  L 172.83 12.93 L 168.82 12.93 L 168.82 7.88 Z"/>
    <!-- l -->
    <path class="text" d="M 185.56 7.88 L 189.57 7.88 L 189.57 41.58 L 185.56 41.58 L 185.56 7.88 Z"/>
    <!-- e -->
    <path class="text" d="M 223.18 28.45 L 223.18 30.40 L 204.74 30.40 Q 205.00 34.52 207.23 36.67 Q 209.47 38.83 213.46 38.83 Q 215.76 38.83 217.93 38.27 Q 220.10 37.71 222.24 36.58 L 222.24 40.35 Q 220.08 41.25 217.82 41.73 Q 215.55 42.21 213.22 42.21 Q 207.37 42.21 203.96 38.84 Q 200.55 35.45 200.55 29.69 Q 200.55 23.74 203.79 20.24 Q 207.02 16.74 212.52 16.74 Q 217.45 16.74 220.31 19.90 Q 223.18 23.04 223.18 28.45 Z M 219.17 27.28 Q 219.13 24.02 217.33 22.07 Q 215.53 20.12 212.56 20.12 Q 209.21 20.12 207.19 22.00 Q 205.18 23.89 204.87 27.31 L 219.17 27.28 Z"/>
    <!-- n -->
    <path class="text" d="M 250.49 26.94 L 250.49 41.58 L 246.48 41.58 L 246.48 27.07 Q 246.48 23.62 245.13 21.92 Q 243.78 20.21 241.08 20.21 Q 237.83 20.21 235.95 22.27 Q 234.07 24.32 234.07 27.87 L 234.07 41.58 L 230.04 41.58 L 230.04 17.33 L 234.07 17.33 L 234.07 21.09 Q 235.52 18.91 237.46 17.82 Q 239.42 16.74 241.97 16.74 Q 246.18 16.74 248.33 19.33 Q 250.49 21.91 250.49 26.94 Z"/>
    <!-- s -->
    <path class="text" d="M 273.66 18.04 L 273.66 21.81 Q 271.96 20.94 270.13 20.51 Q 268.30 20.08 266.33 20.08 Q 263.35 20.08 261.86 20.98 Q 260.36 21.89 260.36 23.71 Q 260.36 25.10 261.43 25.89 Q 262.50 26.68 265.73 27.39 L 267.10 27.70 Q 271.37 28.61 273.17 30.26 Q 274.97 31.92 274.97 34.89 Q 274.97 38.27 272.28 40.24 Q 269.58 42.21 264.88 42.21 Q 262.92 42.21 260.79 41.83 Q 258.66 41.45 256.31 40.69 L 256.31 36.58 Q 258.54 37.73 260.69 38.30 Q 262.85 38.87 264.97 38.87 Q 267.80 38.87 269.32 37.91 Q 270.85 36.94 270.85 35.19 Q 270.85 33.57 269.74 32.70 Q 268.65 31.84 264.92 31.03 L 263.52 30.71 Q 259.80 29.93 258.14 28.32 Q 256.48 26.70 256.48 23.89 Q 256.48 20.46 258.93 18.61 Q 261.37 16.74 265.86 16.74 Q 268.08 16.74 270.04 17.07 Q 272.00 17.39 273.66 18.04 Z"/>
    <!-- Right Bracket ] -->
    <path class="bracket" d="M 302.10 1.56 L 302.10 48.53 L 291.13 48.53 L 291.13 44.85 L 297.31 44.85 L 297.31 5.24 L 291.13 5.24 L 291.13 1.56 L 302.10 1.56 Z"/>
  </g>
</svg>

/brand/logo/equilens-wordmark-mono.svg
(For true one‑ink use; color is inherited from CSS/parent.)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" role="img" aria-labelledby="equilens-wordmark-mono">
  <title id="equilens-wordmark-mono">Equilens (mono)</title>
  <style>.mark{fill:currentColor}</style>
  <g class="mark" transform="scale(0.717,0.717)">
    <!-- all paths from the light version, but with class="mark" -->
    <!-- Left Bracket [ -->
    <path d="M 53.38 1.56 L 64.36 1.56 L 64.36 5.24 L 58.14 5.24 L 58.14 44.85 L 64.36 44.85 L 64.36 48.53 L 53.38 48.53 L 53.38 1.56 Z"/>
    <!-- e -->
    <path d="M 106.00 28.45 L 106.00 30.40 L 87.56 30.40 Q 87.82 34.52 90.05 36.67 Q 92.29 38.83 96.28 38.83 Q 98.58 38.83 100.75 38.27 Q 102.92 37.71 105.06 36.58 L 105.06 40.35 Q 102.90 41.25 100.64 41.73 Q 98.37 42.21 96.04 42.21 Q 90.19 42.21 86.78 38.84 Q 83.37 35.45 83.37 29.69 Q 83.37 23.74 86.61 20.24 Q 89.84 16.74 95.34 16.74 Q 100.27 16.74 103.13 19.90 Q 106.00 23.04 106.00 28.45 Z M 101.99 27.28 Q 101.95 24.02 100.15 22.07 Q 98.35 20.12 95.38 20.12 Q 92.03 20.12 90.01 22.00 Q 88.00 23.89 87.69 27.31 L 101.99 27.28 Z"/>
    <!-- q -->
    <path d="M 115.42 29.47 Q 115.42 33.87 117.24 36.37 Q 119.06 38.87 122.24 38.87 Q 125.42 38.87 127.24 36.37 Q 129.08 33.87 129.08 29.47 Q 129.08 25.08 127.24 22.58 Q 125.42 20.08 122.24 20.08 Q 119.06 20.08 117.24 22.58 Q 115.42 25.08 115.42 29.47 Z M 129.08 37.94 Q 127.82 40.10 125.88 41.16 Q 123.96 42.21 121.25 42.21 Q 116.83 42.21 114.05 38.70 Q 111.27 35.19 111.27 29.47 Q 111.27 23.76 114.05 20.25 Q 116.83 16.74 121.25 16.74 Q 123.96 16.74 125.88 17.80 Q 127.82 18.84 129.08 21.00 L 129.08 17.33 L 133.09 17.33 L 133.09 50.80 L 129.08 50.80 L 129.08 37.94 Z"/>
    <!-- u -->
    <path d="M 140.50 32.01 L 140.50 17.33 L 144.52 17.33 L 144.52 31.86 Q 144.52 35.30 145.86 37.03 Q 147.21 38.75 149.92 38.75 Q 153.16 38.75 155.05 36.69 Q 156.94 34.63 156.94 31.07 L 156.94 17.33 L 160.95 17.33 L 160.95 41.58 L 156.94 41.58 L 156.94 37.85 Q 155.48 40.06 153.55 41.14 Q 151.62 42.21 149.07 42.21 Q 144.86 42.21 142.68 39.61 Q 140.50 37.01 140.50 32.01 Z"/>
    <!-- i + dot -->
    <path d="M 168.82 17.33 L 172.83 17.33 L 172.83 41.58 L 168.82 41.58 L 168.82 17.33 Z"/>
    <path d="M 168.82 7.88  L 172.83 7.88  L 172.83 12.93 L 168.82 12.93 L 168.82 7.88 Z"/>
    <!-- l -->
    <path d="M 185.56 7.88 L 189.57 7.88 L 189.57 41.58 L 185.56 41.58 L 185.56 7.88 Z"/>
    <!-- e -->
    <path d="M 223.18 28.45 L 223.18 30.40 L 204.74 30.40 Q 205.00 34.52 207.23 36.67 Q 209.47 38.83 213.46 38.83 Q 215.76 38.83 217.93 38.27 Q 220.10 37.71 222.24 36.58 L 222.24 40.35 Q 220.08 41.25 217.82 41.73 Q 215.55 42.21 213.22 42.21 Q 207.37 42.21 203.96 38.84 Q 200.55 35.45 200.55 29.69 Q 200.55 23.74 203.79 20.24 Q 207.02 16.74 212.52 16.74 Q 217.45 16.74 220.31 19.90 Q 223.18 23.04 223.18 28.45 Z M 219.17 27.28 Q 219.13 24.02 217.33 22.07 Q 215.53 20.12 212.56 20.12 Q 209.21 20.12 207.19 22.00 Q 205.18 23.89 204.87 27.31 L 219.17 27.28 Z"/>
    <!-- n -->
    <path d="M 250.49 26.94 L 250.49 41.58 L 246.48 41.58 L 246.48 27.07 Q 246.48 23.62 245.13 21.92 Q 243.78 20.21 241.08 20.21 Q 237.83 20.21 235.95 22.27 Q 234.07 24.32 234.07 27.87 L 234.07 41.58 L 230.04 41.58 L 230.04 17.33 L 234.07 17.33 L 234.07 21.09 Q 235.52 18.91 237.46 17.82 Q 239.42 16.74 241.97 16.74 Q 246.18 16.74 248.33 19.33 Q 250.49 21.91 250.49 26.94 Z"/>
    <!-- s -->
    <path d="M 273.66 18.04 L 273.66 21.81 Q 271.96 20.94 270.13 20.51 Q 268.30 20.08 266.33 20.08 Q 263.35 20.08 261.86 20.98 Q 260.36 21.89 260.36 23.71 Q 260.36 25.10 261.43 25.89 Q 262.50 26.68 265.73 27.39 L 267.10 27.70 Q 271.37 28.61 273.17 30.26 Q 274.97 31.92 274.97 34.89 Q 274.97 38.27 272.28 40.24 Q 269.58 42.21 264.88 42.21 Q 262.92 42.21 260.79 41.83 Q 258.66 41.45 256.31 40.69 L 256.31 36.58 Q 258.54 37.73 260.69 38.30 Q 262.85 38.87 264.97 38.87 Q 267.80 38.87 269.32 37.91 Q 270.85 36.94 270.85 35.19 Q 270.85 33.57 269.74 32.70 Q 268.65 31.84 264.92 31.03 L 263.52 30.71 Q 259.80 29.93 258.14 28.32 Q 256.48 26.70 256.48 23.89 Q 256.48 20.46 258.93 18.61 Q 261.37 16.74 265.86 16.74 Q 268.08 16.74 270.04 17.07 Q 272.00 17.39 273.66 18.04 Z"/>
    <!-- Right Bracket ] -->
    <path d="M 302.10 1.56 L 302.10 48.53 L 291.13 48.53 L 291.13 44.85 L 297.31 44.85 L 297.31 5.24 L 291.13 5.24 L 291.13 1.56 L 302.10 1.56 Z"/>
  </g>
</svg>

⸻

2. Symbol / favicon / app icons

/brand/symbol/equilens-symbol.svg (monogram “[ e ]”; accessible, crisp; reuses your earlier construction)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="equilens-favicon">
  <title id="equilens-favicon">Equilens</title>
  <style>
    .bracket { fill: #4F46E5; }
    .text    { fill: #111827; }
  </style>
  <g transform="translate(4,11)">
    <!-- [ -->
    <path class="bracket" d="M12.32 -3.87H20.98V-0.97H16.08V30.3H20.98V33.2H12.32V-3.87Z"/>
    <!-- e -->
    <path class="text" d="M38.35 19.52v1.21H26.82q.17 2.58 1.56 3.92 1.4 1.35 3.89 1.35 1.45 0 2.8-.35 1.36-.35 2.7-1.06v2.36q-1.36.57-2.77.87-1.42.29-2.88.29-3.65 0-5.78-2.11-2.13-2.11-2.13-5.71 0-3.72 2.02-5.91 2.02-2.18 5.46-2.18 3.08 0 4.87 1.97 1.79 1.96 1.79 5.35Zm-2.51-.74q-.02-2.04-1.13-3.25-1.13-1.22-3-1.22-2.09 0-3.35 1.17-1.26 1.18-1.45 3.32l8.93-.02Z"/>
    <!-- ] -->
    <path class="bracket" d="M49.35 -3.87V33.2H40.69V30.3H45.57V-0.97H40.69V-3.87H49.35Z"/>
  </g>
</svg>

/brand/icons/favicon.svg (same as symbol; you can symlink or duplicate)
Generate favicon.ico (16/32/48) from SVG:

# Using ImageMagick v7+

magick -background none /brand/icons/favicon.svg -define icon:auto-resize=16,32,48 /brand/icons/favicon.ico

Maskable icon (PWA / Android adaptive) — /brand/icons/maskable.svg
(Full-bleed background; safe 10% inset so the “[ e ]” survives circle/squircle masks.)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <style>
      .bg { fill: #111827; }    /* dark tile */
      .br { fill: #A5B4FC; }    /* light indigo for contrast on dark */
      .tx { fill: #FFFFFF; }    /* reversed */
    </style>
  </defs>
  <rect class="bg" width="512" height="512" rx="96" ry="96"/>
  <g transform="translate(96,120) scale(5.7)">  <!-- approx 10% inset -->
    <path class="br" d="M12.32 -3.87H20.98V-0.97H16.08V30.3H20.98V33.2H12.32V-3.87Z"/>
    <path class="tx" d="M38.35 19.52v1.21H26.82q.17 2.58 1.56 3.92 1.4 1.35 3.89 1.35 1.45 0 2.8-.35 1.36-.35 2.7-1.06v2.36q-1.36.57-2.77.87-1.42.29-2.88.29-3.65 0-5.78-2.11-2.13-2.11-2.13-5.71 0-3.72 2.02-5.91 2.02-2.18 5.46-2.18 3.08 0 4.87 1.97 1.79 1.96 1.79 5.35Zm-2.51-.74q-.02-2.04-1.13-3.25-1.13-1.22-3-1.22-2.09 0-3.35 1.17-1.26 1.18-1.45 3.32l8.93-.02Z"/>
    <path class="br" d="M49.35 -3.87V33.2H40.69V30.3H45.57V-0.97H40.69V-3.87H49.35Z"/>
  </g>
</svg>

Export PNGs:

# resvg or inkscape will produce sharper PNGs than headless browsers

resvg /brand/icons/maskable.svg -w 180 -o /brand/icons/apple-touch-icon-180.png
resvg /brand/icons/maskable.svg -w 192 -o /brand/icons/icon-192-maskable.png
resvg /brand/icons/maskable.svg -w 512 -o /brand/icons/icon-512-maskable.png

Safari pinned tab (monochrome) — /brand/symbol/safari-pinned-tab.svg

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g fill="currentColor" transform="translate(4,11)">
    <path d="M12.32 -3.87H20.98V-0.97H16.08V30.3H20.98V33.2H12.32V-3.87Z"/>
    <path d="M38.35 19.52v1.21H26.82q.17 2.58 1.56 3.92 1.4 1.35 3.89 1.35 1.45 0 2.8-.35 1.36-.35 2.7-1.06v2.36q-1.36.57-2.77.87-1.42.29-2.88.29-3.65 0-5.78-2.11-2.13-2.11-2.13-5.71 0-3.72 2.02-5.91 2.02-2.18 5.46-2.18 3.08 0 4.87 1.97 1.79 1.96 1.79 5.35Zm-2.51-.74q-.02-2.04-1.13-3.25-1.13-1.22-3-1.22-2.09 0-3.35 1.17-1.26 1.18-1.45 3.32l8.93-.02Z"/>
    <path d="M49.35 -3.87V33.2H40.69V30.3H45.57V-0.97H40.69V-3.87H49.35Z"/>
  </g>
</svg>

Web App Manifest — /brand/icons/site.webmanifest

{
"name": "Equilens",
"short_name": "Equilens",
"start_url": "/",
"display": "standalone",
"background_color": "#FFFFFF",
"theme_color": "#4F46E5",
"icons": [
{ "src": "/brand/icons/icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
{ "src": "/brand/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
]
}

HTML <head> snippet

<link rel="icon" href="/brand/icons/favicon.ico" sizes="any">
<link rel="icon" href="/brand/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/brand/icons/apple-touch-icon-180.png">
<link rel="manifest" href="/brand/icons/site.webmanifest">
<meta name="theme-color" content="#4F46E5">

⸻

3. OG / Social templates (SVG you can export to PNG)

/brand/social/og-1200x630.svg (Facebook/LinkedIn)

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .bg { fill: #FFFFFF; }
      .ink { fill: #111827; }
      .muted { fill: #6B7280; }
      .brand { fill: #4F46E5; }
    </style>
  </defs>
  <rect class="bg" width="1200" height="630"/>
  <!-- Safe margins (6% each side) -->
  <rect x="72" y="38" width="1056" height="554" fill="none" stroke="#E5E7EB" stroke-dasharray="8,8" pointer-events="none"/>

  <!-- Wordmark (light) placed top-left -->
  <g transform="translate(96,110) scale(1.15)">
    <!-- reuse wordmark paths (light version colors) -->
    <!-- Left [ -->
    <path class="brand" d="M 53.38 1.56 L 64.36 1.56 L 64.36 5.24 L 58.14 5.24 L 58.14 44.85 L 64.36 44.85 L 64.36 48.53 L 53.38 48.53 L 53.38 1.56 Z"/>
    <!-- e … (paths omitted for brevity – paste from light wordmark) -->
  </g>

  <!-- Headline placeholder -->
  <text x="96" y="330" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="64" fill="#111827">
    Your headline fits here
  </text>
  <text x="96" y="390" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="32" class="muted">
    Optional subheading or summary line
  </text>

  <!-- Accent bar -->
  <rect x="96" y="420" width="240" height="8" class="brand"/>
</svg>

/brand/social/og-1200x600.svg (X/Twitter large summary, 2:1)

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <defs>
    <style>
      .bg { fill: #111827; }   /* dark variant reads better on X */
      .ink { fill: #FFFFFF; }
      .brand { fill: #A5B4FC; } /* tuned for dark */
      .muted { fill: #D1D5DB; }
    </style>
  </defs>
  <rect class="bg" width="1200" height="600"/>
  <rect x="72" y="36" width="1056" height="528" fill="none" stroke="#374151" stroke-dasharray="8,8" pointer-events="none"/>

  <!-- Wordmark (dark variant) -->
  <g transform="translate(96,108) scale(1.15)">
    <!-- paste the 'dark' wordmark paths -->
  </g>

<text x="96" y="318" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="64" class="ink">Your headline fits here</text>
<text x="96" y="378" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="32" class="muted">Optional subheading or summary line</text>
<rect x="96" y="408" width="240" height="8" class="brand"/>
</svg>

Export these as PNG (not SVG) when posting to social to avoid conversion quirks.

⸻

4. Design tokens (CSS + JSON)

/brand/tokens/tokens.css

:root[data-theme="light"]{
--brand-500:#4F46E5; /_ primary _/
--brand-700:#4338CA; /_ hover on light _/
--ink-900:#111827; /_ primary text on light _/
--ink-700:#374151; /_ headings/dense UI _/
--muted-500:#6B7280; /_ secondary text _/
--bg:#FFFFFF;
--surface:#F9FAFB;

--success-600:#16A34A;
--warning-600:#D97706;
--danger-600:#DC2626;

--radius-1:6px;
--radius-2:12px;

--ease-standard:cubic-bezier(.2,.8,.2,1);
--dur-fast:150ms;
--dur-med:250ms;
}

:root[data-theme="dark"]{
--brand-400:#A5B4FC; /_ tuned for AA+ against dark _/
--brand-500:#A5B4FC;
--ink-900:#FFFFFF; /_ reversed text _/
--ink-700:#E5E7EB;
--muted-500:#9CA3AF;
--bg:#111827;
--surface:#1F2937;

--success-500:#22C55E;
--warning-500:#F59E0B;
--danger-500:#EF4444;

--radius-1:6px;
--radius-2:12px;

--ease-standard:cubic-bezier(.2,.8,.2,1);
--dur-fast:150ms;
--dur-med:250ms;
}

/_ Example logo embedding _/
.logo { color: var(--ink-900); }
.logo--brand { color: var(--brand-500); }

/brand/tokens/tokens.json

{
"color": {
"brand": { "500": "#4F46E5", "700": "#4338CA", "dark-500": "#A5B4FC" },
"ink": { "900": "#111827", "700": "#374151", "rev": "#FFFFFF" },
"muted": { "500": "#6B7280", "dark": "#9CA3AF" },
"bg": { "light": "#FFFFFF", "dark": "#111827" },
"surface": { "light": "#F9FAFB", "dark": "#1F2937" },
"state": {
"success": { "light": "#16A34A", "dark": "#22C55E" },
"warning": { "light": "#D97706", "dark": "#F59E0B" },
"danger": { "light": "#DC2626", "dark": "#EF4444" }
}
},
"radius": { "1": "6px", "2": "12px" },
"motion": {
"ease-standard": "cubic-bezier(.2,.8,.2,1)",
"dur-fast": "150ms",
"dur-med": "250ms"
}
}

⸻

5. Guidelines (clearspace, min sizes, contrast, usage)

/brand/guidelines/brand-guidelines.md

# Equilens — Brand Guidelines (v1)

## 1. Logo system

- **Primary wordmark (light)**: For white/very light backgrounds.
- **Primary wordmark (dark)**: For dark backgrounds (#111827 and darker). Brackets + dot use #A5B4FC for AA+ contrast.
- **Mono wordmark**: Single-ink production; set `color` in CSS/print.
- **Symbol (monogram)**: “[ e ]” — for favicons, app icons, and tiny UI.

### Clearspace

Use a margin equal to **10% of the wordmark’s height** on all sides. Keep type/graphics outside this zone.

### Minimum sizes

- **Wordmark**: digital **≥ 160 px** width (ideal ≥ 200 px). Print **≥ 40 mm** wide.
- **Symbol**: digital **≥ 16 px**, preferred **≥ 24 px**.

### Don’ts

- Don’t alter colors outside provided variants.
- Don’t add strokes/shadows/outlines.
- Don’t distort, squash, or animate letters.
- Don’t place the light logo on mid/dark photos; use the dark or mono variant.

## 2. Color & contrast

- Light mode body text on white: **#111827** (AA/AAA).
- Dark mode text on charcoal: **#FFFFFF** / **#E5E7EB** for secondary.
- Brand on dark: use **#A5B4FC** for brackets/dot to maintain contrast; avoid #4F46E5 directly on #111827 for UI text.

## 3. Typography

- Product/UI: `Inter var`, `system-ui`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, sans-serif.
- Display/headlines can increase weight (700–900) with tight tracking; body 400–500.
- Recommended scale: 12, 14, 16, 20, 24, 32, 40, 56, 72 (rem‑based).

## 4. Social imagery

- **Facebook/LinkedIn**: 1200×630 (1.91:1).
- **X (Twitter)**: 1200×600 (2:1).
- Keep a **6% safe margin** on all sides; keep headline ≤ 2 lines.

## 5. File formats

- Logos: **SVG** (preferred), with PNG exports when needed. Avoid JPEG for marks.
- Icons: `favicon.ico` (16/32/48), `favicon.svg`, 180 touch icon, 192/512 maskable PNGs.
- Safari pinned tab: monochrome SVG, color set via HTML.

## 6. Motion

- Use subtle transitions: 150–250 ms, `cubic-bezier(.2,.8,.2,1)`. No bounce on the logo.

⸻

6. README (how to export & test)

/brand/README.md

# Equilens Brand Package

## Export commands

# Favicon ICO

magick -background none ./icons/favicon.svg -define icon:auto-resize=16,32,48 ./icons/favicon.ico

# Maskable icons & Apple touch

resvg ./icons/maskable.svg -w 180 -o ./icons/apple-touch-icon-180.png
resvg ./icons/maskable.svg -w 192 -o ./icons/icon-192-maskable.png
resvg ./icons/maskable.svg -w 512 -o ./icons/icon-512-maskable.png

## Inline usage

<!-- light -->

<object type="image/svg+xml" data="/brand/logo/equilens-wordmark-light.svg" class="logo"></object>

<!-- dark -->
<div data-theme="dark">
  <object type="image/svg+xml" data="/brand/logo/equilens-wordmark-dark.svg" class="logo"></object>
</div>

## Accessibility checks

- Maintain AA contrast for all text; prefer #A5B4FC for brand elements on dark.
- Always include <title> in SVGs for assistive tech.
- Provide text alternatives near hero logos (company name in HTML).

## Release checklist

- [ ] Update `site.webmanifest` paths if you change directories.
- [ ] Verify favicons on Chrome/Firefox/Safari (16/32/48).
- [ ] Verify OG crops via platform debuggers.

⸻

Anything else you want in v1?

If you’d like, I can also add:
• Keynote/Slides cover and content templates,
• Email signature and press one‑sheet,
• A tiny component library (buttons, tags) that consumes the tokens.

If you drop this into a repo and tell me where you want paths adjusted (e.g., /static/brand/...), I’ll tailor the paths and, if helpful, add a SVGO config to keep the SVGs ultra‑lean.
