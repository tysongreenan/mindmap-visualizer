import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    // Add main page as root node
    const title = $('title').text() || url;
    nodes.push({
      id: `node-${nodeId}`,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: title,
        url: url,
        metadata: {
          description: $('meta[name="description"]').attr('content') || '',
        },
      },
    });

    // Process links
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (href && text && !href.startsWith('#') && !href.startsWith('javascript:')) {
        nodeId++;
        const targetUrl = new URL(href, url).toString();
        
        nodes.push({
          id: `node-${nodeId}`,
          type: 'custom',
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: {
            label: text,
            url: targetUrl,
          },
        });

        edges.push({
          id: `edge-${nodeId}`,
          source: 'node-0',
          target: `node-${nodeId}`,
        });
      }
    });

    await browser.close();
    res.json({ nodes, edges });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to process website' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});