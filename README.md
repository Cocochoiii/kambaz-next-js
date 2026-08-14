# Kambaz - Next.js (A4)

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is my A4 work. It covers Chapter 4 of the book, *Developing Full Stack
MERN Web Applications*. Chapter 4 is about state. First the state of one
component. Then the state of the whole app with Redux.

Lab 4 practices events, `useState`, sharing state, and Redux. The Kambaz
screens are not read only any more. A Faculty user can add, rename and delete
courses, modules and assignments. A Student can enroll and unenroll. Every
change is kept in the store, so it is still there on the next screen.

## How to run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The first screen is Sign in. The menu on the
left has a Labs link. `/Labs` lists Lab 1, Lab 2, Lab 3, and Lab 4.

## Accounts to try

The Sign in screen shows these two accounts under the button.

- Faculty: `sstrange` / `678`. Can add, edit, update and delete courses,
  modules and assignments.
- Student: `coco` / `123`. Can enroll and unenroll, and read the courses.

A Student can also open Profile, pick the role Faculty, and press Save. Then
the Dashboard shows the Faculty buttons.

## What Chapter 4 added

Lab 4, in `app/Labs/Lab4`:

- click events, passing data, passing a function, and the event object
- state variables: integer, boolean, string, date, object, and array
- sharing one state variable between a parent and a child
- Redux: Hello Redux, Counter Redux, Add Redux, and the todo list
- the last step of the chapter. Lab 3 shows the same todo list, because both
  labs read it from the same store

Kambaz, one slice per thing:

- `store.ts` holds all eight slices
- `Courses/reducer.ts` adds, edits, updates and deletes a course
- `Courses/[cid]/Modules/reducer.ts` adds, deletes and renames a module
- `Courses/[cid]/Assignments/reducer.ts` adds, updates and deletes an
  assignment
- `Courses/[cid]/Announcements/reducer.ts` posts and removes an announcement
- `Courses/[cid]/Grades/reducer.ts` changes a score and releases the grades
- `Courses/[cid]/Zoom/reducer.ts` schedules a meeting and removes one
- `Account/reducer.ts` remembers who is signed in
- `Enrollments/reducer.ts` enrolls and unenrolls a student
- `Account/ProtectedRoute.tsx` keeps the Dashboard and the courses for signed
  in users. A course only opens for a student who is enrolled in it.

## Extra Canvas touches

The book does not ask for these. They use the same Chapter 4 skills, and they
make Kambaz feel more like Canvas.

- Modules fold. The arrow and the title fold one module. Collapse All folds
  every module, and the button becomes Expand All.
- Faculty can publish and unpublish a module, a lesson, and an assignment.
  The green check turns into a gray no entry sign. This reuses `updateModule`
  and `updateAssignment`, so there is no new reducer.
- Faculty can post and remove an announcement. The search box filters the list.
- Clicking Courses in the left menu slides out a tray of my courses. The first
  row, All Courses, goes to the Dashboard.
- Grades shows two screens. Faculty gets one row per student and one column
  per assignment, and can click a cell to change a score. A student only sees
  their own scores, and only after Faculty releases them.
- Zoom has an Upcoming tab and a Previous tab. Faculty can schedule a meeting
  and remove one.

## Folders

- `app/(Kambaz)` the Kambaz screens: Account, Dashboard, Courses, and more
- `app/(Kambaz)/Database` the data as JSON: courses, modules, assignments,
  users, enrollments, announcements, quizzes, grades, and meetings
- `app/Labs` the lab exercises for chapters 1, 2, 3, and 4

## Links

- GitHub: https://github.com/Cocochoiii/kambaz-next-js
