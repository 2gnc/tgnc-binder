import isNaN from 'lodash/isNaN';

export function safeNumParse(value: string): number {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
