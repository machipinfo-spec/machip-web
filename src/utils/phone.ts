/** 日本の電話番号をE.164形式(+81...)へ正規化する。不正ならnull */
export function normalizeJapanesePhone(input: string): string | null {
  const digits = input.replace(/[-‐ー−\s()]/g, "");
  if (/^\+81[1-9]\d{8,9}$/.test(digits)) return digits;
  if (/^0[1-9]\d{8,9}$/.test(digits)) return `+81${digits.slice(1)}`;
  return null;
}
