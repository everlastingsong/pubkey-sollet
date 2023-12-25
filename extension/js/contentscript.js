const container = document.head || document.documentElement;

chrome.storage.local.get("config", ({config}) => {
  // load bundle.js
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('async', 'false');
  scriptTag.src = chrome.runtime.getURL('js/bundle.js');
  // config is undefined if no config is saved
  scriptTag.setAttribute('config', JSON.stringify(config ?? {}));
  container.insertBefore(scriptTag, container.children[0]);
  container.removeChild(scriptTag);
});