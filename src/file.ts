/* eslint-disable sonarjs/no-base-to-string */

export const getBase64FromFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result!.toString());
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};

export const getTextFromFile = (file: File, encoding?: string) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);
    reader.onload = function () {
      resolve(reader.result!.toString());
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};
