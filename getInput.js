/* eslint-env node, browser*/
/* eslint no-unused-vars:0 , no-console:0*/

var prompt = require('prompt');

//All the things that prompt will ask for
var promptSettings = [
    //these are not used but there for an example if you need to log in
    {
        name: 'username',
        //required: true
        //pattern: regex for validation
    },
    {
        name: 'password',
        hidden: true,
        replace: '*',
        //required: true
    }
  ];


module.exports = function (callback) {
    function promptCB(err, promptData) {
        if (err) {
            callback(err, null);
            return;
        }

        //convert any promptData values here before passing along
        //maybe some validation

        callback(null, promptData);
    }

    //set up prompt
    prompt.get(promptSettings, promptCB);
    //Run Prompt
    prompt.start();
}
