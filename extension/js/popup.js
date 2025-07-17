function saveConfig() {
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

function restoreConfig() {
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

function restoreLastTransactions() {
  chrome.storage.local.get("lastTransactions", function({lastTransactions}) {
    const lastTransactionsFrame = document.getElementById('last-transactions-frame');

    lastTransactions.forEach((tx) => {
      const transactionDiv = document.createElement('div');

      const versionDiv = document.createElement('div');
      transactionDiv.appendChild(versionDiv);
      const sizeDiv = document.createElement('div');
      transactionDiv.appendChild(sizeDiv);
      const instructionsTable = document.createElement('table');
      transactionDiv.appendChild(instructionsTable);

      versionDiv.innerText = `Version: ${tx.version}`;
      sizeDiv.innerText = `Size: ${tx.serialized.length}`;

      let instructionsTableInnerHTML = "";
      tx.instructions.forEach((ix, i) => {
        instructionsTableInnerHTML +=
        `
        <tr><td rowspan="3">${i}.</td><td colspan="2"><pre>${ix.programId}</pre></td></tr>
        <tr><td>Keys</td><td><pre>${ix.keys.map((k, i) => `${("[" + i + "]").padEnd(4, " ")} r${k.isWritable ? 'w' : '-'}${k.isSigner ? 's' : '-'} ${k.pubkey}`).join('\n')}</pre></td></tr>
        <tr><td>Data</td><td><pre style="white-space: pre-wrap; margin-bottom: 10pt;">${ix.data.map(d => d.toString(16).padStart(2, '0')).join(' ')}</pre></td></tr>
        `;
      });

      instructionsTable.className = "instructions-table";
      instructionsTable.innerHTML = instructionsTableInnerHTML;

      const serializedDiv = document.createElement('div');
      transactionDiv.appendChild(serializedDiv);
      serializedDiv.setAttribute("style", "font-size: small;")
      serializedDiv.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-all;">${btoa(String.fromCharCode(...tx.serialized))}</pre>`;

      lastTransactionsFrame.appendChild(transactionDiv);
    });

    if (lastTransactions.length > 0) {
      selectTab('tx');
    }
  });
}

function selectTab(tab) {
  const configBtn = document.getElementById('config-btn');
  const txBtn = document.getElementById('tx-btn');
  const configSection = document.getElementById('config-section');
  const txSection = document.getElementById('tx-section');

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

function buildPopup() {
  const configBtn = document.getElementById('config-btn');
  const txBtn = document.getElementById('tx-btn');

  configBtn.addEventListener('click', function() { selectTab('config'); });
  txBtn.addEventListener('click', function() { selectTab('tx'); });
  selectTab('config');

  document.getElementById('save').addEventListener('click', saveConfig);
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('pubkeysollet-popup-body')) {
    return;
  }

  buildPopup();

  restoreConfig();
  restoreLastTransactions();
});
