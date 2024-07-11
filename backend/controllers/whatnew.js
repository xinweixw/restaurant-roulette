const puppeteer = require('puppeteer-core');
const path = require('path');
const router = require('express').Router();
const supabase = require('../database');
const cron = require('node-cron');
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

        const { data: oldOpenings, error: oldError } = await supabase.from('openings_websites')
            .delete();

        if (oldError) throw oldError;

        const { data: openings, error: openingsError } = await supabase.from('openings_websites')
            .insert(newOpenings)
            .select();

        if (openingsError) throw openingsError;

        // const { data: updatedOpenings, error: updatedError } = await supabase.from('restaurants')
        //     .update({ is_new: false })
        //     .eq('is_new', true);

        // if (updatedError) throw updatedError;

        // console.log("updated");
        res.status(200).json({
            status: "success", 
            data: {
                websites: openings,
            }
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

// async function getNewOpenings(req, res) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://eatbook.sg/category/news/new-openings');

//     const newOpenings = await page.$$eval('#main ul li', (elements) => elements.map(e => ({
//         title: e.querySelector('article .post-header h2').innerText,
//         summary: e.querySelector('article .post-entry p').innerText,
//         url: e.querySelector('article .post-img a').href,
//     }))); 

//     // console.log(newOpenings);

//     // res.status(200).json("Success");

//     try {
//         const { data: oldOpenings, error: oldError } = await supabase.from('openings_websites')
//             .delete();

//         if (oldError) throw oldError;

//         const { data: openings, error: openingsError } = await supabase.from('openings_websites')
//             .insert(newOpenings)
//             .select();

//         if (openingsError) throw openingsError;

//         const { data: updatedOpenings, error: updatedError } = await supabase.from('restaurants')
//             .update({ is_new: false })
//             .eq('is_new', true);

//         if (updatedError) throw updatedError;

//         // console.log("updated");
//         res.status(200).json({
//             status: "success"
//         })

//     } catch (err) {
//         console.log(err);
//         res.status(500).json("Server Error");
//     }

//     await browser.close();
// }

module.exports = router;