import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }){
    return (
        <div id="wd-courses-navigation">
            <Link id="wd-course-home-link" href={`/Courses/${cid}/Home`}>Home</Link><br/>
            <Link id="wd-course-modules-link" href={`/Courses/${cid}/Modules`}>Modules</Link><br/>
            <Link id="wd-course-piazza-link" href={`/Courses/${cid}/Piazza`}>Piazza</Link><br/>
            <Link id="wd-course-zoom-link" href={`/Courses/${cid}/Zoom`}>Zoom</Link><br/>
            <Link id="wd-course-assignments-link" href={`/Courses/${cid}/Assignments`}>Assignments</Link><br/>
            <Link id="wd-course-quizzes-link" href={`/Courses/${cid}/Quizzes`}>Quizzes</Link><br/>
            <Link id="wd-course-grades-link" href={`/Courses/${cid}/Grades`}>Grades</Link><br/>
            <Link id="wd-course-people-link" href={`/Courses/${cid}/People/Table`}>People</Link><br/>
        </div>
    );
}
