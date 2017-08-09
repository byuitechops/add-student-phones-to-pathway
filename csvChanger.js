/*eslint-env node*/
/*eslint no-console:0*/

//var list = [1, 2, 3, 4, 5, 6, 1, 2, 3];
var uniq = require('array-uniq'),
    fs = require('fs'),
    chalk = require('chalk'),
    d3 = require('d3-dsv');

/*************************************************
 * checks to see if the file name already exists
 *************************************************/
function fileExists(fileName, i, cb) {
    i++;
    var exists = false;
    var files = fs.readdirSync('.')
    files.forEach(function (file) {
        if (file === fileName)
            exists = true;
    });

    if (exists === true) {
        var location = string.search(/\./);
        if (location != -1) {
            fileName.
        }
        fileName += "(" + i + ")";
        fileExists(fileName, i, cb);
    } else {
        cb(fileName);
    }

}

/********************************************
 * writes whatever it's given to a json file
 ********************************************/
function writeResults(courses) {
    courses = JSON.stringify(courses, null, 3);

    var fileName = "filteredByCourse.json";

    var write = function (fileName) {
        fileName = 'jsonFiles/' + fileName;
        fs.writeFile(fileName, courses, function (err) {
            if (err) console.error(chalk.red(err));
            else console.log(chalk.green("file successfully written"));
        });
    }

    fileExists(fileName, 0, write);

}

/******************************************
 * Puts the students in alphabetical order
 ******************************************/
function formatStudents(courses) {
    courses.forEach(function (course) {
        //sort students
        course.students.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        });
    });
    //console.log(JSON.stringify(courses, null, 3));

    writeResults(courses);
}

/************************************
 * Organizes student data by course
 ***********************************/
function getCourseList(students) {
    // get an array of each course
    var courses = students.map(function (student) {
        return student.D2L_COURSE_TITLE;
    });
    courses = uniq(courses);

    // Loop magic
    var tempObj,
        finalList = courses.map(function (course) {
            tempObj = {
                courseName: course,
                students: []
            };
            students.forEach(function (student) {
                if (student.D2L_COURSE_TITLE == course) {
                    tempObj.students.push({
                        name: student.LAST_NAME + ', ' + student.FIRST_NAME,
                        phone: student.PHONE
                    });
                }
            });
            return tempObj;
        });

    formatStudents(finalList);
}

/****************************************
 * reads student data from the csv
 ***************************************/
function getStudents() {
    fs.readFile('StudentSectionEnrollmentPhoneList.csv', 'binary', function (err, data) {
        if (err) console.error(chalk.red(err));
        data = data.toString();
        var students = d3.csvParse(data);

        getCourseList(students);
    })
}

getStudents();
