# Navkar

A private, read-only phone web app for Operation Navkar: ten AI agents each running ₹10,000 in NSE delivery stocks under the same exits, raced against an unfunded ghost that buys a random stock every time an agent buys. It is one static page (`index.html`, all styles and scripts inline, no external requests) served by GitHub Pages at https://ckglobalorg.github.io/navkar/ and installable to the iPhone home screen. It reads only `data.json`, which a scheduled cloud run rewrites after the close each trading day; the app shows, it never places an order.
