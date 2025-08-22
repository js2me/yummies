export const getBase64FromFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result!.toString());
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getTextFromFile = (file: File, encoding?: string) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);
    reader.onload = () => {
      resolve(reader.result!.toString());
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
