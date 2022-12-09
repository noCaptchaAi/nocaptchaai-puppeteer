export type subscriptionType = 'free' | 'pro';
export function randTimer(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
