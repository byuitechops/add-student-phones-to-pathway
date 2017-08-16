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


    //xhr.sendAsBinary(body);
    xhr.send(body);
}


function uploadFileToLockerWithID(instructor) {
    console.log("uploadFile");

    var fileText = JSON.stringify(instructor.courses),
        fileName = "instructorData",
        url = "/d2l/api/le/1.14/locker/user/" + instructor.userId + "/",
        postedObj = {
            "Description": "my file name is " + fileName,
            "IsPublic": false
        };

    uploadFile(fileText, fileName, url, postedObj);

}

function removeFileFromLocker(instructor) {
    console.log("Remove file");

    var url = "/d2l/api/le/1.14/locker/user/(userId)/(path)";
    url = url.replace(/\(userId\)/, instructor.userId);
    url = url.replace(/\(path\)/, 'instructorData.json');

    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url);
    xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                uploadFileToLockerWithID(instructor);
            }
        }
    }
    xhr.send();
}

function checkForFileInLocker(instructor) {
    console.log("Check for exisiting file");

    var url = "/d2l/api/le/1.25/locker/user/(userId)/(path)";
    url = url.replace(/\(userId\)/, instructor.userId);
    //url = url.replace(/\(path\)/, '');
    url = url.replace(/\(path\)/, 'instructorData.json');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                removeFileFromLocker(instructor);
            } else if (xhr.status == 400 || xhr.status == 404) {
                uploadFileToLockerWithID(instructor);
            }
        }
    }
    xhr.send();
}


function checkLocker(instructors) {
    console.log("checking LocalStorage");

    if (instructors == undefined && localStorage.getItem('instructors') != null) {
        instructors = JSON.parse(localStorage.getItem("instructors"));
        //localStorage.removeItem("instructors"); ADD ME BACK IN WHEN FINISHED!

    }
    instructors.forEach(checkForFileInLocker);
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

    //checkLocker(passedInstructors);
    console.log('instructors saved to local storage');
    console.log(JSON.stringify(passedInstructors));
    
    if(passedInstructors.length > 0)
        localStorage.setItem("instructors", JSON.stringify(passedInstructors));
    else
        console.log("nothing saved to local storage");
}

/*****************************************
 * Uses valence to get each instructor's
 * D2L userId
 *****************************************/
function getUserId(instructor, cb) {
    var xhr = new XMLHttpRequest(),
        url = '/d2l/api/lp/1.14/users/?userName=' + instructor.username;

    xhr.open('GET', url);

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
function getIdInit() {
    async.map(instructors, getUserId, catchXHRerrors)
}


//getIdInit();


function whoAmI(){
    var xhr = new XMLHttpRequest(),
        url = '/d2l/api/lp/1.14/users/whoami';

    xhr.open('GET', url);

    xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                console.log(xhr.response);
            } else {
                cb(null, 'ERROR: ' + instructor.username + ' ' + xhr.status);
            }
        }
    };
    xhr.send();
}
