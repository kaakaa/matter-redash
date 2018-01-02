const tempfile = require('tempfile');
const puppeteer = require('puppeteer');

const webshot = async (url) => {
    const tmpFile = tempfile('.png');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.screenshot({path: tmpFile});
    await browser.close();

    return tmpFile;
};

module.exports = webshot;