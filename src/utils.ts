import type { subscriptionType } from './type';

export const sleep = async (ms: number): Promise<void> =>
  await new Promise(resolve => setTimeout(resolve, ms));

export const getApiUrl = (type: subscriptionType): string =>
  `https://${type}.nocaptchaai.com/api/solve`;

export const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);
