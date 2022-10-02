<div align="center">

# noCaptchaAI Puppeteer

<img src="assets/logo.png" alt="Logo" width="300" />
<br /><br /><br />

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) &nbsp; [![npm version](https://badge.fury.io/js/nocaptchaai-puppeteer.svg)](https://www.npmjs.com/package/nocaptchaai-puppeteer) &nbsp; [![Discord](https://img.shields.io/badge/chat%20on-Discord-7289da.svg)](https://discord.gg/E7FfzhZqzA) &nbsp; [![Telegram](https://img.shields.io/badge/chat%20on-Telegram-blue.svg)](https://t.me/noCaptchaAi)

</div>

## ❔ Introduction

Blazing fast hCaptcha solver based on NeuralNet image detection AI.

## 🆓 Trial

Take a look at <a href="https://nocaptchaai.com/register">Here 🔥</a>

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

const URL = 'https://shimuldn.github.io/hCaptchaSolverApi/demo_data/demo_sites/1/';

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

- [Discord](https://discord.gg/E7FfzhZqzA)

- [Telegram](https://t.me/noCaptchaAi)
