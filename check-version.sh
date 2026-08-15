#!/bin/sh
# I run this in kambaz-next-js to check I have the newest files.
# Every line must say ok.
cd "$(dirname "$0")"
check() {
  if [ -e "$2" ]; then echo "ok    $1"; else echo "MISSING  $1  ->  $2"; fi
}
grep_check() {
  if grep -q "$2" "$3" 2>/dev/null; then echo "ok    $1"; else echo "OLD FILE  $1  ->  $3"; fi
}

check "Users screen"            "app/(Kambaz)/Account/Users/Users.tsx"
check "PeopleTable component"   "app/(Kambaz)/Account/Users/PeopleTable.tsx"
check "PeopleDetails panel"     "app/(Kambaz)/Account/Users/PeopleDetails.tsx"
check "role helper"             "app/(Kambaz)/Account/roles.ts"
check "kebab menu"              "app/(Kambaz)/KebabMenu.tsx"

grep_check "kebab is my own code, not react-bootstrap" \
  "wd-kebab-box" "app/(Kambaz)/KebabMenu.tsx"
grep_check "lesson menu wired" \
  "moveDown" "app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons.tsx"
grep_check "module menu wired" \
  "duplicateModule" "app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons.tsx"
grep_check "Publish All wired" \
  "publishAll(true, true)" "app/(Kambaz)/Courses/[cid]/Modules/ModulesControls.tsx"
grep_check "Dashboard has All Courses button" \
  "wd-enrollments-btn" "app/(Kambaz)/Dashboard/page.tsx"
grep_check "Student View wired" \
  "setViewAsStudent" "app/(Kambaz)/Courses/[cid]/layout.tsx"
grep_check "Course Status publish wired" \
  "wd-publish-course" "app/(Kambaz)/Courses/[cid]/Home/Status.tsx"
grep_check "announcement Edit wired" \
  "openEdit" "app/(Kambaz)/Courses/[cid]/Announcements/page.tsx"
