# UT car server (ESP32)

**What it does**
- In the car the ESP32 makes its own Wi-Fi (`UT-Car`). Everyone joins it and opens `http://192.168.4.1`. It serves the game and keeps coins, clubs, matches and invites on the board, so you can all play together with no internet.
- At home, power it up near your router. For the first 25 seconds it joins your home Wi-Fi, **pushes the car's changes to Firebase**, then **pulls everyone's accounts** so the car starts from your latest coins and clubs. Pressing the BOOT button does the same any time.
- If someone also played online between the pull and the push, it keeps both: coins = online coins + coins won or spent in the car, and players gained or sold in the car are added to or taken from the online club. Other things (stats, squad) take the car's version.

**Set up**
1. Arduino IDE: install the ESP32 board package, then libraries `ESP Async WebServer`, `Async TCP` (ESP32Async) and `ArduinoJson` (v7).
2. Open `ut-car.ino` and edit the top: home Wi-Fi name and password, and `SYNC_USERS` (your account keys, normally your usernames in lower case; the Serial Monitor prints all keys it finds at 115200 baud).
3. Put these in a folder named `data/www/` next to the sketch: `index.html`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`. Compress `index.html` (`gzip -9 index.html` leaves `index.html.gz`; keep only the .gz of it). Use the "ESP32 LittleFS Data Upload" plugin to upload `data`, then upload the sketch.
4. Add to home screen from `http://192.168.4.1`. iPhone opens it full screen. Android makes a shortcut.

**Limits**
- Selling on the market is off in the car (only buying from AI managers works), because listings would not sync back safely.
- Accounts created in the car are pushed to Firebase at the next sync. Matches, chat and invites in the car stay in the car.
- The car page can't load Google fonts, so text uses a plain font there.
- Not tested on a real board yet. Check the Serial Monitor on the first run.
