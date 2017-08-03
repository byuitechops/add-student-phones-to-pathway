/* eslint-env node, browser*/
/* eslint no-unused-vars:0 , no-console:0*/

var Nightmare = require('nightmare'),
    prompt = require('prompt'),
    chalk = require('chalk');
require('nightmare-helpers')(Nightmare);


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
        .goto('https://byui.brightspace.com/d2l/login?noredirect=true')
        .wait('input#userName')
        .type('input#userName', promptData.username)
        .type('input#password', promptData.password)
        .click('form.d2l-form-primary button')
        .wait('.d2l-navigation-s-course-menu button.d2l-navigation-s-button-highlight')
        .click('button[data-prl="/d2l/lp/courseSelector/6606/InitPartial"]')
        .wait('.d2l-courseselector-wrapper input.vui-input')
        .type('.d2l-courseselector-wrapper input.vui-input', 'Joshua McKinney - Sandbox')
        .click('input.vui-input-search-button')
        .wait(3000)
        .click('#courseSelectorId li:first-child a.d2l-link') //go to course
        .wait('.d2l-navigation-s-item:nth-child(7) d2l-menu-item-link:nth-child(6) a.d2l-menu-item-link') // open course admin without openeing dropdown?
        .click('.d2l-navigation-s-item:nth-child(7) d2l-menu-item-link:nth-child(6) a.d2l-menu-item-link')
        //.end()
        .then(function (results) {
            console.log(results);
        })
        .catch(function (err) {
            console.log(chalk.red(err));
        })

}
