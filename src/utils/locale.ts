/**
 * 本地化工具类
 */
export const localeUtils = {
  /**
   * 获取本地化字符串
   * @param key 字符串标识
   * @param params 参数对象
   * @returns 本地化后的字符串
   */
  getString(key: string, params?: { [key: string]: string | number }) {
    const addonRef = "altmetricfetcher";
    try {
      if (params) {
        return Zotero.getString(`${addonRef}-${key}`, params);
      } else {
        return Zotero.getString(`${addonRef}-${key}`);
      }
    } catch (error) {
      console.error(`获取本地化字符串失败：${key}，错误：${error}`);
      return key;
    }
  }
}; 