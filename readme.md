### Description ###
I apologize for the complexity of this tool. It can be tedious to use. Hopefully my instructions are detailed enough. 

This is meant to be a temportary fix to allow pathway instructers to access their student's phone numbers from a widget on the course homepage. It relies on our [course-list-generator](https://github.com/byuitechops/course-list-generator) and [live development server](https://github.com/byuitechops/live-development-server) repos.

It uses settings.json to determine the files you want to work with. Hopefully I'll have time to switch these to prompts.


### Usage ###
1. Save the studentCSV (Provided by the full-time faculty) to the current working directory. It's name must match "studentCSV" in `settings.json`. **Ensure csv headers are correct!** They must match the following: 
* FIRST_NAME
* LAST_NAME
* PRIMARY_PHONE
* EMAIL
2. Run `cli.js` to generate a master list of all courses in the desired semester and sort student data into courses. This will spit out courses.js which is saved in the jsonFiles directory (which will be created if needed). If you already have a list of courses you can pass it into `cli.js` at runtime.
3. Open the live development server, upload `valenceCalls.html` to any pathway course (or find it in Cary Johnson's sandbox course) and run it to download a csv list of courses with paths attached. Move this file into the jsonFiles directory.
4. Run `createBatch.js` to create uploadCourses.bat
5. Map webDav to drive Y
6. Run `uploadCourses.bat`
7. If the widget isn't in the courses by default, upload `widget.html` to the homepage template as a widget (You can probably skip this step).
