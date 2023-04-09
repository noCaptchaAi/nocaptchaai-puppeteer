import puppeteer from 'puppeteer';
import { solveCaptcha } from '../src';

const URL = 'https://accounts.hcaptcha.com/demo';

const API_KEY = ''; // <-- your API key here

const main = async (): Promise<void> => {
  const browser = await puppeteer.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  await page.goto(URL);
  await page.waitForNetworkIdle();

  await solveCaptcha(page, API_KEY, 'free');

  await page.screenshot({ path: `example/test.jpeg`, type: 'jpeg' });

  await browser.close();
};

main();
