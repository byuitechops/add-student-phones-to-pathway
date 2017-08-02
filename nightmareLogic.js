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

    //login to brightspace
    nightmare
        .goto('https://byui.brightspace.com/d2l/login?noredirect=true')
        .wait('input#userName')
        .insert('input#userName', promptData.username)
        .insert('input#password', promptData.password)
        .click('form.d2l-form-primary button')
        .wait('')

}
