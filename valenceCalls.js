/*eslint-env browser*/
/*eslint no-console:0*/
/*global courses d2lScrape async download*/

/*****************************************************
 * This file uses the D2L API to get the file path to
 * the given courses. This is needed so we can access
 * these courses programmatically via webDav.
 *****************************************************/

function callD2lScrape(course, cb) {
    d2lScrape.getCourseInfo(course.ou, function (err, data) {
        if (err){
            cb(err, null);
            return;
        }
        console.log(data.Path);
        course.path = data.Path;
        cb(null, null);
    });
}

function getPath() {
    async.each(courses, callD2lScrape, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(courses[0]);
        
        //download here
        var fileName = 'coursesWithPaths.json';
        var alteredCourses = JSON.stringify(courses, null, 3);
        download(alteredCourses, fileName);
        
    });
}