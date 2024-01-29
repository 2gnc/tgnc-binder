import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';

export const nonEmptyStringsArrTransformer = (arr: Array<string>): Array<string> => filter(arr, el => !isEmpty(el));
