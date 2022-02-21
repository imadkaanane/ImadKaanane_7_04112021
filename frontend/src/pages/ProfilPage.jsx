import React from "react"
// components
import Navigation from "../components/Navigation"
import Profil from "../components/Profil"

export default function ProfilPage() {
	return (
		<React.Fragment>
			<Navigation />
			<main className="container gx-0">
				<h1 className="d-none">Profil</h1>
				<Profil />
			</main>
		</React.Fragment>

	)
}
