# Kambaz - Next.js (A4)

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is my A4 work. It covers Chapter 4 of the book, *Developing Full Stack
MERN Web Applications*. Chapter 4 is about state. First the state of one
component, then the state of the whole app with Redux.

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

The Sign in screen also shows these two accounts under the button.

- Faculty: `sstrange` / `678`. Can add, edit, update and delete courses,
  modules and assignments.
- Student: `coco` / `123`. Can enroll and unenroll, and read the courses.

A Student can also open Profile, change the role to Faculty, and press Save.
Then the Dashboard shows the Faculty buttons.

## What Chapter 4 added

Lab 4, in `app/Labs/Lab4`:

- click events, passing data, passing a function, and the event object
- state variables: integer, boolean, string, date, object, and array
- sharing one state variable between a parent and a child
- Redux: Hello Redux, Counter Redux, Add Redux, and the todo list
- the last step of the chapter: Lab 3 shows the same todo list, because both
  labs read it from the same store

Kambaz:

- `app/(Kambaz)/store.ts` holds all five slices
- `Courses/reducer.ts` adds, edits, updates and deletes a course
- `Courses/[cid]/Modules/reducer.ts` adds, deletes and renames a module
- `Courses/[cid]/Assignments/reducer.ts` adds, updates and deletes an
  assignment
- `Account/reducer.ts` remembers who is signed in
- `Enrollments/reducer.ts` enrolls and unenrolls a student
- `Account/ProtectedRoute.tsx` keeps the Dashboard and the courses for signed
  in users, and a course only opens for a student who is enrolled in it

## Folders

- `app/(Kambaz)` the Kambaz screens: Account, Dashboard, Courses, and more
- `app/(Kambaz)/Database` the data as JSON: courses, modules, assignments,
  users, enrollments, announcements, quizzes, and grades
- `app/Labs` the lab exercises for chapters 1, 2, 3, and 4

## Links

- GitHub: https://github.com/Cocochoiii/kambaz-next-js
