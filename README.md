# Kambaz Quizzes - Next.js client

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is my final project. I built it on top of my A6 work.
A6 already had the courses, the modules and the assignments.
The new part is **Quizzes**.

A faculty can write a quiz, add questions, publish it and preview it.
A student can take the quiz. Later they can read their last try.
The server grades every answer, so the browser never sees the key.

## Two projects

This repository is only the client. The server is a second repository.
Both must run. The Sign in screen has a footer with both links.

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
| Quizzes | the server. Full CRUD. See the section below |
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

## Quizzes

This is the final project part. Canvas has a Quizzes screen.
I built mine to look and work the same way.

### The screens

| Screen | Address | Who opens it |
| --- | --- | --- |
| Quiz List | `/Courses/{cid}/Quizzes` | anyone in the course |
| Quiz Details | `.../Quizzes/{qid}` | anyone in the course |
| Quiz Editor | `.../Quizzes/{qid}/edit` | faculty only |
| Quiz Preview | `.../Quizzes/{qid}/preview` | faculty only |
| Take the Quiz | `.../Quizzes/{qid}/take` | students |

The two faculty screens send a student back to Quiz Details. I do not
only hide the buttons. A student who types the address still goes back.

### The Quiz List

The list is empty at the start. Then it tells me to click + Quiz.

Under each title I show the same four things Canvas shows.

- **Availability**. Closed, Available, or Not available until a day
- **Due date**
- **Points**, the sum of the points of all the questions
- **Number of questions**
- **Score** of my last try, but only for a student

The list sorts by the day the quiz opens.

+ Quiz makes a quiz with a default name. Then it opens the editor.

### What a faculty can do

| Control | What it does |
| --- | --- |
| + Quiz | makes a new quiz and opens the editor |
| the green check | publishes and unpublishes one quiz |
| the three dots menu | Edit, Publish or Unpublish, Delete |
| the red bin | deletes one quiz, after a dialog |

A new quiz is not published. So a student can not see it yet.

### The Quiz Editor

The editor has two tabs. Details is the first one.

**Details** holds every property of the quiz.

| Field | Box |
| --- | --- |
| Quiz Name | text |
| Quiz Instructions | rich text |
| Quiz Type | dropdown, four kinds |
| Assignment Group | dropdown, four kinds |
| Points | number, read only. It follows the questions |
| Shuffle Answers | check box |
| Time Limit | check box and a number of minutes |
| Allow Multiple Attempts | check box, then How Many Attempts |
| Show Correct Answers | check box |
| One Question at a Time | check box |
| Webcam Required | check box |
| Lock Questions After Answering | check box |
| Access Code | text. Empty means no code |
| Due, Available from, Until | three date boxes |

**Questions** holds the list of questions.

- New Question puts a question at the bottom of the list
- A new question is a Multiple Choice question
- A new question shows as a small card first
- Edit opens the card, and the card becomes a form
- A dropdown changes the type of the question
- The points at the top add up all the questions

Three buttons sit at the bottom of the editor.

| Button | What it does |
| --- | --- |
| Save | saves, then goes to Quiz Details |
| Save & Publish | saves, publishes, then goes to the Quiz List |
| Cancel | saves nothing, then goes to the Quiz List |

Save never touches the published field. So a quiz that is live stays
live after I fix a typo.

### The three question types

Every type has the same four parts at the top. Title, Points, a rich
text Question, and two buttons. The buttons are Cancel and Update
Question. Cancel really drops my edits. The form works on its own copy
of the question, so nothing goes back.

| Type | The answer part |
| --- | --- |
| Multiple Choice | any number of choices. A tick marks a right one |
| True/False | two radio buttons |
| Fill in the Blank | any number of answers I accept |

Multiple Choice can have more than one right choice. Then the student
sees check boxes instead of radio buttons.

Fill in the Blank does not care about upper and lower case.

### Preview and Take

Both screens use the same component, `QuizRunner.tsx`.

- One question at a time, when the quiz says so
- Previous, Next, and a row of numbers to jump
- A clock, when the quiz has a time limit. At zero it sends the answers
- Shuffle Answers mixes the choices for this try only

**Preview** is for a faculty. I answer the quiz and I see the score.
Nothing goes to the database. An Edit Quiz button takes me straight to
the Questions tab.

**Take** is for a student. The answers go to the server. The server
grades them and keeps them.

After a try, every question gets a green check or a red cross. The
right answer only shows when Show Correct Answers is on.

### Attempts

One row of `quizAttempts` is one try of one student on one quiz.

- Every student has their own rows. Nobody sees another student
- I only read my last try
- I can not change the answers of a try that is done
- Multiple Attempts says how many times I may try
- When the tries run out, the server says no

The count runs on the server too. Hiding the button is not enough.

### Why the server grades

A student could send me any score they like. So the score never comes
from the browser. The work happens in `QuizAttempts/routes.js`.

The quiz payload still carries the right answers, because the review
screen marks each question green or red. A student who opens the
network tab can read them. A real Canvas would strip them out first.

## Folders

- `app/env.ts` the address of the server
- `app/(Kambaz)` the Kambaz screens
- `app/(Kambaz)/ProjectFooter.tsx` the footer of the landing page
- `app/(Kambaz)/Courses/[cid]/Quizzes` every quiz screen
- `app/Labs` the labs for chapters 1 to 5

## The extra package

The quiz editor needs a rich text box. Canvas has one, and the project
asks for one. I use `react-quill-new`.

```bash
npm install
```

The style sheet comes in at `app/layout.tsx`, next to Bootstrap. The box
itself lives in one small file, `Quizzes/RichText.tsx`. Quill only runs
in the browser. So I load it with `dynamic` and `ssr: false`.

I tried the older `react-quill` first, and it crashed at once. That
package calls `ReactDOM.findDOMNode`. React 19 dropped the call, and
Next 15 runs React 19 inside the App Router. `react-quill-new` is the
same editor with the same API. It uses a ref instead.
