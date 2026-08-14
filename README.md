# Kambaz - Next.js (A5)

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is my A5 work. It covers Chapter 5 of the book.

In A4 all the data stayed in the browser. Now the data lives on a Node
server. So a change is still there after I press refresh.

## Two projects

This repository is only the React client. The server is a second repository.
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
- `.env.production` points to my server on Render

On Netlify I also set `NEXT_PUBLIC_HTTP_SERVER`. The Labs page prints the
address it uses, so I can check it.

## Accounts to try

These accounts come from the server, not from a JSON file.

- Faculty: `iron_man` / `stark123`
- Student: `coco` / `123`

Sign up works too. A new user is a Student with no courses.

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
| `Account/client.ts` | sign in, sign up, profile, sign out, my courses |
| `Account/Session.tsx` | asks the server who I am after a reload |
| `Courses/client.ts` | the courses, and the modules and assignments of a course |
| `Courses/[cid]/Modules/client.ts` | update and delete one module |
| `Courses/[cid]/Assignments/client.ts` | update and delete one assignment |
| `Enrollments/client.ts` | enroll, unenroll, my courses |

The slices changed too. In A4 they made the ids. Now the server makes them.
So each slice has a `set...` action. It copies the answer of the server into
the store.

## Extra Canvas screens

The book does not ask for these. Canvas has them, so I added them in A4.
They read the server too, in the same way as the modules.

| Screen | Where the data comes from |
| --- | --- |
| Announcements | the server. Faculty can post and remove |
| Quizzes | the server. Read only |
| Zoom | the server. Faculty can add and remove |
| People | the server joins the users and the enrollments |
| Grade Book | the server. Faculty can change a score and release |

Piazza is still an empty screen.

No screen reads a JSON file any more. All the data lives on the server.

## Folders

- `app/env.ts` the address of the server
- `app/(Kambaz)` the Kambaz screens
- `app/Labs` the labs for chapters 1 to 5
