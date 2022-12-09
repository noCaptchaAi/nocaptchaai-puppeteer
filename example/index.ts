import puppeteer from 'puppeteer';
import { solveCaptcha } from '../src/index';

const URL = 'https://accounts.hcaptcha.com/demo';

//**** get apikey here -> http://nocaptchaai.com *****
const API_KEY = ''; // <-- your API key here
const UID = ''; // <-- your UID here
const lang = 'en'; // desired language. 'en' = english, 'ru' = russian

const main = async (): Promise<void> => {
  const browser = await puppeteer.launch({ headless: false, args: [`--lang=${lang}`] });
  const page = await browser.newPage();
  await page.goto(URL);
  await page.waitForNetworkIdle();

  await solveCaptcha(page, API_KEY, UID, 'free', true); // params: 'free or pro', 5) debug -> true or false

  await page.screenshot({ path: `example/test.jpeg`, type: 'jpeg' });

  await browser.close();
};

main();
