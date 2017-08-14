/*eslint-env browser*/
/*eslint no-console:0*/
/*global instructors locker async*/



function writeToLocker(instructors) {
    instructors.forEach(function (instructor) {
        //locker.writeFile()
    });
}

function catchXHRerrors(err, instructors) {
    if (err) {
        console.log("Something went wrong while writing to the lockers", err);
        return;
    }
    console.log(instructors.length);
    var failedInstructors = [],
        passedInstructors = instructors.filter(function (instructor) {
            if (typeof instructor == "object")
                return instructor;
            else failedInstructors.push(instructor);
        });

    console.log('failed', failedInstructors.length)
    console.log('passed', passedInstructors.length)



    console.log('failed', failedInstructors)
    console.log('passed', passedInstructors)

    writeToLocker(passedInstructors);

}

function getUserId(instructor, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/d2l/api/lp/1.14/users/?userName=' + instructor.username);
    xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                instructor.userId = JSON.parse(xhr.response).UserId;
                console.log('I Worked!');
                cb(null, instructor);
            } else {
                cb(null, 'ERROR: ' + instructor.username + ' ' + xhr.status);
            }
        }
    };
    xhr.send();
}

function init() {
    async.map(instructors, getUserId, catchXHRerrors)
}


init();
