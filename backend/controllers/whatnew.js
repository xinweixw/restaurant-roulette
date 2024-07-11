const puppeteer = require('puppeteer-core');
const path = require('path');
const router = require('express').Router();
const supabase = require('../database');
const chrome = require('@sparticuz/chromium');

router.get('/whatnewcron', async (req, res) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            executablePath: await chrome.executablePath()
        });

        const page = await browser.newPage();
        await page.goto('https://eatbook.sg/category/news/new-openings', { waitUntil: 'domcontentloaded' });

        const newOpenings = await page.$$eval('#main ul li', (elements) => {
            return elements.slice(0, 5).map(e => ({
                title: e.querySelector('.post-header h2').innerText,
                summary: e.querySelector('.post-entry p').innerText,
                url: e.querySelector('.post-img a').href,
            }));
        });

        const { data: openings, error: openingsError } = await supabase.from('openings_websites')
            .insert(newOpenings);

        if (openingsError) throw openingsError;

        res.status(200).json({
            status: "success"
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

module.exports = router;