import { AltmetricFetcher } from "../addon";
import { localeUtils } from "../utils/locale";

/**
 * 在条目右键菜单中添加 Altmetric 相关选项
 * @param addon AltmetricFetcher 实例
 */
export function registerAltmetricMenuItems(addon: AltmetricFetcher) {
  // 添加获取所选条目的 Altmetric 分数菜单项
  ztoolkit.Menu.register("item", {
    id: "altmetric-fetcher-selected",
    label: localeUtils.getString("menu-item-selected"),
    // 仅在选择了条目时显示菜单项
    condition: {
      type: "normal",
      eval: () => {
        const items = Zotero.getActiveZoteroPane().getSelectedItems();
        return items.length > 0;
      },
    },
    callback: () => {
      addon.updateSelectedItems();
    },
  });
  
  // 添加获取所有条目的 Altmetric 分数菜单项
  ztoolkit.Menu.register("item", {
    id: "altmetric-fetcher-all",
    label: localeUtils.getString("menu-item-all"),
    condition: {
      type: "normal",
      eval: () => true, // 始终显示
    },
    callback: () => {
      const confirmMessage = localeUtils.getString("confirm-all");
      if (confirm(confirmMessage)) {
        addon.updateAllItems();
      }
    },
  });
} 