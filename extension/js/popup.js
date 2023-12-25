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

document.addEventListener('DOMContentLoaded', function () {
  restore();
  document.getElementById('save').addEventListener('click', save);
});
