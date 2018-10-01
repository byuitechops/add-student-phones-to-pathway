/*eslint-env node*/
/*eslint no-console:0*/

/***************************************************
 * sortByCourse organizes student data by course
 ***************************************************/
'use-strict';

module.exports = (fileName, finalCallback) => {
    var fs = require('fs'),
        d3 = require('d3-dsv'),
        settings = require('./settings.json');

    /**********************************************
     * Writes preValenceCourses
     * The file must be generated so valence calls
     * can be made from a user logged into D2L
     *********************************************/
    function writeList(writeErr, courses) {
        if (writeErr) {
            finalCallback(writeErr, courses);
            return;
        }

        if (!fs.existsSync('jsonFiles/')) {
            fs.mkdir('jsonFiles', writeList);
        }

        var content = `var courses = ${JSON.stringify(courses)};`,
            outputFileName = 'jsonFiles/courses.js';

        fs.writeFile(outputFileName, content, err => {
            if (err) {
                finalCallback(err);
                // console.error(chalk.red(err));
            } else {
                finalCallback(null, outputFileName);
                // console.log(chalk.green(outputFileName + " was written successfully"));
            }
        });
    }

    /**********************************************
     * each course object is given an OU attribute
     *********************************************/
    function attachOU(courses, masterCourseList) {
        var matches = 0;
        courses.forEach(course => {
            masterCourseList.forEach(masterCourse => {
                if (masterCourse.name == course.name) {
                    course.ou = masterCourse.ou;
                    matches++;
                }
            });
        });

        if (matches < courses.length) {
            finalCallback(new Error('Unable to assign OU\'s to each course'));
            return;
        }

        writeList(null, courses);
    }

    /****************************************
     * masterCourseList is generated by the 
     * course-list-generator tool and is used 
     * to connect each course with its OU number
     *****************************************/
    function readMasterCourseList(courses) {
        fs.readFile(fileName, 'binary', (err, data) => {
            if (err) {
                finalCallback(err);
                return;
            }

            data = data.toString();
            var masterCourseList = d3.csvParse(data);

            attachOU(courses, masterCourseList);
        });
    }

    /*******************************************
     * Puts the students in alphabetical order
     ******************************************/
    function formatStudents(courses) {
        courses.forEach(course => {
            //sort students
            course.students.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            });
        });

        readMasterCourseList(courses);
    }

    /************************************
     * Organizes student data by course
     ***********************************/
    function getCourseList(students) {
        // get a unique array of courses
        var courses = students.reduce((accum, student) => {
            if (!accum.includes(student.D2L_COURSE_TITLE))
                accum.push(student.D2L_COURSE_TITLE);

            return accum;
        }, []);

        // Loop magic to create course objects that contain student data
        var tempObj,
            finalList = courses.map(course => {
                tempObj = {
                    name: course,
                    students: []
                };
                // get each student matched to the current course
                students.forEach(student => {
                    if (student.D2L_COURSE_TITLE == course) {
                        tempObj.students.push({
                            name: `${student.LAST_NAME}, ${student.FIRST_NAME}`,
                            phone: student.PRIMARY_PHONE,
                            email: student.EMAIL
                        });
                    }
                });
                return tempObj;
            });

        formatStudents(finalList);
    }

    /****************************************
     * reads student data from studentCsv
     ***************************************/
    function getStudents() {
        var fileName = settings.studentCSV;
        fs.readFile(fileName, 'binary', (err, data) => {
            if (err) {
                finalCallback(err);
                return;
            }
            data = data.toString();
            var students = d3.csvParse(data);

            getCourseList(students);
        });
    }
    getStudents();
};