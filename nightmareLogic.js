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
        .evaluate(function () {
            document.querySelector('.d2l-navigation-s-course-menu .d2l-dropdown-content-1').setAttribute('opened', '');
        })
        .type('.d2l-courseselector-wrapper vui-input-search-container>input.vui-input', 'Joshua McKinney - Sandbox - mckinneyjs')
        /*.goto('https://byui.brightspace.com/d2l/home/10011')
        //.wait('div.d2l-navigation-s-item:nth-child(7) button.d2l-dropdown-opener')
        .wait('div.d2l-navigation-s-item:nth-child(7) .d2l-navigation-s-menu-item-root[text="Course Admin"]>a')
        .click('div.d2l-navigation-s-item:nth-child(7) .d2l-navigation-s-menu-item-root[text="Course Admin"]>a')*/
        .then(function (results) {
            console.log(results);
        })

}
