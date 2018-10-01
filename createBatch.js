/*eslint-env node*/
/*eslint no-console:0*/

var fs = require('fs'),
    chalk = require('chalk'),
    settings = require('./settings.json'),
    courses = require('./jsonFiles/' + settings.postValenceCourse),
    path = require('path'),
    batch = '',
    async = require('async');

'use-strict';



/***********************************************
 * saves each copy command to batch string
 * called with async.each in generateBatchFile
 ***********************************************/
function addCourseToBatch(course, cb) {
    var externalPath = course.path.replace(/\//g, '\\').replace(/\\content\\enforced\\/, ''),
        fileName = course.name.replace(/:/, '').replace(/ (\(Pa)[\s\S]+/, '') + '.json';

    batch += `\n copy "${path.resolve('./jsonFiles')}\\${fileName}" "Y:${externalPath}courseStudentPhones.json"`;
    cb();
}

/***********************************************
 * loops through courses to create batch file
 * writes the batch file
 ***********************************************/
function generateBatchFile() {
    batch += '@echo on',
    async.each(courses, addCourseToBatch, function () {
        batch += '\n pause';

        fs.writeFile(settings.batchFile, batch, function (err) {
            if (err) {
                console.error(chalk.red(err));
                return;
            }
            console.log('\nBatch File Complete\nBatch file saved as ' + chalk.green(settings.batchFile));
        });
    });
}

/****************************************
 * writes each indivisual course file
 * called with async.each in splitCourses
 ****************************************/
function writeCourse(course, cb) {
    var fileName = course.name.replace(/:/, '').replace(/ (\(Pa)[\s\S]+/, '') + '.json',
        courseStr = JSON.stringify(course);

    fs.writeFile('jsonFiles/' + fileName, courseStr, 'binary', function (err) {
        if (err) {
            cb({
                'err': err,
                'course': course
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
