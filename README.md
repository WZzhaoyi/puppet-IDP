# puppeteer-IDP
A web crawler based on puppeteer designed for [IDP](http://idp.bl.uk/) that downloads images from search results

## Installation
Node version >= 12
```
npm install
```

## Usage
### set search config
Rewrite config.js
```
module.exports = {
    browserNumber: 1,
    browserOption: { headless: true },
    searchContext: 'YOUR KEY WORDS',
    width: 1440,
    height: 1080,
    root: 'YOUR WORK DIR'
}
```
### Start
```
npm run start
```

