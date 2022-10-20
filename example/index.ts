import puppeteer from 'puppeteer';
import { solveCaptcha } from '../src';

const URL = 'https://accounts.hcaptcha.com/demo';

const API_KEY = ''; // <-- your API key here
const UID = ''; // <-- your UID here

const main = async (): Promise<void> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(URL);
  await page.waitForNetworkIdle();

  await solveCaptcha(page, API_KEY, UID, 'free');

  await page.screenshot({ path: 'test.jpeg', type: 'jpeg' });

  await browser.close();
};

main();
