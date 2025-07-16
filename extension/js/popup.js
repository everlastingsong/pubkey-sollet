function save() {
  const nicknames = document.getElementsByName("nickname");
  const pubkeys = document.getElementsByName("pubkey");
  const config = { frequentlyUsedPubkeys: [] };
  for (var i = 0; i < nicknames.length; i++) {
    const nickname = nicknames[i].value;
    const pubkey = pubkeys[i].value;
    config.frequentlyUsedPubkeys.push({ nickname, pubkey });
  }
  chrome.storage.local.set({ config }, function() {
    // change save button title "Saved!" in 1 seconds
    const saveButton = document.getElementById('save');
    saveButton.innerHTML = "Saved!";
    saveButton.disabled = true;
    setTimeout(function() {
      saveButton.innerHTML = "Save";
      saveButton.disabled = false;
    }, 1000);
  });
}

function restore() {
  chrome.storage.local.get("config", function({config}) {
    const frequentlyUsedPubkeys = config.frequentlyUsedPubkeys || [];

    const nicknames = document.getElementsByName("nickname");
    const pubkeys = document.getElementsByName("pubkey");

    for (var i = 0; i < nicknames.length; i++) {
      if (!frequentlyUsedPubkeys[i]) break;

      const nickname = frequentlyUsedPubkeys[i].nickname;
      const pubkey = frequentlyUsedPubkeys[i].pubkey;
      nicknames[i].value = nickname;
      pubkeys[i].value = pubkey;
    }
  });
}

function buildPopup() {
  const configBtn = document.getElementById('config-btn');
  const txBtn = document.getElementById('tx-btn');
  const configSection = document.getElementById('config-section');
  const txSection = document.getElementById('tx-section');

  function selectTab(tab) {
    if (tab === 'config') {
      configBtn.classList.add('selected');
      txBtn.classList.remove('selected');
      configSection.classList.remove('hidden');
      txSection.classList.add('hidden');
    } else {
      configBtn.classList.remove('selected');
      txBtn.classList.add('selected');
      configSection.classList.add('hidden');
      txSection.classList.remove('hidden');
    }
  }

  configBtn.addEventListener('click', function() { selectTab('config'); });
  txBtn.addEventListener('click', function() { selectTab('tx'); });

  selectTab('config');

  document.getElementById('save').addEventListener('click', save);
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('pubkeysollet-popup-body')) {
    return;
  }

  buildPopup();
  restore();  
});
