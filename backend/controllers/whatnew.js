const puppeteer = require('puppeteer-core');
const path = require('path');
const router = require('express').Router();
const supabase = require('../database');
// const cron = require('node-cron');
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
        await page.goto('https://eatbook.sg/category/news/new-openings');

        const newOpenings = await page.$$eval('#main ul li', (elements) => elements.map(e => ({
            title: e.querySelector('article .post-header h2').innerText,
            summary: e.querySelector('article .post-entry p').innerText,
            url: e.querySelector('article .post-img a').href,
        })));

        const { data: openings, error: openingsError } = await supabase.from('openings_websites')
            .insert(newOpenings);

        if (openingsError) throw openingsError;

        res.status(200).json({
            status: "success"
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }

    await browser.close();
});

module.exports = router;