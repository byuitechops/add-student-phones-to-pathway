### Description ###
I apologize for the complexity of this tool. It can be tedious to use. Hopefully my instructions are detailed enough. 

This is meant to be a temportary fix to allow pathway instructers to access their student's phone numbers from a widget on the course homepage. It relies on our course-list-generator and live-development-server repos.

It uses settings.json to determine the files you want to work with. Hopefully I'll have time to switch these to prompts.


### Usage ###
1. Use the course list generator to create a csv file of all the courses in the desired semester. This file is the "masterCourseList" value in the settings.json file. Save the file to the current working directory.
2. Run sortByCourse.js to sort student data into courses. This requires that the "studentCSV" (from settings.json) be located in the current working directory. This will spit out courses.js which must be saved in the jsonFiles directory.
3. Open the live development server, upload valenceCalls.html and run it to download a csv list of courses with paths attached. Move this file into the jsonFiles directory.
4. Run createBatch to create uploadCourses.bat
5. Map webDav to drive Y
6. Run uploadCourses.bat
7. Upload widget.html as the widget