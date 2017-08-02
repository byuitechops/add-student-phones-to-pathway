/*eslint-env node*/
/*eslint no-console:0*/


var Nightmare = require('nightmare');

require('nightmare-helpers')(Nightmare); //WHAT DOES THIS DO???

var nightmare = Nightmare({
    show: true,
    openDevTools: {
        mode: 'detach'
    },
    webPreferences: {
        webSecurity: false
    },
    typeInterval: 20,
    alwaysOnTop: false,
    waitTimeout: 100 * 1000
});

console.log('hello?');

nightmare
    .goto('https://byui.brightspace.com/d2l/login?noredirect=true')
