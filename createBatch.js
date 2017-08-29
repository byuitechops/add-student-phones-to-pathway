/*eslint-env node*/
/*eslint no-console:0*/

var fs = require('fs'),
    chalk = require('chalk'),
    settings = require('./settings.json'),
    courses = require('./jsonFiles/' + settings.postValenceCourse),
    batch = '',
    async = require('async');

'use-strict';



/***********************************************
 * saves each copy command to batch string
 * called with async.each in generateBatchFile
 ***********************************************/
function addCourseToBatch(course, cb) {
    /* FILES AS JS*****************************************************************************
    var path = course.path.replace(/\//g, '\\').replace(/\\content\\enforced\\/, ''),
        fileName = course.name.replace(/:/, '').replace(/ (\(Pa)[\s\S]+/, '') + '.js';

    batch += '\n copy "jsonFiles\\' + fileName + '" "Y:' + path + 'courseStudentPhones.js"';
    cb();
    *******************************************************************************************/

    /* FILES AS JSON **************************************************************************/
    var path = course.path.replace(/\//g, '\\').replace(/\\content\\enforced\\/, ''),
        fileName = course.name.replace(/:/, '').replace(/ (\(Pa)[\s\S]+/, '') + '.json';

    batch += '\n copy "jsonFiles\\' + fileName + '" "Y:' + path + 'courseStudentPhones.json"';
    cb();
    /******************************************************************************************/
}

/***********************************************
 * loops through courses to create batch file
 * writes the batch file
 ***********************************************/
function generateBatchFile() {
    batch += "@echo on",
        async.each(courses, addCourseToBatch, function () {
            batch += "\n pause";

            fs.writeFile(settings.batchFile, batch, function (err) {
                if (err) {
                    console.error(chalk.red(err));
                    return;
                }
                console.log("\nBatch File Complete");
            });
        });
}

/****************************************
 * writes each indivisual course file
 * called with async.each in splitCourses
 ****************************************/
function writeCourse(course, cb) {
    /* FILE AS JS ***************************************************************************
    var fileName = course.name.replace(/:/, '').replace(/ (\(Pa)[\s\S]+/, '') + '.js',
        courseStr = "var course = " + JSON.stringify(course) + ";";
    *****************************************************************************************/

    /* FILE AS JSON **************************************************************************/
    var fileName = course.name.replace(/:/, '').replace(/ (\(Pa)[\s\S]+/, '') + '.json',
        courseStr = JSON.stringify(course);
    /******************************************************************************************/

    fs.writeFile('jsonFiles/' + fileName, courseStr, 'binary', function (err) {
        if (err) {
            cb({
                "err": err,
                "course": course
            });
            return;
        }
        console.log(fileName, chalk.green('successfully written'));
        cb();
    });
}

/***************************************
 * Creates individual course json files
 * and returns here when complete
 ***************************************/
function splitCourses() {
    async.each(courses, writeCourse, function (err) {
        if (err) {
            console.error(chalk.red(JSON.stringify(err, null, 3)));
            return;
        }
        generateBatchFile();
    });
}

splitCourses();
