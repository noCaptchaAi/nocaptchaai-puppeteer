import type { Frame } from 'puppeteer';
import { getBase64 } from './base64';

export const getImages = async (frame: Frame): Promise<{ [key: number]: string }> => {
  const data: { [key: number]: string } = {};

  await frame.waitForSelector('.image');

  await frame.waitForFunction(() => {
    const wrapperLoaded = document.querySelector('.task-image .image');
    const imagesLoaded: boolean[] = [];
    document
      .querySelectorAll('.task-image .image')
      .forEach(img => imagesLoaded.push((img as HTMLElement).style.background.includes('url')));

    return wrapperLoaded && imagesLoaded.every(i => i);
  });

  const images = await frame.$$('.task-image');
  if (!images) throw new Error('getImages: no images found');

  for (const [index, img] of images.entries()) {
    const value = await img.$eval('.image', el =>
      getComputedStyle(el).getPropertyValue('background')
    );
    const url = /url\("(.*)"/.exec(value);
    if (!url) throw new Error('getImages: no image url found');

    data[index] = await getBase64(url[1]);
  }

  return data;
};
