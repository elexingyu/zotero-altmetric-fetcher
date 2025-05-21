/// <reference types="zotero-types/index" />

import { Toolkit } from "zotero-plugin-toolkit";
import { AltmetricFetcher } from "../src/addon";

declare global {
  declare const __env__: "development" | "production";
  
  declare namespace Zotero {
    const AltmetricFetcher: AltmetricFetcher;
  }
  
  declare const ztoolkit: Toolkit;
  
  interface Window {
    ztoolkit: Toolkit;
  }

  // 添加用于非 DOM/Zotero 全局对象的类型定义
  const Components: any;
  const Services: any;
  // 全局 API
  const OS: any;
  const FileUtils: any;
  const NetUtil: any;
} 