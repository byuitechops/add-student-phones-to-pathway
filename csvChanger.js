/*eslint-env node*/
/*eslint no-console:0*/

//var list = [1, 2, 3, 4, 5, 6, 1, 2, 3];
var uniq = require('array-uniq'),
    fs = require('fs'),
    chalk = require('chalk'),
    d3 = require('d3-dsv');


/*************************************************************
 * writes whatever it's given to a json file
 * it's possible that files could be overwritten this way...
 *************************************************************/
function writeInstructor(instructor) {
    var fileName = instructor.name + ".json";

    instructor = JSON.stringify(instructor, null, 3);

    fileName = 'jsonFiles/' + fileName;
    fs.writeFile(fileName, instructor, function (err) {
        if (err) console.error(chalk.red(err));
        else console.log(chalk.green(fileName + " written"));
    });
    //fileExists(fileName, 0, write);
}

/***********************************************************
 * filteres out instructors without corresponding courses
 **********************************************************/
function clearEmptyProfessors(instructors) {
    //console.log(instructors.length);

    var filteredInstructors = instructors.filter(function (instructor) {
        if (instructor.courses.length >= 1)
            return instructor;
    });
    //console.log(JSON.stringify(filteredInstructors, null, 3));
    //console.log(filteredInstructors.length);

    filteredInstructors.forEach(writeInstructor);
}

/*****************************************************
 * creates a list of instructors including each
 * course they teach and each student in that course
 *****************************************************/
function formatInstructors(instructors, courses) {
    var usernames = instructors.map(function (instructor) {
        return instructor.netId;
    });

    usernames = uniq(usernames);

    var tempObj,
        tempCourseName,
        finalList = usernames.map(function (username) {
            tempObj = {
                name: '',
                username: username,
                courses: []
            };
            instructors.forEach(function (instructor) {
                if (instructor.netId === username) {
                    tempObj.name = instructor.instructor.replace(/,\s/, ""); // so I don't have to save the json files by their usernames
                    courses.forEach(function (course) {
                        tempCourseName = course.courseName.slice(0, course.courseName.search(/\(/) - 1);
                        //FDREL classes have PATH as their course code. Replacing PATH with the appropriate code based on section number
                        if (instructor.course.search(/FDREL PATH/) > -1) {
                            if (instructor.section >= 1001 && instructor.section <= 1066) {
                                instructor.course = instructor.course.replace(/PATH/, "200");
                            } else if ((instructor.section >= 1095 && instructor.section <= 1105) || instructor.section == 1112) {
                                instructor.course = instructor.course.replace(/PATH/, "122");
                            } else if (instructor.section >= 1106 && instructor.section <= 1111) {
                                instructor.course = instructor.course.replace(/PATH/, "121");
                            }
                        }
                        if (tempCourseName == instructor.course + ": " + instructor.section) {
                            tempObj.courses.push(course);
                        }
                    });
                }
            });
            return tempObj;
        });

    clearEmptyProfessors(finalList);
    //finalList.forEach(writeInstructor);
}

/*******************************************************
 * reads in the file containing instructor information
 *******************************************************/
function readInstructorFile(courses) {
    fs.readFile('OSM Instructors.csv', function (err, data) {
        if (err) console.error(chalk.red(err));
        data = data.toString();
        var instructors = d3.csvParse(data),
            tempObj;

        formatInstructors(instructors, courses);
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

    //writeResults(courses);
    readInstructorFile(courses);
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
