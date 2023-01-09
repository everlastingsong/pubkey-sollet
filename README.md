![PubkeySollet](https://user-images.githubusercontent.com/98769788/211181344-273e33e4-6c08-462a-b1a8-405b306dd37d.svg)

# What is PubkeySollet
PubkeySollet is a wallet that allows you to specify the public key of the wallet when connecting to dApps.

- wallet for use on the Solana network
- wallet for developers and those who support dApps
- public key only! no private key!
- connect as Sollet extension
- signing transactions is always rejected
- transactions are dumped to the console
- open source!

## Screenshots
### Connecting
A public key can be specified each time the wallet is connected.

<img width="640" alt="github_ss01" src="https://user-images.githubusercontent.com/98769788/211181474-1a12425c-7a3a-464e-a7a2-3caabec1ef00.png">

### Executing transactions
Transactions for which signatures are requested are dumped to the console and always rejected.

<img width="640" alt="github_ss02" src="https://user-images.githubusercontent.com/98769788/211181512-b7796445-0b5e-4f61-81a6-eb12b704cb1a.png">

# How to install
## Chrome Web Store
https://chrome.google.com/webstore/detail/pubkeysollet/pjligelplfpbmdlachdpefnfdokedfea

## Manual installation
### 1. Download the extension
Get the extension by one of the following way.
- Download and unzip [dist/pubkey-sollet-extension.zip](https://github.com/everlastingsong/pubkey-sollet/blob/main/dist/pubkey-sollet-extension.zip)
- Clone the repository by ``git clone https://github.com/everlastingsong/pubkey-sollet`` (including the extension directory)

<img width="411" alt="github_install01" src="https://user-images.githubusercontent.com/98769788/211183279-ee328c8a-2d89-4b96-94fd-e15297e44db4.png">

### 2. Open the Extension Management
Navigate to ``chrome://extensions``.

The Extension Management page can also be opened by clicking on the Chrome menu, hovering over ``More Tools`` then selecting ``Extensions``.

<img width="705" alt="github_install02" src="https://user-images.githubusercontent.com/98769788/211183347-e5aec920-eca1-4500-94b0-cd01f27b13d8.png">

### 3. Load the extension
Enable Developer Mode by clicking the toggle switch next to ``Developer mode``.

Click the ``Load Unpacked`` button and select the extension directory.

<img width="705" alt="github_install03" src="https://user-images.githubusercontent.com/98769788/211183505-4261b36e-c6e6-4502-8302-be69aa5bd81b.png">
<img width="705" alt="github_install04" src="https://user-images.githubusercontent.com/98769788/211183525-bc6e15ba-e4f2-401e-a585-89fa7749e17f.png">

### 4. Installed!
Ta-da!🎉
The extension has been successfully installed.

<img width="705" alt="github_install05" src="https://user-images.githubusercontent.com/98769788/211183580-b0e1a898-a462-4866-91f5-002645549e84.png">

If you pin the extension, you will see the ``PS`` icon in your toolbar.

<img width="705" alt="github_install06" src="https://user-images.githubusercontent.com/98769788/211184377-e7721db3-dfa7-4eb0-bc6c-9956e3b43560.png">

# How to use
## 1. Connect as Sollet
Connect to PubkeySollet by choosing ``Sollet (extension)``.

PubkeySollet behaves as Sollet, so you can connect to dApps that support Sollet.

<sub>💡 Sollet also has ``Sollet (web)``, but this is not covered.</sub>

### Orca
Orca has two ``Sollet``, choose the **second** one.

<img width="705" alt="github_use01" src="https://user-images.githubusercontent.com/98769788/211184051-c23bf460-0a48-4165-8b69-04b7ff3753b3.png">

### Jupiter
<img width="705" alt="github_use03" src="https://user-images.githubusercontent.com/98769788/211184084-6d9b9ec8-733a-4606-876f-bbde1f4b054f.png">

### Marinade
<img width="705" alt="github_use04" src="https://user-images.githubusercontent.com/98769788/211184128-7df84285-4a39-4244-a1c2-035f614cfe70.png">

## 2. Specify public key
You will be asked to enter the public key you wish to use.

<img width="705" alt="github_use02" src="https://user-images.githubusercontent.com/98769788/211184875-4e6b992c-c2da-4a56-808e-a859ed383396.png">

Confirm that it is connected as a wallet with the entered public key.

<img width="705" alt="github_use06" src="https://user-images.githubusercontent.com/98769788/211184948-fb4f8a22-1d0e-47a3-8123-932eaa9045fb.png">

## 3. Dumping transactions
Signing is obviously **IMPOSSIBLE** because PubkeySollet **DO NOT** have the private key! 🙂

If PubkeySollet is requested to sign transactions, the contents of the transactions are automatically dumped to Console and a dialog box is displayed.

<sub>💡 Console can be opened by clicking on the Chrome menu, hovering over ``More Tools`` then selecting ``Developer tools``.</sub>

Closing the dialog box returns a response rejecting the request.

<img width="705" alt="github_use08" src="https://user-images.githubusercontent.com/98769788/211185475-b9ef606d-6fdb-40a1-92ec-eb0a5d9bff27.png">
