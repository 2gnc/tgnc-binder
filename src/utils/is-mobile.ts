import UAParser from 'ua-parser-js';

const { device } = new UAParser().getResult();
export const IS_MOBILE = device.type === 'mobile';
