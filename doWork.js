/*eslint-env browser*/
/*eslint no-console:0*/
/*global instructors locker async*/





function uploadFile(fileText, fileName, url, postedObj) {

    var xhr = new XMLHttpRequest();
    var divider = "xxBOUNDARYxx";
    //var url = fixUrl(url);
    var objString = JSON.stringify(postedObj);
    var body = "--" + divider + "\r\n";
    body += "Content-Type: application/json\r\n\r\n";
    body += objString + "\r\n";
    body += "--" + divider + "\r\n";
    body += 'Content-Disposition: form-data; name=""; filename="' + fileName + '"\r\n';
    body += "Content-Type: text/plain\r\n\r\n";
    body += fileText + "\r\n";
    body += "--" + divider + "--";

    console.log(body);

    xhr.onreadystatechange = print;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', "multipart/mixed;boundary=" + divider);
    xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);


    //                xhr.sendAsBinary(body);
    xhr.send(body);
}


function uploadFileToLockerWithID(id) {
    var fileText = "this is my locker file text.",
        fileName = "",
        url = "/d2l/api/le/1.14/locker/user/" + id + "/",
        postedObj = {
            "Description": "my file name is " + fileName,
            "IsPublic": false
        };

    uploadFile(fileText, fileName, url, postedObj);

}




function writeToLocker(instructors) {
    instructors.forEach(function (instructor) {
        //locker.writeFile()
    });
}

/*********************************************
 * filters out any failed attempts to get an
 * instructor's D2L userId
 ********************************************/
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

    writeToLocker(passedInstructors);
}

/*****************************************
 * Uses valence to get each instructor's
 * D2L userId
 *****************************************/
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

/**********************************
 * Passes instructors to getUserId
 **********************************/
function init() {
    async.map(instructors, getUserId, catchXHRerrors)
}


init();
