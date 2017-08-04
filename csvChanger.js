/*eslint-env node*/
/*eslint no-console:0*/

//var list = [1, 2, 3, 4, 5, 6, 1, 2, 3];
var uniq = require('array-uniq'),
    fs = require('fs'),
    chalk = require('chalk'),
    d3 = require('d3-dsv');


// FORMAT PHONE NUMBER!
// SORT STUDENTS ALPHABETICALLY


function writeResults(courses) {
    courses = JSON.stringify(courses, null, 3);

    fs.writeFile('filteredByCourse.json', courses, function (err) {
        if (err) console.error(chalk.red(err));
        else console.log(chalk.green("file successfully written"));
    });
}

function formatStudents(courses) {
    courses.forEach(function (course) {
        course.students.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        });

    });

    writeResults(courses);
}

function getCourseList(students) {
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
                        phone: '(' + student.PHONE.slice(0, 3) + ') ' + student.PHONE.slice(3, 6) + '-' + student.PHONE.slice(6, 10)
                    });
                }
            });
            return tempObj;
        });

    console.log(finalList.length);
    //console.log(JSON.stringify(finalList, null, 3));

    formatStudents(finalList);

    //writeResults(finalList);
}

function getStudents() {
    fs.readFile('StudentTestList.csv', function (err, data) {
        if (err) console.error(chalk.red(err));
        data = data.toString();
        var students = d3.csvParse(data);
        //console.log(students[0])

        getCourseList(students);
    })
}

getStudents();
