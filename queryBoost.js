const puppeteer = require('puppeteer');

async function boostPool() {
  const browser = await puppeteer.launch({
    args: [
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--window-size=1920x1080',],
    headless: true,  // no window
    executablePath: 'C:\\chromium\\chrome.exe' // chromium executable program directory
  });
  const page = await browser.newPage();
  await page.goto('https://testnetv2.doubler.pro/#/pool');
  const element = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[2]/div/div/div`)

  await element[0].click()
  await sleep(4000)

  await page.waitForSelector('#root > div > div > div > div.sc-eqUAAy.gAfwzq.page-container > div > div.third_part > div.ant-table-wrapper > div > div > div > div > div.ant-table-body > table')
  await sleep(4000)
  
  const result = []
  for (let i = 2;i < 1000;i++) {
    const poolIds = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[1]/div`)
    let str = ''
    if (poolIds.length > 0) {
        const textValue = await page.evaluate(el => el.textContent, poolIds[0]);
        str+='id:'+textValue;
    } else break;
    const symbols = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[2]/div/span`)
    if (symbols.length > 0) {
        const textValue = await page.evaluate(el => el.textContent, symbols[0]);
        str+=' '+textValue;
    } 
    // const tvl = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[4]/div/div/span/span`)
    const floorPrice = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[5]/div/div/div[1]/span`)
    if (floorPrice.length > 0) {
        // fetch content
        const textValue = await page.evaluate(el => el.textContent, floorPrice[0]);
        str+=' floorP:'+textValue;
    } 
    const profitPrice = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[5]/div/div/div[2]/span`)
    if (profitPrice.length > 0) {
        // fetch content
        const textValue = await page.evaluate(el => el.textContent, profitPrice[0]);
        str+=' profitP:'+textValue;
    } 
    const layer = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[6]/div[2]`)
    if (layer.length > 0) {
        // fetch content
        const textValue = await page.evaluate(el => el.textContent, layer[0]);
        str+=' layer:'+textValue;
    } 
    // const shareRadio = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[7]`)
    // const lastLayerReward = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[8]`)
    const status = await page.$x(`//*[@id="root"]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/table/tbody/tr[${i}]/td[9]/div/span[2]`)
    if (status.length > 0) {
        // fetch content
        const textValue = await page.evaluate(el => el.textContent, status[0]);
        str+=' status:'+textValue;
    } 
    await sleep(1000)
    result.push(str)
  }
//   await sleep(1000)
  await browser.close();
//   await sleep(1000)
 return result ;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve,ms));
}
// boostPool()
module.exports = {
    boostPool
}
