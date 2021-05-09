/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// navigate to https://www.tabroom.com/index/index.mhtml
// go to #login-box
// email: #username, password: #password
// submit: <input type="submit" value="Login" class="button">
/*
const puppeteer = require('puppeteer');
const $ = require('jquery');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1500, height: 700 } });
  const page = await browser.newPage();
  await page.goto('https://www.tabroom.com');

  //await page.once('domcontentloaded', () => console.log('✅ DOM is ready'));
  //await page.once('load', () => console.log('✅ Page is loaded'));

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      //width: document.documentElement.clientWidth,
      width: 1500,
      height: 7000,
      //height: document.documentElement.clientHeight,
      //deviceScaleFactor: window.devicePixelRatio,
    };
  });

  //await page.screenshot({path: 'test.png', fullPage: true}); // https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagescreenshotoptions

  console.log('Dimensions:', dimensions);
  await page.click('a[class=login-window]').catch(err => {
    console.log("hi");
    console.log(err);
  })
  //await page.type('#username', '{{username}}');
  //await page.type('#password', '{{password}}');
  await page.click('input[type=submit]');
  //await page.waitForNavigation({ waitUntil: 'networkidle0' }),
  //console.log("done idling");
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    let element = $("a.dkblue.full");
    $(element).click();
  });

  await page.waitForTimeout(1000);

  let elements;
  await page.evaluate(() => {
    elements = $("td.nospace").toArray();
    /*console.log(tournaments);
    for (i = 0; i < tournaments.length; i++) {
      if ($(tournaments[i].innerHTML.includes("IHS"))) {
        $(tournaments[i]).click();
      }
    }
    //elements = document.querySelectorAll('.white.padmore');
  });
  //await page.click('td=]');
  
  await page.waitForTimeout(5000);

  //console.log("starting screenshot");
  //await page.screenshot({path: 'test.png', fullPage: true})



  await browser.close();
})(); */