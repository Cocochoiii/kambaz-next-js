// The axios calls of the courses.
// The modules and assignments of a course also live here.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const COURSES_API = `${HTTP_SERVER}/api/courses`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const deleteCourse = async (courseId: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${courseId}`);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

// A new module always belongs to a course.
export const createModuleForCourse = async (courseId: string, module: any) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/modules`, module);
  return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};

export const createAssignmentForCourse = async (
  courseId: string,
  assignment: any
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return data;
};

// The announcements of one course.
export const findAnnouncementsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/announcements`);
  return data;
};

export const createAnnouncementForCourse = async (
  courseId: string,
  announcement: any
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/announcements`,
    announcement
  );
  return data;
};

// The quizzes of one course.
export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return data;
};

// A new quiz always belongs to a course.
export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return data;
};

// The Zoom meetings of one course.
export const findMeetingsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/meetings`);
  return data;
};

export const createMeetingForCourse = async (courseId: string, meeting: any) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/meetings`,
    meeting
  );
  return data;
};

// The people of one course.
export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

// The grades of one course, and the two read only tables.
export const findGradesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/grades`);
  return data;
};

export const saveGradeForCourse = async (courseId: string, grade: any) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/grades`, grade);
  return data;
};

export const releaseGradesForCourse = async (courseId: string) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/grades/release`);
  return data;
};

export const findGradeCategoriesForCourse = async (courseId: string) => {
  const { data } = await axios.get(
    `${COURSES_API}/${courseId}/gradeCategories`
  );
  return data;
};
