# Kambaz - CS5610 Web Development, Assignment 1

**Name:** Coco Choi
**Course:** CS5610 Web Development, Fall 2025, Section 04

This is my Assignment 1. I built it with Next.js (App Router) and TypeScript.
I followed Chapter 1 of *Developing Full Stack Next.js Web Applications*.

## Links

- Live site (Vercel): _I will paste my Vercel URL here after I deploy_
- GitHub repository: https://github.com/Cocochoiii/kambaz-next-js

## How to run it on my computer

1. Install the packages:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in the browser.

## What is inside

Kambaz is the first page. When I open `/`, it sends me to the Sign in screen.
The Kambaz menu on the left has a link to the Labs.

- **Account** has three screens: Sign in, Sign up, and Profile. They share a
  small menu on the left.
- **Dashboard** shows 11 courses. When I click a course, it opens that course.
- **Courses** has these screens: Home, Modules, Piazza, Zoom, Assignments,
  Quizzes, Grades, and People. They share the course menu on the left.
- **Assignment Editor** is a form to edit one assignment.

Labs is the first page of the lab exercises. It shows my full name and my
section, a link to each lab, a link back to Kambaz, and a link to my GitHub
repository. Lab 1 has all the HTML exercises from Chapter 1: headings,
paragraphs, lists, a table, images, and form elements.

## Some notes about my code

- I do not import `app/globals.css`. Chapter 1 asks me to comment it out, so
  the pages use the plain browser style. CSS starts in Chapter 2.
- I use `defaultValue` instead of `value` in the input fields. If I use
  `value` with no onChange, React makes the field read only.
- Lab 1 starts with `"use client"` because the button calls `alert()`.
- Everything is written with plain HTML, because Chapter 1 only covers HTML.
  I do not use CSS, JavaScript logic, or state yet. Those come later.

## How to deploy

I push the code to GitHub, then I import the repository on Vercel. Vercel
finds Next.js by itself and builds the app again every time I push. I submit
the first URL under the Domains label of the production deployment.
