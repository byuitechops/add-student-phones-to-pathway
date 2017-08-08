/* D2L Locker API Wrapper */
var locker = (function () {
    'use strict';

    function readFile(fileName, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/d2l/api/le/1.14/locker/myLocker/' + fileName);
        xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        };
        xhr.send();
    }

    function deleteFile(fileName, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/d2l/api/le/1.14/locker/myLocker/' + fileName);
        xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        };
        xhr.send();
    }

    function writeFile(fileName, fileDescription, dataObj, callback) {
        var body,
            xhr = new XMLHttpRequest(),
            boundary = '------------' + Date.now().toString(),
            fileDescriptionObj = {
                "Description": fileDescription,
                "IsPublic": false
            };
        xhr.open('POST', '/d2l/api/le/1.14/locker/myLocker/');
        xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + boundary);
        xhr.setRequestHeader("X-Csrf-Token", localStorage['XSRF.Token']);

        body = '--' + boundary + '\r\n';
        body += 'Content-Type: application/json\r\n\r\n';
        body += JSON.stringify(fileDescriptionObj) + '\r\n';
        body += '--' + boundary + '\r\n';
        body += 'Content-Disposition: form-data; name=""; filename="' + fileName + '"\r\n';
        body += 'Content-Type: text/plain\r\n\r\n';
        body += JSON.stringify(dataObj) + '\r\n';
        body += '--' + boundary + '--';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        };
        xhr.send(body);
    }
    
    return {
        'readFile': readFile,
        'deleteFile': deleteFile,
        'writeFile': writeFile
    };
}());