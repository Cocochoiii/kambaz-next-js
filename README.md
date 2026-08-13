# Kambaz - Next.js (A3)

CS5610 Web Development. Coco Choi, Fall 2025 Section 04.

This branch is the A3 work: Chapter 3 of *Developing Full Stack MERN Web
Applications*. The Lab 3 exercises practice JavaScript and React, and the
Kambaz screens now read their content from JSON files in
`app/(Kambaz)/Database`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The landing page is Kambaz. The left menu
has a Labs link, and `/Labs` lists Lab 1, Lab 2, and Lab 3.

## Layout

- `app/(Kambaz)` - the Kambaz application (Account, Dashboard, Courses, ...)
- `app/(Kambaz)/Database` - courses, modules, assignments, users, enrollments,
  announcements, and quizzes as JSON
- `app/Labs` - the lab exercises for chapters 1 to 3
