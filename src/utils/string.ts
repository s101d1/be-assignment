// For generating a fixed length random number string
export function generateRandomNumber(length: number): string {
  let add = 1;
  let max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (length > max) {
    return generateRandomNumber(max) + generateRandomNumber(length - max);
  }

  max = Math.pow(10, length + add);
  let min = max / 10; // Math.pow(10, n) basically
  let number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}
