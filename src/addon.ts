import { BasicTool, BasicOptions } from "zotero-plugin-toolkit/dist/basic";
import { localeUtils } from "./utils/locale";

/**
 * Altmetric Fetcher 插件类
 */
export class AltmetricFetcher extends BasicTool {
  private _showAltmetricLogs: boolean = true;

  /**
   * 插件的基本信息和状态数据
   */
  public data = {
    alive: false,
    // Environment: production or development
    env: "development" as "production" | "development",
  };

  /**
   * 插件初始化
   */
  constructor(base?: BasicOptions) {
    super(base);
  }
  
  /**
   * 记录日志信息
   * @param msg 日志消息
   */
  public log(msg: string) {
    if (this.data.env === "development" || this._showAltmetricLogs) {
      Zotero.debug(`[Altmetric Fetcher] ${msg}`);
    }
  }

  /**
   * 获取 Altmetric 分数
   * @param doi DOI 标识符
   * @returns Promise 返回 Altmetric 分数或错误信息
   */
  public async getAltmetricScore(doi: string): Promise<number | string> {
    const altmetricUrl = 'https://api.altmetric.com/v1/doi/';
    
    try {
      const response = await fetch(`${altmetricUrl}${doi}`);
      if (response.ok) {
        const data = await response.json();
        if (data.score) {
          return Math.round(data.score);
        }
        return localeUtils.getString("no-altmetric");
      }
      throw new Error('Failed to fetch Altmetric score');
    } catch (error) {
      this.log(`Error fetching Altmetric score for DOI ${doi}: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * 等待指定的毫秒数
   * @param ms 毫秒数
   * @returns Promise
   */
  public wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 处理单个文献条目
   * @param item Zotero 条目
   */
  public async updateItem(item: Zotero.Item): Promise<void> {
    this.log(`Processing item: ${item.id}`);
    
    const doi = item.getField('DOI') as string;
    if (!doi) {
      this.log(`Item ${item.id} has no DOI`);
      item.setField('extra', localeUtils.getString("missing-doi"));
      await item.saveTx();
      return;
    }

    try {
      const score = await this.getAltmetricScore(doi);
      const existingExtra = item.getField('extra') as string || '';
      item.setField('extra', `${existingExtra}\naltmetric: ${score}`.trim());
    } catch (err) {
      this.log(`Failed to get Altmetric score for item ${item.id}: ${(err as Error).message}`);
      item.setField('extra', localeUtils.getString("no-altmetric"));
    }

    await item.saveTx();

    // 在请求之间随机等待 0.5-2 秒，以避免 API 限制
    const delay = Math.floor(Math.random() * 1500) + 500;
    await this.wait(delay);
  }

  /**
   * 处理选中的文献条目
   */
  public async updateSelectedItems(): Promise<void> {
    const win = Zotero.getActiveZoteroPane();
    const selectedItems = win.getSelectedItems();

    if (!selectedItems.length) {
      this.log('No items selected');
      return;
    }

    this.log(`Processing ${selectedItems.length} selected items`);
    for (const item of selectedItems) {
      await this.updateItem(item);
    }
    
    this.log('Completed processing selected items');
  }

  /**
   * 处理当前库中的所有文献条目
   */
  public async updateAllItems(): Promise<void> {
    const win = Zotero.getActiveZoteroPane();
    const libraryID = win.getSelectedLibraryID();
    
    // 获取当前库中所有条目
    const s = new Zotero.Search();
    s.libraryID = libraryID;
    s.addCondition('itemType', 'isNot', 'attachment');
    s.addCondition('itemType', 'isNot', 'note');
    
    const itemIDs = await s.search();
    const items = await Zotero.Items.getAsync(itemIDs);
    
    this.log(`Processing all ${items.length} items in library`);
    
    for (const item of items) {
      await this.updateItem(item);
    }
    
    this.log('Completed processing all items');
  }
} 