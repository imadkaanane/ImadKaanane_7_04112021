import React from "react"
// components
import Navigation from "../components/Navigation"
import Members from "../components/Members"

export default function MembersPage() {
	return (
		<React.Fragment>
			<Navigation />
			<main className="container gx-0">
				<h1 className="d-none"> Collègues </h1>
				<Members />
			</main>
		</React.Fragment>
	)
}
