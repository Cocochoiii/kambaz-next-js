# Kambaz - Next.js (A6)

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is my A6 work. It covers Chapter 6 of the book.

In A5 the data lived in the memory of the server. A restart lost it all.
Now the server keeps the data in MongoDB. So a change is still there
after a restart, and after a new deploy.

## Two projects

This repository is only the client. The server is a second repository.
Both must run.

- Client: https://github.com/Cocochoiii/kambaz-next-js
- Server: https://github.com/Cocochoiii/kambaz-node-server-app

## How to run it

Start the server first, on port 4000. Then here:

```bash
npm install
npm run dev
```

Open http://localhost:3000. The first screen is Sign in. The menu on the
left has a Labs link. `/Labs` lists Lab 1 to Lab 5.

## The address of the server

I never write the URL in a screen. It lives in one file, `app/env.ts`.
That file reads an environment variable.

- `.env.development` points to `http://localhost:4000`
- On Netlify I set `NEXT_PUBLIC_HTTP_SERVER` to my Render address

The Labs page prints the address it uses, so I can check it.

## Accounts to try

These accounts come from the server, not from a JSON file.

- Faculty: `iron_man` / `stark123`
- Student: `coco` / `123`
- Admin: `admin` / `admin123`

The Sign in form already has the Faculty account typed in. So the first
sign in shows every button. Sign up starts on Faculty too.

Sign up works. A new user has no courses yet.

An Admin sees every course on the Dashboard.

## Who can change what

Faculty and Admin can edit. A Student only reads.

| Screen | Faculty and Admin | Student |
| --- | --- | --- |
| Home | the Course Status box on the right | it is not there |
| Dashboard | the course form, and the card menu | Enroll and Unenroll |
| Dashboard | every course | only published courses |
| Modules | add, rename, delete, publish | read only |
| Modules | every module and lesson | only published ones |
| Assignments | add, delete, publish | read only |
| Assignments | the editor form | a page it can only read |
| Account > Users | + People, Save, Delete, role | only the table |

A Faculty can press **Student View** at the top of a course. Then the
course looks like a student screen. A gray bar at the bottom says so.
Leave Student View turns it off.

## Publish

Publish is not only a picture. A student sees published things only.

| Control | What it changes |
| --- | --- |
| Dashboard card menu > Publish | the whole course |
| Modules > Publish All | every module, and the lessons if I pick items |
| the green check on a module | that one module |
| the green check on a lesson | that one lesson |
| Assignments group menu | every assignment of the course |
| the green check on an assignment | that one assignment |

Each one sends a PUT and then updates the store. So a refresh keeps it.
A row that is not published turns pale. A module gets a gray tag.

An empty published field means published. Some sample rows have no field
at all. `!undefined` is true, so the first click used to do nothing. Now
I compare with `!== false` everywhere.

## The three dots menus

Canvas puts a small menu in the corner of a row. Mine are real now.
They only use the routes I already have, so the server did not change.

| Where | What the menu does |
| --- | --- |
| Dashboard card | Publish, Edit, Delete the course |
| Module title | Rename, Add lesson, Duplicate, Publish, Delete |
| Module title `+` | opens the dialog that adds one lesson |
| Lesson row | Rename, Move up, Move down, Duplicate, Publish, Delete |
| Assignments gray bar | Publish or unpublish every assignment |
| Assignment row | Edit, Duplicate, Publish, Delete |
| Announcement row | Edit, Duplicate, Delete |

A lesson lives inside the module document, in an array. So Move up and
Move down only change the order of that array. One PUT of the module
keeps the new order. A module or an assignment has no order field yet,
so those two do not move.

**View Progress** counts what is published right now, and shows the two
numbers under the buttons.

The **Publish** and **Unpublish** buttons in Course Status on the Home
screen change the course. A line under them says which one is on.

## Lab 5

The files are in `app/Labs/Lab5`.

| File | What it does |
| --- | --- |
| `EnvironmentVariables.tsx` | prints the address of the server |
| `PathParameters.tsx` | add, subtract, multiply, divide in the path |
| `QueryParameters.tsx` | the same four after the question mark |
| `WorkingWithObjects.tsx` | read and change the assignment and the module |
| `WorkingWithArrays.tsx` | the four CRUD jobs on the todos, with links |
| `HttpClient.tsx` | axios asks for the welcome message |
| `WorkingWithObjectsAsynchronously.tsx` | a form that fills itself |
| `WorkingWithArraysAsynchronously.tsx` | the todo list with POST, DELETE, PUT |
| `client.ts` | every axios call of the lab |

## Kambaz

One client file for each thing.

| File | What it does |
| --- | --- |
| `Account/client.ts` | sign in, sign up, profile, sign out, and the users |
| `Account/roles.ts` | one place that answers "can this user edit?" |
| `Account/Session.tsx` | asks the server who I am after a reload |
| `Courses/client.ts` | the courses, and the modules and assignments |
| `Courses/[cid]/Modules/client.ts` | update and delete one module |
| `Courses/[cid]/Assignments/client.ts` | update and delete one assignment |
| `Enrollments/client.ts` | enroll, unenroll, my courses |

The slices changed too. In A4 they made the ids. Now the server makes
them. So each slice has a `set...` action. It copies the answer of the
server into the store.

## What A6 adds

| Screen | What is new |
| --- | --- |
| Account > Users | every user in the database, in one table |
| Account > Users | a role dropdown and a name box. The server filters |
| Account > Users | + People inserts a user, and the panel edits it |
| Account > Users | the panel saves the name, the email and the role |
| Account > Users | Delete removes the user from the database |
| Dashboard | one button changes All Courses and My Courses |
| Dashboard | in All Courses each card shows Enroll or Unenroll |
| Course > People | the same table, but only the people of this course |

The two filters do not run in the browser. They ask the server, and the
server asks the database. The role goes in `?role=`, and the name goes
in `?name=`. That way the database does the work.

## Extra Canvas screens

The book does not ask for these. Canvas has them, so I added them in A4.
They read the server too, in the same way as the modules.

| Screen | Where the data comes from |
| --- | --- |
| Announcements | the server. Faculty can post, edit and remove |
| Quizzes | the server. Read only |
| Zoom | the server. Faculty can add and remove |
| People | the server joins the users and the enrollments |
| Grade Book | the server. Faculty can change a score and release |
| Inbox | the server. I can read, send and delete a message |
| Calendar | the server. A month grid and an agenda |

The Calendar keeps no data. The server puts the assignment due dates, the
Zoom meetings and the announcements of my courses into one list. The
screen has two tabs. Month draws a grid, and a click on a day opens that
day. Agenda groups everything by day in one long list.

Piazza is still an empty screen.

No screen reads a JSON file any more. Every screen reads the server,
and the server reads MongoDB. Nothing lives in memory now, so a sleeping
server on Render wakes up with all my changes still there.

## Folders

- `app/env.ts` the address of the server
- `app/(Kambaz)` the Kambaz screens
- `app/Labs` the labs for chapters 1 to 5
