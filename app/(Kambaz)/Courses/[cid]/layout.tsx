import CourseNavigation from "./CourseNavigation";

export default async function CoursesLayout({
                                                children, params
                                            }: Readonly<{ children: React.ReactNode; params: Promise<{ cid: string }> }>) {
    const { cid } = await params;
    return (
        <div id="wd-courses">
            <h2>Courses {cid}</h2>
            <hr/>
            <table><tbody><tr>
                <td valign="top" width="200"><CourseNavigation cid={cid}/></td>
                <td valign="top" width="100%">{children}</td>
            </tr></tbody></table>
        </div>
    );
}
