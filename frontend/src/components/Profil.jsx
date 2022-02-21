import React, {useContext, useState, useEffect, useMemo} from "react"

import ProfilLogo from "./ProfilLogo"
import {AuthenticationContext} from "../App"
import ModifyProfilForm from "./ProfilForm"

export default function Profil() {
	const {AuthenticationState} = useContext(AuthenticationContext) // utiliser l'état global d'authentification

	const initialProfilRender = useMemo(() => {
		// changer le rendu de profil : initial ou modifier
		const sendProfilRender = () => {
			setProfilRender(<ModifyProfilForm setProfilRender={setProfilRender} initialProfilRender={initialProfilRender} />)
		}

		return (
			<div className="card shadow  d-flex  flex-column align-items-center justify-content-between align-items-lg-center p-3 h-100">
				<ProfilLogo photo={AuthenticationState.photo} class="" />
				<div className=" p-3 overflow-hidden d-flex  flex-column justify-content-around  ">
					{AuthenticationState.isAdmin ? (
						<h3 className="w-100 text-center">
							Profil admin	
							
						</h3>
					) : (
						<h3 className="w-100 text-center">Profil</h3>
					)}
					<div className="text-center">
						{AuthenticationState.firstName} {AuthenticationState.lastName}
					</div>
		
					<div className="d-flex justify-content-center mt-3">
						<button onClick={() => sendProfilRender()} className="btn btn--success">
							Modifier
						</button>
					</div>
				</div>
			</div>
		)
	}, [AuthenticationState.firstName, AuthenticationState.isAdmin, AuthenticationState.lastName, AuthenticationState.photo]) 

	// définir le rendu du profil
	const [profilRender, setProfilRender] = useState(initialProfilRender)

	useEffect(() => {
		setProfilRender(initialProfilRender)
	}, [AuthenticationState, initialProfilRender])

	return profilRender
}
