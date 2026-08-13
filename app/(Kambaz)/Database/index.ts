// The Kambaz "database". For now the data is just JSON files. Every screen
// imports this file, so there is only one place that knows the file names.
import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";
import announcements from "./announcements.json";
import quizzes from "./quizzes.json";

export { courses, modules, assignments, users, enrollments, announcements, quizzes };
