import axios from 'axios';
import type { Page } from 'puppeteer';
import { CAPTCHA_API_URL } from './constants';
import { getImages } from './images';
import { getTarget } from './target';
import { sleep } from './utils';

/**
 * Solve captchas using `nocaptchaai.com` API service
 *
 * @param page - Puppeteer page instance
 * @param apiKey - API key
 * @param uid - UID
 */
export const solveCaptcha = async (page: Page, apiKey: string, uid: string): Promise<void> => {
  const outer = await page.waitForSelector('iframe[data-hcaptcha-response]');
  const outerFrame = await outer?.contentFrame();
  const inner = await page.waitForSelector('iframe:not([data-hcaptcha-response])');
  const innerFrame = await inner?.contentFrame();
  if (!innerFrame) throw new Error('solveCaptcha: captcha inner frame not found');
  if (!outerFrame) throw new Error('solveCaptcha: captcha outer frame not found');

  const checkbox = await outerFrame.waitForSelector('#checkbox');
  await checkbox?.click();

  try {
    const language = await page.evaluate(() => document.documentElement.lang);
    const sitekey = await page.$eval('.h-captcha', el => el.getAttribute('data-sitekey'));

    await innerFrame.waitForSelector('.challenge-container', { timeout: 10 * 1000 });

    while ((await outerFrame.$('#checkbox[aria-checked=false]')) !== null) {
      const images = await getImages(innerFrame);
      const target = await getTarget(innerFrame);

      const imageElements = await innerFrame.$$('.task-image');
      if (!imageElements) throw new Error('solveCaptcha: captcha images found');

      const { data: query } = await axios.post(
        CAPTCHA_API_URL,
        {
          softid: 'pptr-pkg',
          ln: language,
          site: page.url(),
          sitekey,
          images,
          target,
          method: 'hcaptcha_base64'
        },
        {
          headers: {
            'Content-type': 'application/json',
            'apikey': apiKey,
            'uid': uid
          }
        }
      );

      if (query.status === 'new') {
        await sleep(1000);

        let solved = false;
        while (!solved) {
          const { data: result } = await axios.get(query.url);

          if (result.status === 'solved') {
            for (const item of result.solution) {
              await imageElements[item].click();
              await sleep(200);
            }

            solved = true;
          }
        }
      }

      const button = await innerFrame.$('.button-submit');
      await button?.click();

      await sleep(1000);
    }
  } catch (err) {
    const isSolved = (await outerFrame.$('#checkbox[aria-checked=true]')) !== null;
    if (!isSolved) throw err;
  }
};
