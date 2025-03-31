/* eslint-disable sonarjs/pseudo-random */
export const getRandomFloat = <T extends number = number>(
  min = 0,
  max = 1,
): T => (Math.random() * (max - min) + min) as T;

export const getRandomInt = <T extends number = number>(min = 0, max = 1): T =>
  min === max ? (min as T) : (Math.round(getRandomFloat(min, max)) as T);

export const getRandomChoice = <T>(arr: T[]): T =>
  arr[getRandomInt(0, arr.length - 1)];

export const getRandomSizeArray = (min = 0, max = 10) =>
  Array.from({ length: getRandomInt(min, max) }).fill(null);

export const getRandomBool = () => getRandomInt(0, 1) === 1;

export const getMajorRandomBool = () => {
  return getRandomInt(0, 10) <= 6;
};

export const getMinorRandomBool = () => {
  return !getMajorRandomBool();
};

export const getFrequencyValue = (frequency: number) => {
  return Math.random() < frequency;
};
