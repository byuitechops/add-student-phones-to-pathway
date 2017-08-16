/*eslint-env node*/
/*eslint no-console:0*/

var uniq = require('array-uniq'),
    fs = require('fs'),
    chalk = require('chalk'),
    d3 = require('d3-dsv');

//ATTACH AN OU NUMBER TO EACH COURSE!!



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
    //readInstructorFile(courses);
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
    fs.readFile('StudentSectionEnrollmentPhoneList.csv', 'binary', function (err, data) {
        if (err) console.error(chalk.red(err));
        data = data.toString();
        var students = d3.csvParse(data);

        getCourseList(students);
    })
}

getStudents();
