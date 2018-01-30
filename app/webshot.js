const tempfile = require('tempfile');
const puppeteer = require('puppeteer');

const webshot = async (url) => {
    const tmpFile = tempfile('.png');
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.screenshot({path: tmpFile});
    await browser.close();

    return tmpFile;
};

module.exports = webshot;
