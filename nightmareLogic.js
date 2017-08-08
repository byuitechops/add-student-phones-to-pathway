/* eslint-env node, browser*/
/* eslint no-unused-vars:0 , no-console:0*/

var Nightmare = require('nightmare'),
    prompt = require('prompt'),
    chalk = require('chalk');
//require('nightmare-helpers')(Nightmare);
//require('nightmare-upload')(Nightmare);
require('nightmare-iframe-manager')(Nightmare);


function addList() {

}

//This is what gets called after the prompt from cli.js
module.exports = function startNightmare(promptData) {
    //start up nightmare can use values from promptData
    var nightmare = Nightmare({
        show: true,
        openDevTools: {
            mode: 'detach'
        },
        webPreferences: {
            webSecurity: false,
        },
        typeInterval: 20,
        alwaysOnTop: false,
        waitTimeout: 100 * 1000,
        //fullscreen: true
        //example of using promptData in setting up nightmare
        width: promptData.width || 1920,
        height: promptData.height || 1080

    });

    //console.log(chalk.yellow(JSON.stringify(promptData)))

    //login to PATHWAY
    // CURRENTLY LOGING INTO I-LEARN
    nightmare
        .goto('https://byui.brightspace.com/d2l/login?noredirect=true') //login page
        .wait('input#userName')
        .type('input#userName', promptData.username) //type username
        .type('input#password', promptData.password) //type password
        .click('form.d2l-form-primary button') //click login button
        .wait(2000)
        .goto('https://byui.brightspace.com/d2l/lp/manageFiles/main.d2l?ou=10011')
        /*.wait('.d2l-navigation-s-course-menu button.d2l-navigation-s-button-highlight')
        .click('button[data-prl="/d2l/lp/courseSelector/6606/InitPartial"]') //open course search box
        .wait('.d2l-courseselector-wrapper input.vui-input')
        .type('.d2l-courseselector-wrapper input.vui-input', 'Joshua McKinney - Sandbox') //type in course to find
        .click('input.vui-input-search-button') //click search
        .wait(2000)
        .click('#courseSelectorId li:first-child a.d2l-link') //go to course //GET COURSE ADMIN AND USE GOTO(URL)
        .wait('.d2l-navigation-s-item:nth-child(7) d2l-menu-item-link:nth-child(6) a.d2l-menu-item-link')
        .click('.d2l-navigation-s-item:nth-child(7) d2l-menu-item-link:nth-child(6) a.d2l-menu-item-link') //open course admin
        .wait('li:nth-child(14)>a.vui-link')
        .click('li:nth-child(14)>a.vui-link') //open manage files DOESN'T WORK IF IN NAME VIEW ON COURSE ADMIN PAGE
        .wait('a.d2l-link[title="Upload files to this folder"]')
        .click('a.d2l-link[title="Upload files to this folder"]') //open upload box*/
        .wait(2000)
        .click('a.d2l-link[title="Upload files to this folder"]') //open upload box
        .wait(2000)
        .enterIFrame('iframe[title="Upload"]')
        .click('.d2l-fileinput-addbuttons>button') //click upload button
        //.upload()

        //.end()
        .then(function (results) {
            console.log(results);
        })
        .catch(function (err) {
            console.log(chalk.red(err));
        })

}
