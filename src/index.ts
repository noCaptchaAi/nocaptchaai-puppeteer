import axios from 'axios';
import type { Page } from 'puppeteer';
import { getImages } from './images';
import { getTarget } from './target';
import { randTimer, subscriptionType } from './type';
import { findURLParam, getApiUrl, sleep } from './utils';

/**
 * Solve captchas using `nocaptchaai.com` API service
 *
 * @param page - Puppeteer page instance
 * @param apiKey - API key
 * @param uid - UID
 * @param type - `free` or `pro`
 * @param debug - true or false
 */
export const solveCaptcha = async (
  page: Page,
  apiKey: string,
  uid: string,
  type: subscriptionType,
  debug: boolean
): Promise<void> => {
  const outer = await page.waitForSelector('iframe[data-hcaptcha-response]');
  const outerFrame = await outer?.contentFrame();
  const inner = await page.waitForSelector('iframe:not([data-hcaptcha-response])');
  const innerFrame = await inner?.contentFrame();
  if (!outerFrame) throw new Error('solveCaptcha: captcha outer frame not found');
  if (!innerFrame) throw new Error('solveCaptcha: captcha inner frame not found');

  const checkbox = await outerFrame.waitForSelector('#checkbox');

  if (!(await innerFrame.$('.challenge'))) await checkbox?.click();

  // await sleep(500000); // debug waiting

  try {
    // const language = await page.evaluate(() => document.documentElement.lang); // doesn't work
    const language = await innerFrame.evaluate(() => document.documentElement.lang);

    if (debug) console.log('🌍 Language found = ', language);

    const sitekey = findURLParam(new URLSearchParams(innerFrame.url()), key =>
      key.includes('sitekey')
    );

    await innerFrame.waitForSelector('.challenge-container', { timeout: 10 * 1000 });

    while ((await outerFrame.$('#checkbox[aria-checked=false]')) !== null) {
      const images = await getImages(innerFrame);
      if (debug && images) console.log('🔍 Puzzle Images found');
      const target = await getTarget(innerFrame);
      if (debug && target) console.log('🔍 Target = ', target);

      const imageElements = await innerFrame.$$('.task-image');
      if (!imageElements) throw new Error('solveCaptcha: captcha images not found');

      const { data: query } = await axios.post(
        getApiUrl(type),
        {
          softid: 'pptr-pkg',
          method: 'hcaptcha_base64',
          site: page.url(),
          ln: language,
          sitekey,
          images,
          target
        },
        {
          headers: {
            'Content-type': 'application/json',
            'apikey': apiKey,
            'uid': uid
          }
        }
      );

      switch (query.status) {
        case 'solved': {
          console.log('✅', query.status);
          console.log('---------✓---------');
          for (const item of query.solution) {
            await imageElements[item].click();
            await sleep(randTimer(200, 350));
            // await sleep(200);
          }

          break;
        }

        case 'new': {
          if (debug) console.log('⏳ waiting a second');
          for (let i = 0; i < 10; i++) {
            await sleep(1000);
            const { data: result } = await axios.get(query.url);

            if (result.status === 'solved') {
              if (debug) console.log('🖲️ clicking images');
              for (const item of result.solution) {
                await imageElements[item].click();

                await sleep(randTimer(200, 350));
                // await sleep(200);
              }

              break;
            }
          }

          break;
        }

        case 'skip': {
          console.log('😨 Seems this a new challenge, please contact noCaptchaAi!');
          console.error(query.message);
          throw new Error('😨 Seems this a new challenge, please contact noCaptchaAi!');
        }

        case 'error': {
          console.log('😨 Error');
          console.error(query.message);
          throw new Error('😨 Error');
        }

        default: {
          console.log('😨 Unknown status');
          console.error(query);
          throw new Error('😨 Unknown status');
        }
      }

      const button = await innerFrame.$('.button-submit');
      if (debug) console.log('⌛ waiting a second');
      await button?.click();
      await sleep(1000);
    }
  } catch (err) {
    const isSolved = (await outerFrame.$('#checkbox[aria-checked=true]')) !== null;
    if (debug) console.log('☑️  Seems puzzle solved');
    if (!isSolved) throw err;
    if (debug && !isSolved) console.log("⁉️ couldn't solve");
  }
};
