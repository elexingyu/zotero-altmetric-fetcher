import { AltmetricFetcher } from "../addon";

/**
 * 注册插件首选项设置
 * @param addon AltmetricFetcher 实例
 */
export function registerPrefs(addon: AltmetricFetcher) {
  // 注册首选项窗口
  const prefOptions = {
    pluginID: "altmetricfetcher@example.com",
    src: "chrome://altmetricfetcher/content/preferences.xhtml",
    label: "Altmetric Fetcher",
    image: "chrome://altmetricfetcher/content/icons/favicon.png",
    defaultXUL: true,
  };
  
  ztoolkit.PreferencePane.register(prefOptions);
  
  // 注册首选项事件监听器
  ztoolkit.Preference.registerCallback(
    "extensions.zotero.altmetricfetcher",
    (pref: string, value: any) => {
      addon.log(`Preference changed: ${pref} = ${value}`);
    }
  );
} 