/**
 * 値が null でないことを確かめる
 *
 * @param nullable null でないことを確かめる値
 * @param errorMessage null の場合のエラーメッセージ
 * @throws null の場合
 */
export function notNull<T>(nullable: T | null, errorMessage: string): T {
  if (nullable === null) {
    throw new Error(errorMessage);
  }
  return nullable;
}
