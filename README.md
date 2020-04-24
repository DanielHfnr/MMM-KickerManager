# MMM-KickerManager

A module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) that displays your [Kicker.de](https://www.kicker.de) Manager League Table.

## Features
 * Web scraping functionality using puppeteer
 * Login in to your www.kicker.de account
 * Analyzing html with cheerio

## Installing

### Step 1 - Install the module
```javascript
cd ~/MagicMirror/modules
git clone https://github.com/DanielHfnr/MMM-KickerManager.git
cd MMM-KickerManager
npm install
```

### Step 2 - Add module to `~MagicMirror/config/config.js`
Add this configuration into `config.js` file's
```javascript
{
    module: "MMM-KickerManager",
    position: "bottom_left",
    config: {
       username: "USER@EXAMPLE.COM",
       password: "SECRET",
       updateInterval: 15, // obsolete in future
       headless: true,
       debug: false,
    }
}
```
## Updating
Go to the MMM-KickerManager module’s folder inside MagicMirror project and:
```
git pull
npm install
```
## Configuring
Here is the configurable part of the module

| Option               | Description
|--------------------- |-----------
| `username`           | *Required* Email-address or username of your kicker.de account.
| `password`           | *Required* password.
| `updateInterval`     | How often the module should load the list.<br>**Type:** `number` in milliseconds<br> **Default value:** `60*60*1000`
| `headless`           | Should a real browser window be opened or puppeteer in background. <br>**Type:** `boolean` <br> **Default value:** true
| `debug`              | Flag for displaying debug messages in console. <br>**Type:** `boolean` <br> **Default value:** `false`

