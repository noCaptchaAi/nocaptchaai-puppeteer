import type { subscriptionType } from './type';

export const sleep = async (ms: number): Promise<void> =>
  await new Promise(resolve => setTimeout(resolve, ms));

export const getApiUrl = (type: subscriptionType): string =>
  `https://${type}.nocaptchaai.com/api/solve`;

/**
 * Find URL param
 * @param params Your URL params
 * @param callback Callback that called every record in params
 * @returns [key, value]
 */
export const findURLParam = (
  params: URLSearchParams,
  callback: (key: string, value: string, index: number, params: URLSearchParams) => unknown
): [string, string] => {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const key = Array.from(params.keys()).find((key, index) =>
    callback(key, params.get(key)!, index, params)
  )!;
  return [key, params.get(key)!];
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
};

export const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);
