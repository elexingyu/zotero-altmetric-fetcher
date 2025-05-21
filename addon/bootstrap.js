// This is the bootstrap script
// It is used to set up the extension when it is installed, enabled, disabled, or uninstalled

// Import Zotero resources
const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.importGlobalProperties(["Blob", "URL"]);

// Needed for bootstrap.js
var console = {
  log: function (msg) {
    Zotero.debug(`Altmetric Fetcher: ${msg}`);
  },
  warn: function (msg) {
    Zotero.debug(`Altmetric Fetcher WARNING: ${msg}`);
  },
  error: function (msg) {
    Zotero.debug(`Altmetric Fetcher ERROR: ${msg}`);
  },
};

// Bootstrap methods
function install(data, reason) {}

function uninstall(data, reason) {}

// In case of bug in Zotero 7, don't replace these placeholders
/* eslint-disable no-undef */
const API_VERSION = 3;
const REQUIRED_ZOTERO_VERSION = "6.999";
/* eslint-enable */

var gResourcesReg;
let gResources = [];

/**
 * Start the addon.
 * 
 * @param {Object} data 
 * @param {Number} reason 
 */
async function startup({ id, version, resourceURI, rootURI = resourceURI.spec }, reason) {
  try {
    // Wait for Zotero to be ready
    await waitForZotero();

    // Add the main script that starts the plugin
    addResourceAlias(id, rootURI);
    await loadMain(rootURI);
  } catch (error) {
    console.error(`Altmetric Fetcher failed to start: ${error}`);
  }
}

/**
 * Stop the addon.
 * 
 * @param {Object} data 
 * @param {Number} reason 
 */
function shutdown({ id, version, resourceURI, rootURI = resourceURI.spec }, reason) {
  if (reason === APP_SHUTDOWN) {
    return;
  }

  if (Zotero.AltmetricFetcher && Zotero.AltmetricFetcher.hooks) {
    Zotero.AltmetricFetcher.hooks.onShutdown();
  }

  removeResourceAlias(id);
  
  // Remove script
  const scripts = document.querySelectorAll(`[src*="altmetricfetcher"]`);
  scripts.forEach((script) => script.remove());

  // Clear any global references to the plugin
  Zotero.AltmetricFetcher = undefined;

  if (gResources.length) {
    for (const resource of gResources) {
      try {
        resource.parentNode.removeChild(resource);
      } catch (error) {
        console.error(`Failed to remove resource: ${error}`);
      }
    }
    gResources = [];
  }

  // Clean up resource registrations
  if (gResourcesReg) {
    try {
      gResourcesReg.unload();
      gResourcesReg = undefined;
    } catch (error) {
      console.error(`Failed to unload resources: ${error}`);
    }
  }

  console.log("Altmetric Fetcher shutdown completed");
}

/**
 * 
 * @param {String} id Extension ID
 * @param {String} rootURI Extension root URI
 */
function addResourceAlias(id, rootURI) {
  if (gResourcesReg) return;
  if (Zotero.version.split('.')[0] >= 7) {
    // Zotero 7 资源别名注册
    const ns = id.match(/^[^@]*/)

    const resProtocolHandler = Cc[
      '@mozilla.org/network/protocol;1?name=resource'
    ].getService(Ci.nsIResProtocolHandler);

    const aliasURI = resProtocolHandler.resolveURI(
      Services.io.newURI('resource://zotero')
    );

    console.log(`Register resource: ${ns}, ${rootURI}`);
    resProtocolHandler.setSubstitution(
      ns,
      Services.io.newURI(rootURI)
    );

    console.log(`Registered chrome://${ns}/ to ${rootURI}`);
    gResourcesReg = {
      unload: () => {
        resProtocolHandler.setSubstitution(ns, null);
      }
    };
  }
}

/**
 * 
 * @param {String} id Extension ID
 */
function removeResourceAlias(id) {
  if (!gResourcesReg) return;

  try {
    gResourcesReg.unload();
  }
  catch (e) {
    console.error("Failed to remove resource alias:", e);
  }
  gResourcesReg = undefined;
}

/**
 * Load the main entry script of the plugin
 * 
 * @param {String} rootURI Extension root URI
 */
function loadMain(rootURI) {
  return new Promise((resolve, reject) => {
    // Set a timeout to avoid hanging 
    let timeout = setTimeout(() => {
      reject(new Error("Loading main script timed out"));
    }, 30000); // 30 seconds
    
    // Create script element
    const mainScript = document.createElement("script");
    mainScript.id = "altmetric-fetcher-script";
    mainScript.type = "text/javascript";
    mainScript.src = rootURI + "content/scripts/altmetricfetcher.js";
    
    // Add event listeners
    mainScript.addEventListener("load", () => {
      clearTimeout(timeout);
      resolve();
    });
    
    mainScript.addEventListener("error", (e) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load main script: ${e.message}`));
    });
    
    // Add script to document
    document.documentElement.appendChild(mainScript);
    gResources.push(mainScript);
  });
}

/**
 * Wait for Zotero to be fully loaded
 */
function waitForZotero() {
  return new Promise((resolve, reject) => {
    if (typeof Zotero === "object") {
      if (Zotero.initialized) {
        resolve();
      }
      else {
        const loadObserver = {
          observe(subject, topic) {
            if (topic === "zotero-loaded") {
              Services.obs.removeObserver(this, "zotero-loaded");
              resolve();
            }
          },
        };
        
        Services.obs.addObserver(loadObserver, "zotero-loaded");
      }
    }
    else {
      reject(new Error("Zotero object not found"));
    }
  });
} 