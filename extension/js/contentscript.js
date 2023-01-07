const container = document.head || document.documentElement;

// load bundle.js
const scriptTag = document.createElement('script');
scriptTag.setAttribute('async', 'false');
scriptTag.src = chrome.runtime.getURL('js/bundle.js');
container.insertBefore(scriptTag, container.children[0]);
container.removeChild(scriptTag);