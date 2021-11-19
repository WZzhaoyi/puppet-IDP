const puppeteer = require('puppeteer');

const MAX_NUM = 4

const createBrowser = async (option = {}) => {
    const opt = Object.assign({
        headless: false,
        args: [
            '--auto-open-devtools-for-tabs',
            // '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            // '--single-process' // not supportable in windows
        ]
    }, option)
    let browser = await puppeteer.launch(opt);
    return browser
}

const listBrowsers = async (num = MAX_NUM, option = {}) => {
    let browsers = []
    for (let i = 0; i < num; i++) {
        browsers.push(createBrowser(option))
    }
    return await Promise.all(browsers)
}

const closeBrowsers = async (browsers) => {
    if (Array.isArray(browsers) && browsers.length > 0) {
        return await Promise.all(browsers.map(browser => browser.close()))
    }
    return []
}

module.exports = {
    createBrowser,
    listBrowsers,
    closeBrowsers
}