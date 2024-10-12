export function normalizeStr(str: string) {
  return str.replace(/[\|&;\$%@"<>\(\)\+,/]/g, "").normalize("NFC");
}
