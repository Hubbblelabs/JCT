const { chromium } = require('playwright');
const Tesseract = require('tesseract.js');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');
const { URL } = require('url');

const BASE_URL = 'https://www.jct.ac.in/';
const DATA_ROOT = path.join(process.cwd(), 'data');
const COLLEGES = {
  engineering: {
    path: '/engineering/',
    dir: path.join(DATA_ROOT, 'engineering')
  },
  polytechnic: {
    path: '/polytechnic/',
    dir: path.join(DATA_ROOT, 'polytechnic')
  },
  arts_science: {
    path: '/cas/',
    dir: path.join(DATA_ROOT, 'arts_science')
  }
};

const visitedUrls = new Set();
const queue = [];
const errors = [];
const siteMap = {};

async function initDirs() {
  await fs.ensureDir(DATA_ROOT);
  for (const college of Object.values(COLLEGES)) {
    await fs.ensureDir(path.join(college.dir, 'pages'));
    await fs.ensureDir(path.join(college.dir, 'images'));
  }
  
  // Resume capability: check existing pages
  for (const college of Object.values(COLLEGES)) {
    const pagesDir = path.join(college.dir, 'pages');
    if (await fs.pathExists(pagesDir)) {
      const files = await fs.readdir(pagesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const data = await fs.readJson(path.join(pagesDir, file));
            if (data.url) {
              const cleanUrl = data.url.replace(/\/$/, '');
              visitedUrls.add(cleanUrl);
              siteMap[cleanUrl] = { title: data.title, college: getCollege(data.url) };
              
              // Extract links from saved data to populate queue
              if (data.links) {
                for (const link of data.links) {
                  const cLink = link.split('#')[0].replace(/\/$/, '');
                  // Check if this link is a subpage of one of our colleges or base
                  const isBase = cLink === BASE_URL.replace(/\/$/, '');
                  const collegeKey = getCollege(cLink);
                  
                  if ((collegeKey || isBase) && !visitedUrls.has(cLink) && !queue.includes(cLink)) {
                    // Check extension
                    const ext = path.extname(cLink).toLowerCase();
                    if (!['.pdf', '.zip', '.docx', '.xlsx', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.mp4'].includes(ext)) {
                      queue.push(cLink);
                    }
                  }
                }
              }
            }
          } catch (e) {
            // Ignore corrupted files
          }
        }
      }
    }
  }
  console.log(`Directories initialized. Resuming with ${visitedUrls.size} visited URLs and ${queue.length} items in queue.`);
}

async function downloadImage(url, dest, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios({
        url,
        responseType: 'stream',
        timeout: 15000
      });
      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(dest);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retrying download (${i + 1}/${retries}): ${url}`);
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function performOCR(imagePath, retries = 2) {
  const ext = path.extname(imagePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.bmp'].includes(ext)) return '';

  for (let i = 0; i < retries; i++) {
    let worker;
    try {
      worker = await Tesseract.createWorker('eng');
      const { data: { text } } = await worker.recognize(imagePath);
      await worker.terminate();
      return text;
    } catch (err) {
      if (worker) await worker.terminate().catch(() => {});
      if (i === retries - 1) {
        console.error(`OCR failed after retries: ${imagePath}`, err.message);
        return '';
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function getCollege(url) {
  for (const [key, config] of Object.entries(COLLEGES)) {
    // Check for path with or without trailing slash
    const cleanPath = config.path.replace(/\/$/, '');
    if (url.includes(config.path) || url.endsWith(cleanPath)) return key;
  }
  return null;
}

async function scrapePage(browser, url, stats) {
  const cleanUrl = url.replace(/\/$/, '');
  
  // Skip non-HTML files
  const ext = path.extname(cleanUrl).toLowerCase();
  if (['.pdf', '.zip', '.docx', '.xlsx', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.mp4'].includes(ext)) {
    return;
  }

  if (visitedUrls.has(cleanUrl)) {
    return;
  }
  visitedUrls.add(cleanUrl);

  const collegeKey = getCollege(cleanUrl);
  const isBase = cleanUrl === BASE_URL.replace(/\/$/, '');
  
  if (!collegeKey && !isBase) {
    return;
  }

  stats.active++;
  console.log(`[${stats.scraped}/${stats.total}] Scraping: ${cleanUrl} (Active: ${stats.active})`);
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const content = await page.evaluate(() => {
      const extractText = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.innerText.trim()).filter(Boolean);
      
      const headings = {};
      for (let i = 1; i <= 6; i++) {
        headings[`h${i}`] = extractText(`h${i}`);
      }

      const paragraphs = extractText('p');
      const lists = Array.from(document.querySelectorAll('ul, ol')).map(list => {
        return Array.from(list.querySelectorAll('li')).map(li => li.innerText.trim());
      });

      const tables = Array.from(document.querySelectorAll('table')).map(table => {
        return Array.from(table.querySelectorAll('tr')).map(tr => {
          return Array.from(tr.querySelectorAll('th, td')).map(td => td.innerText.trim());
        });
      });

      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt
      })).filter(img => img.src && img.src.startsWith('http'));

      const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(href => href && href.startsWith('https://www.jct.ac.in/'));

      return {
        title: document.title,
        headings,
        paragraphs,
        lists,
        tables,
        images,
        links,
        metadata: {
          description: document.querySelector('meta[name="description"]')?.content || '',
          keywords: document.querySelector('meta[name="keywords"]')?.content || ''
        }
      };
    });

    // Save Page Data
    if (collegeKey) {
      const parsedUrl = new URL(url);
      const fileName = parsedUrl.pathname.split('/').filter(Boolean).join('_') || 'index';
      const pagePath = path.join(COLLEGES[collegeKey].dir, 'pages', `${fileName}.json`);
      await fs.writeJson(pagePath, { url: cleanUrl, ...content }, { spaces: 2 });

      // Process Images in Parallel
      const imgPromises = content.images.map(async (img) => {
        try {
          const imgUrl = new URL(img.src);
          const imgName = path.basename(imgUrl.pathname);
          const imgDest = path.join(COLLEGES[collegeKey].dir, 'images', imgName);
          
          if (!(await fs.pathExists(imgDest))) {
            await downloadImage(img.src, imgDest);
            const ocrText = await performOCR(imgDest);
            if (ocrText) {
              await fs.writeFile(`${imgDest}.txt`, ocrText);
            }
          }
        } catch (e) {
          errors.push({ url: cleanUrl, type: 'image', target: img.src, error: e.message });
        }
      });
      await Promise.all(imgPromises);

      // Update Site Map
      siteMap[cleanUrl] = {
        title: content.title,
        college: collegeKey
      };
    }

    // Add links to queue
    for (const link of content.links) {
      const cleanLink = link.split('#')[0].replace(/\/$/, '');
      if (!visitedUrls.has(cleanLink) && !queue.includes(cleanLink)) {
        queue.push(cleanLink);
        stats.total++;
      }
    }

  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    errors.push({ url, type: 'page', error: err.message });
  } finally {
    stats.scraped++;
    stats.active--;
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

async function main() {
  await initDirs();
  const browser = await chromium.launch();

  const stats = {
    scraped: visitedUrls.size,
    total: visitedUrls.size || 1,
    active: 0
  };

  const initialUrls = [BASE_URL.replace(/\/$/, '')];
  for (const college of Object.values(COLLEGES)) {
    initialUrls.push(new URL(college.path, BASE_URL).href.replace(/\/$/, ''));
  }

  for (const url of initialUrls) {
    if (!visitedUrls.has(url)) {
      queue.push(url);
      stats.total++;
    }
  }

  const CONCURRENCY = 3;

  while (queue.length > 0 || stats.active > 0) {
    if (queue.length > 0 && stats.active < CONCURRENCY) {
      const url = queue.shift();
      scrapePage(browser, url, stats).catch(err => {
        console.error('Unhandled scrapePage error:', err);
      });
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Save Site Map
  await fs.writeJson(path.join(DATA_ROOT, 'site_map.json'), siteMap, { spaces: 2 });
  
  // Save Errors
  await fs.writeFile(path.join(DATA_ROOT, 'errors.log'), errors.map(e => JSON.stringify(e)).join('\n'));

  await browser.close();
  console.log('Scraping completed.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
