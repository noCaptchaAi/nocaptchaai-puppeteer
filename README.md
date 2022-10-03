<div align="center">

# noCaptchaAI Puppeteer

<img src="assets/logo.png" alt="Logo" width="300" />
<br /><br /><br />

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) &nbsp; [![npm version](https://badge.fury.io/js/nocaptchaai-puppeteer.svg)](https://www.npmjs.com/package/nocaptchaai-puppeteer) &nbsp; [![Discord](https://img.shields.io/badge/chat%20on-Discord-7289da.svg)](https://discord.gg/E7FfzhZqzA) &nbsp; [![Telegram](https://img.shields.io/badge/chat%20on-Telegram-blue.svg)](https://t.me/noCaptchaAi)

</div>

## ❔ Introduction

Blazing fast hCaptcha solver based on NeuralNet image detection AI. Plug & Play package for solving hCaptcha and reCaptcha (soon) with Puppeteer.

## 🆓 Trial

Take a look at <a href="https://nocaptchaai.com/register">Here 🔥</a>

## ⭐️ Demo

https://user-images.githubusercontent.com/4178343/193613698-fed0f223-bf23-43e2-8e6a-7732b3a4b64f.mp4

## ⚙️ Install

- npm:

```bash
npm install nocaptchaai-puppeteer
```

- yarn:

```bash
yarn add nocaptchaai-puppeteer
```

- pnpm:

```
pnpm add nocaptchaai-puppeteer
```

## 🧪 Usage

```typescript
import { solveCaptcha } from 'nocaptchaai-puppeteer';
import puppeteer from 'puppeteer';

const URL = 'https://accounts.hcaptcha.com/demo';

const API_KEY = ''; // <-- your API key here
const UID = ''; // <-- your UID here

const main = async (): Promise<void> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(URL);
  await page.waitForNetworkIdle();

  await solveCaptcha(page, API_KEY, UID);

  await page.screenshot();

  await browser.close();
};

main();
```

## 💬 Community

- [Discord](https://discord.com/invite/E7FfzhZqzA)

- [Telegram](https://t.me/noCaptchaAi)
