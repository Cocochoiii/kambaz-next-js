# Pazza demo checklist

I wrote this for my TA demo. Each line is one rubric row.
It says where the feature lives and how I show it.

Sign in as **sstrange / 678** for the instructor view.
Sign in as **coco / 123** for the student view.
Open **CS5610 Web Development**, then click **Piazza** on the left.

## What the seed puts in every course

All eleven courses hold the same shape, so any course demos the same.

| Item | Count |
|---|---|
| Posts | 13 |
| Questions / Notes | 9 / 4 |
| Questions with an answer | 6 |
| Questions still open | 3 |
| Followup discussions | 3, two of them carry a reply |
| Private to instructors | 1 |
| Pinned notes | 2 |
| Folders used | all 8 |
| Today / Yesterday / Last Week | 3 / 3 / 2, on any weekday |

Every author is really enrolled in that course, and the text names
the real assignments and learning activities of that course.

The private post in CS5610 belongs to **Natasha Romanoff**.
Sign in as sstrange and the board shows 13 posts.
Sign in as coco and it shows 12. That one missing post is the demo.

## Questions and Answers Screen

| # | Rubric row | Where it is | How I show it |
|---|---|---|---|
| 1 | Click Pazza in the sidebar, the Q&A screen opens | `Piazza/page.tsx` | Click Piazza in the course menu |
| 2 | The Q&A screen is the default screen | `Piazza/page.tsx` | It opens with no extra click |
| 3 | The nav bar is fixed and never scrolls | `.wd-pazza` in `styles.css` | Scroll a long post, the blue bar stays |
| 4 | The bar shows the course name | `PazzaNav.tsx` | It reads CS5610 Web Development |
| 5 | Each course has its own Pazza | every call takes `cid` | Open CS5520, the posts are different |
| 6 | Q&A tab opens the Q&A screen | `PazzaNav.tsx` | Click Q&A from Manage Class |
| 7 | Q&A tab is the default and is marked | `PazzaNav.tsx` | It is bold with a white underline |
| 8 | Manage Class tab opens Manage Class | `PazzaNav.tsx` | Only an instructor sees this tab |
| 9 | A fixed folder filter bar sits below | `page.tsx` folder radios | It stays while the list scrolls |
| 10 | hw1 to office_hours filter the posts | `folderFilter` state | Click hw2, the list shrinks |
| 11 | Two columns below the filters | `.wd-pazza-body` | Posts on the left, reading pane right |

## List of Posts Sidebar

| # | Rubric row | Where it is | How I show it |
|---|---|---|---|
| 12 | The toggle button is a left triangle | `page.tsx` `FaCaretLeft` | It sits left of Unread |
| 13 | The toggle hides and shows the list | `sidebarOpen` state | Click it twice, the arrow flips |
| 14 | The list shows posts I may read, newest first | `canSee` plus the sort | Sign in as coco, one private post is gone |
| 15 | A row shows title, role, preview and time | `postRow` in `page.tsx` | Read any row |
| 16 | Rows are grouped in accordions | `groupPosts` in `helpers.ts` | Today, Yesterday, Last Week, then week ranges |

## Posting a new question or note

| # | Rubric row | Where it is | How I show it |
|---|---|---|---|
| 17 | New Post opens the New Post screen | `NewPostScreen.tsx` | Click New Post |
| 18 | Three post type tabs, Question is default | `NewPostScreen.tsx` | Question is blue, Poll is off |
| 19 | Post to Entire Class or to people | radio buttons | Pick Individual, a list of names opens |
| 20 | Pick folders, at least one, with a manage link | check box buttons | Save with none, it complains |
| 21 | Summary, 100 characters, required | `wd-pazza-summary` | The counter stops at 100 |
| 22 | Details in a rich text editor, required | `RichText.tsx` | Bold some text |
| 23 | Posting options are ignored | not built | Nothing to show |
| 24 | Post My Question, Cancel, field errors | `submit` in `NewPostScreen` | Submit empty, three messages appear |

## Reading and answering a post

| # | Rubric row | Where it is | How I show it |
|---|---|---|---|
| 25 | The post opens in the reading pane | `PostView.tsx` | Click any row |
| 26 | The open post is marked in the list | `.wd-pazza-post-open` | Blue row with a blue bar |
| 27 | Views, folder, author, Edit and Actions | `PostView.tsx` head | Open my own post |
| 28 | Actions only for an instructor or the author | `canModify` | Sign in as coco, another post has no menu |
| 29 | Student's Answers with author, time, Edit, Actions | `answerRow` | A student sees the editor when there is no answer |
| 30 | Instructor's Answers, same rules | `answerRow` | An instructor sees the editor |
| 31 | Followup discussions with nested replies | `replyRow` | Reply to a reply |
| 32 | A box to start a new followup | `wd-pazza-new-discussion` | Type and post |
| 33 | Resolved and Unresolved toggle | `toggleResolved` | Click the button, it turns green |
| 34 | Author, time, text, Actions on a discussion | discussion block | Read any followup |
| 35 | A reply has author, time, text, Actions and a box | `replyRow` | Reply under a reply |

## Class at a Glance

| # | Rubric row | Where it is | How I show it |
|---|---|---|---|
| 36 | Six counts when no post is open | `ClassAtGlance.tsx` | Unread, unanswered, total posts, instructor responses, student responses, students enrolled |

## Manage Class and Manage Folders

| # | Rubric row | Where it is | How I show it |
|---|---|---|---|
| 37 | Only an instructor sees and opens Manage Class | `ManageClass/page.tsx` | Paste the URL as coco, it bounces back |
| 38 | Seven tabs, Manage Folders is the live one | `TABS` array | The other six are grey |
| 39 | Manage Folders opens the folder screen | same file | It is the open tab |
| 40 | The title is Configure Class Folders | same file | Read the heading |
| 41 | The default folders are there | `Folders/dao.js` | hw1 hw2 hw3 project exam logistics other office_hours |
| 42 | Add a folder, it stays after a refresh | `createFolder` | Add hw4 and reload |
| 43 | Tick folders and delete them | `deletePicked` | Delete hw4 |
| 44 | Edit a name with Save and Cancel | `startEdit` and `saveEdit` | Rename, then cancel a rename |

## General

| # | Rubric row | How I show it |
|---|---|---|
| 45 | Every field has a label and a placeholder | Read the New Post screen |
| 46 | The input type fits the question | Radios for one choice, check boxes for many, textarea for long text |
| 47 | The look carries the feature | Compare with the screenshots |
| 48 | The open tab, folder and post are marked | Blue and bold everywhere |
| 49 | Everything is saved | Log out, log back in, my answers are still there |
| 50 | Netlify with Render and Mongo Atlas | Open the deployed link |

## Things the project says are not required

Live Q&A, Drafts, Show Actions, post icons, the good post message,
Pinned, Poll and In-Class Response, Save Draft, email on post,
anonymous posting, time since last edit, Follow, Good Question,
Good Answer, Helpful, Good comment, unanswered followups,
total contributions, average response time, Resources, Statistics,
disable folders, subfolders, numbered folders, folder order.
