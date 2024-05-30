const puppeteer = require('puppeteer');

/**
 * @param {puppeteer.Page} page
 * @returns {Array}
 */
const getSearchResults = async (page) => {
  await page.waitForSelector('div .g');
  const results = await page.evaluate(() => {
    const items = [];
    const elements = document.querySelectorAll('div .g');
    elements.forEach((element) => {
      const title = element.querySelector('h3').innerText;
      const link = element.querySelector('a').getAttribute('href');
      title && link && items.push({ title, link });
    });
    return items;
  });
  return results;
};

/**
 * @param {puppeteer.Page} page
 * @returns {Array}
 */
const getSearchResultsAgain = async (page) => {
  await page.waitForSelector('div .g');
  const elements = await page.$$('div .g');
  const results = elements.map(async (element) => {
    const title = await element.$eval('h3', (node) => node.innerText);
    const link = await element.$eval('a', (node) => node.getAttribute('href'));
    if (title && link) return { title, link };
  });
  return Promise.all(results);
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to Google
  await page.goto('https://www.google.com');

  // Type the search query and press Enter
  const query = 'puppeteer with nodejs';
  await page.type('input', query);
  await page.keyboard.press('Enter');

  // Wait for search results to load and get all
  await page.waitForSelector('.g');

  // Extract results
  const results = await getSearchResults(page);

  // Print results to console
  console.log(results);

  await browser.close();
})();

/**
 * * STEPs:
 * 1. lunch browser
 * 2. create a page
 * 3. go to google.com
 * 4. wait for input element to appear
 * 5. type search query 
 * 6. hit enter
 * 7. wait for results to appear
 * 8. extract results
 * 9. print result to the console
 * 
 * * NOTE:
 * try searching different keywords if one or no result is found, I doubtfully implemented different algos before realizing there is actually nothing wrong.
 */