const puppeteer = require('puppeteer');
const path = require('path')
const pup = require('./lib/pup')
const config = require('./config')
const cmd = require('./lib/cmd')
const file = require('./lib/file');
const fs = require('fs');

let browsers = []
let meta = {
  pages: [],
  items: [],
  download: [],
  error: []
}

// load root path
if (!config.root) {
  config.root = __dirname + path.sep + 'runs'
  file.createFolder(config.root)
}
let workDir = config.root + path.sep + config.searchContext
let logDir = workDir + path.sep + 'log.txt'

function writeLog(msg) {
  console.log(msg)
  file.storeLog(msg + '\n', logDir)
  meta.error.push(msg)
}

const main = async () => {
  // create folder
  // clean folder
  fs.mkdir(workDir, (error) => {
    if (error) {
      console.log('Fail to mkdir:', error)
    }
  })
  fs.writeFile(logDir, `Search For ${config.searchContext} ${new Date()} \n`, (error) => {
    if (error) {
      console.log('Fail to create log file:', error)
    }
  })

  // create browsers
  browsers = await pup.listBrowsers(config.browserNumber, config.browserOption);

  // randomly select a browser for test
  let rdn = Math.floor(Math.random() * config.browserNumber);

  // opon original page
  let homePage = await browsers[rdn].newPage();
  await homePage.setViewport({
    width: config.width,
    height: config.height,
  });
  try {
    await homePage.goto(`http://idp.bl.uk/`, { waitUntil: 'networkidle2' });
    // input search context and click search button
    const input_area = await homePage.$("#f_quickSearchValue");
    await input_area.type(`${config.searchContext}`);
    const search_btn = await homePage.$('.btn-go');

    // wait for new page
    await search_btn.click()
    await homePage.waitForSelector('.thumb')
  } catch (error) {
    writeLog(`Error in first page:${error}`)
  }

  // get query page and current page result
  let pages = await cmd.getOtherPages(homePage)
  let idx = 0 // -1
  meta.pages = pages
  do {
    if (pages.length && idx >= 0) {
      try {
        await homePage.goto(pages[idx], { waitUntil: 'networkidle2' })
      } catch (error) {
        writeLog(`Error in ${idx + 2} page:${error}`)
      }
    }
    let res = await cmd.getCurItems(homePage)
    meta.items.push(res)
    for (let item of res) {
      // open  page
      let page = await browsers[Math.floor(Math.random() * config.browserNumber)].newPage();
      try {
        await page.goto(`${item}`, { timeout: config.timeout ? config.timeout : 30000, waitUntil: 'networkidle2' })
        let info = await cmd.getMetaInfo(page, workDir, logDir)
        meta.download.push(info)
        await page.close()
      } catch (error) {
        writeLog(`Fail to load ${item}:${error}`)
        await page.close()
      }
    }
  } while (++idx < pages.length);
  // close test page
  await homePage.close();
}

main().catch((e) => {
  writeLog(`Error in Search Page:${e}`)
}).finally(async () => {
  await pup.closeBrowsers(browsers);
  file.storeLog(JSON.stringify(meta), `${workDir}/meta.json`)
  console.log('Script complete.')
})