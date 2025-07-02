export function processBase64ImageString(initialImage: string) {
  const base64Regex = /^data:image\/png;base64,/;
  const isBase64 = base64Regex.test(initialImage);
  return isBase64 ? initialImage : `data:image/png;base64,${initialImage}`;
}
