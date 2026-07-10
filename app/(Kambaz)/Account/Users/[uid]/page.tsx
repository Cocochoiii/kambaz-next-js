"use client";

import PeopleTable from "../PeopleTable";
import PeopleDetails from "../PeopleDetails";

// Same list, plus a slide-in details panel for the selected user.
export default function UserDetailsPage() {
    return (
        <>
            <PeopleTable />
            <PeopleDetails />
        </>
    );
}
