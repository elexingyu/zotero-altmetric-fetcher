import { initZToolkit } from "./utils/ztoolkit";
import { registerPrefs } from "./modules/preferenceScript";
import { registerAltmetricMenuItems } from "./modules/altmetricMenu";
import { AltmetricFetcher } from "./addon";

const addon = new AltmetricFetcher();

// This function is the entry point for the add-on.
// When the add-on starts up, this is the function that is called.
function onStartup() {
  addon.data.alive = true;
  addon.data.env = __env__;
  
  initZToolkit();

  // Register the main preference UI
  registerPrefs(addon);

  // Register the menu items for Altmetric fetching
  registerAltmetricMenuItems(addon);
  
  // Log that the plugin has started
  addon.log("Altmetric Fetcher plugin startup complete.");
}

function onShutdown() {
  addon.data.alive = false;
  
  // Unregister all menu items, UI elements, etc. from ztoolkit
  ztoolkit.unregisterAll();
  
  addon.log("Altmetric Fetcher plugin shutdown complete.");
}

// Add the main addon object to the global window scope
(function () {
  const _global = typeof window !== "undefined" ? window : global;
  _global.Zotero = _global.Zotero || {};
  _global.Zotero.AltmetricFetcher = addon;
})();

// Add hooks to the addon object
addon.hooks = {
  onStartup,
  onShutdown,
};

// Export for importing
export { onStartup, onShutdown }; 