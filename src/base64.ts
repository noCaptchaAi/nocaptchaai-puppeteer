import axios from 'axios';

export const getBase64 = async (url: string): Promise<string> => {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(data, 'binary').toString('base64');
};
