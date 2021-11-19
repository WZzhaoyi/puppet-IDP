const { downloadImg } = require('./file')

async function getOtherPages(page, selector = '.nextprevresults') {
    let res = await page.$(`${selector}`);
    let pages = await res.$$eval('a', nodes => nodes.map(n => n.href))
    pages.pop()
    return pages
}

async function getCurItems(page, selector = '.thumb', isImg = true) {
    let res = await page.$('#results')
    let items = await res.$$(`${selector}`)
    let arr = []
    if (!Array.isArray(items)) return arr
    for (let element of items) {
        let a = await element.$('a')
        let img = await (await a.$('img')).getProperty('src')
        let imgSrc = await img.jsonValue()
        let src = await (await a.getProperty('href')).jsonValue()
        if (!isImg) {
            arr.push(src)
            return
        }
        else if (imgSrc.indexOf('notYet_T') === -1) arr.push(src)
    }
    return arr
}

async function getMetaInfo(page, baseDir) {
    let obj = {
        title: '',
        mainImg: [],
        url: `${page.url()}`
    }
    let img_tr = (await (await page.$('#imgTbl')).$$('tr'))[1]
    let items = await img_tr.$$('td')
    obj.title = await page.$eval('#pressmark', el => el.innerText)
    for (let idx in items) {
        let item = items[idx]
        await item.click()
        // await page.waitForNavigation(['networkidle2'])
        await page.waitForSelector('#mainImg')
        let img = await page.$('#mainImg')
        let imgURL = await (await img.getProperty('src')).jsonValue()
        obj.mainImg.push(imgURL)
        downloadImg(imgURL, `${baseDir}/${obj.title.replace(/\//g, '-')}-${idx}.png`)
    }
    return obj
}

module.exports = {
    getOtherPages,
    getCurItems,
    getMetaInfo
}