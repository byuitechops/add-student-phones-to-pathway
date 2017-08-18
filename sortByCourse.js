/*eslint-env node*/
/*eslint no-console:0*/


var uniq = require('array-uniq'),
    fs = require('fs'),
    chalk = require('chalk'),
    d3 = require('d3-dsv'),
    settings = require('./settings.json');

//ATTACH AN OU NUMBER TO EACH COURSE!!

function writeList(courses) {
    var content = 'var courses = ' + JSON.stringify(courses) + ';',
        fileName = settings.preValenceCourses;
    fs.writeFile(fileName, content, function(err){
        if(err) console.error(chalk.red(err));
        else{
            console.log(chalk.green(fileName + " was written successfully"));
        }
    });
}


function attachOU(courses, masterCourseList) {
    var matches = 0;
    courses.forEach(function (course) {
        masterCourseList.forEach(function (masterCourse) {
            if (masterCourse.name == course.name) {
                course.ou = masterCourse.ou;
                matches++;
            }
        });
    });

    if(matches < courses.length){
        console.log(chalk.red("Unable to assign OU's to each course"));
        return;
    }

    writeList(courses);
}


function readMasterCourseList(courses) {
    var fileName = settings.courseMasterList ;
    fs.readFile(fileName, 'binary', function (err, data) {
        if (err) console.error(chalk.red(err));
        data = data.toString();
        var masterCourseList = d3.csvParse(data);

        //console.log('masterCourseList', masterCourseList.length);
        //console.log(JSON.stringify(masterCourseList[0], null, 3));

        attachOU(courses, masterCourseList);
    });
}

/*******************************************
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
    readMasterCourseList(courses);
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

    // Loop magic to create course objects that contain student data
    var tempObj,
        finalList = courses.map(function (course) {
            tempObj = {
                name: course,
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
    var fileName = settings.studentCSV;
    fs.readFile(fileName, 'binary', function (err, data) {
        if (err) console.error(chalk.red(err));
        data = data.toString();
        var students = d3.csvParse(data);

        getCourseList(students);
    })
}

getStudents();
