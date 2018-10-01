/* eslint no-console:0 */

const chalk = require('chalk');
const path = require('path');
const courseGenerator = require('course-list-generator');
const sortByCourse = require('./sortByCourse.js');


function generateCourseList(preferredFileName, cb) {
    courseGenerator(preferredFileName, (err, courseListFileName) => {
        if (err) {
            console.error(chalk.red(err));
            return;
        }

        console.log(chalk.green(`File Written to: ${courseListFileName}`));
        cb(courseListFileName, sortCallback);
    });
}

function sortCallback(err, fileName) {
    if (err) {
        console.error(chalk.red(err));
        return;
    }

    console.log(chalk.green(`${fileName} was written successfully`));
    console.log(chalk.blue('Done'));
}


function main() {
    if (process.argv[2] && path.extname(process.argv[2] === '.csv')) {
        sortByCourse(process.argv[2], sortCallback);
    } else {
        generateCourseList('CourseList.csv', sortByCourse);
    }
}

main();