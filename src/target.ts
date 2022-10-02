import type { Frame } from 'puppeteer';

export const getTarget = async (frame: Frame): Promise<string> => {
  const targetElement = await frame.$('.prompt-text');
  const target = await targetElement?.evaluate(el => el.textContent);
  if (!target) throw new Error('getTarget: no target found');

  return target;
};
