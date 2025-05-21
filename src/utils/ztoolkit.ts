import { Toolkit } from "zotero-plugin-toolkit";

/**
 * 在全局作用域中配置 ZToolkit 实例
 */
declare const window: Window & typeof globalThis & { ztoolkit: Toolkit };

/**
 * 工具包实例
 */
let _ztoolkit: Toolkit;

/**
 * 获取或创建 ztoolkit 实例
 * @returns ZToolkit 实例
 */
export function getZToolkit() {
  if (!_ztoolkit) {
    // 使用基础接口来使用 Zotero Utilities
    // @ts-ignore
    const _Zotero: any = typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
    
    _ztoolkit = new Toolkit({
      Zotero: _Zotero,
    });
  }
  return _ztoolkit;
}

/**
 * 初始化 ztoolkit 并将其添加到全局作用域
 */
export function initZToolkit() {
  // 获取 ztoolkit
  _ztoolkit = getZToolkit();
  
  // 将 ztoolkit 添加到全局作用域
  window.ztoolkit = _ztoolkit;
} 