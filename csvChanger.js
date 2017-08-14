/*eslint-env node*/
/*eslint no-console:0*/

var uniq = require('array-uniq'),
    fs = require('fs'),
    chalk = require('chalk'),
    d3 = require('d3-dsv');


/*************************************************************
 * writes whatever it's given to a js file
 * it's possible that files could be overwritten this way...
 *************************************************************/
function writeInstructor(instructorList) {
    var fileName = "list.js";

    instructorList = "var instructors = " + JSON.stringify(instructorList, null, 3) + ";";

    fileName = 'jsonFiles/' + fileName;
    fs.writeFile(fileName, instructorList, function (err) {
        if (err) console.error(chalk.red(err));
        else console.log(chalk.green(fileName + " written"));
    });
}

/***********************************************************
 * filteres out instructors without ANY
 * corresponding courses
 **********************************************************/
function clearEmptyProfessors(instructors) {
    //console.log(instructors.length);

    var filteredInstructors = instructors.filter(function (instructor) {
        if (instructor.courses.length >= 1)
            return instructor;
    });
    //console.log(filteredInstructors.length);

    writeInstructor(filteredInstructors);
}

/*****************************************************
 * creates a list of instructors including each
 * course they teach and each student in that course
 *****************************************************/
function formatInstructors(instructors, courses) {
    var iNum,
        usernames = instructors.map(function (instructor) {
            //I-number is the path Username for all but 1 user
            if (instructor.lastname == 'Wilson' && instructor.middlename == 'Sharp' && instructor.firstname == 'Chelsey') {
                return instructor.username;
            } else {
                //remove '-' from all inumbers
                iNum = instructor.INumber.replace(/-/g, '');
                instructor.INumber = iNum;

                return instructor.INumber;
            }
        });

    usernames = uniq(usernames);

    var tempObj,
        tempCourseName,
        finalList = usernames.map(function (username) {
            tempObj = {
                username: username,
                courses: []
            };
            instructors.forEach(function (instructor) {
                if (instructor.INumber === username || instructor.username === username) {
                    courses.forEach(function (course) {
                        tempCourseName = course.name.slice(0, course.name.search(/\(/) - 1);
                        //FDREL classes have PATH as their course code. Replacing PATH with the appropriate code based on section number
                        if (instructor.coursenumber.search(/FDREL PATH/) > -1) {
                            if (instructor.section >= 1001 && instructor.section <= 1066) {
                                instructor.coursenumber = instructor.coursenumber.replace(/PATH/, "200");
                            } else if ((instructor.section >= 1095 && instructor.section <= 1105) || instructor.section == 1112) {
                                instructor.coursenumber = instructor.coursenumber.replace(/PATH/, "122");
                            } else if (instructor.section >= 1106 && instructor.section <= 1111) {
                                instructor.coursenumber = instructor.coursenumber.replace(/PATH/, "121");
                            }
                        }
                        if (tempCourseName == instructor.coursenumber + ": " + instructor.section) {
                            tempObj.courses.push(course);
                        }
                    });
                }
            });
            return tempObj;
        });

    clearEmptyProfessors(finalList);
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
