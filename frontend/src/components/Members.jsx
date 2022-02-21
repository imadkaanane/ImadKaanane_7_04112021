import React, {useContext, useEffect, useState, useCallback, useMemo } from "react"
import {AuthenticationContext} from "../App"
import axios from "axios"
import {TailSpin} from "react-loader-spinner"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// Utils
import {ApiUrl} from "../utils/AdressAPI"
import { messageError, messageSuccess } from "../utils/MessageAlert"
//components
import ProfilLogo from "./ProfilLogo"
// icons
import {FaTrashAlt} from "react-icons/fa"

export default function Members() {

	const {AuthenticationState} = useContext(AuthenticationContext) // utilisation de l'état global AuthenticationContext
	const MySwal = withReactContent(Swal) // bouton d'alerte personnalisé

	const [users, setUsers] = useState([])  // définir l'état des données des utilisateurs
	const [filterUsers, setFilterUsers] = useState(users) // l'état des données des utilisateurs afin de les rechercher
	const [loading, setLoading] = useState(true)  // chargement de l'état de la page

	const getUser = useCallback(() => {
		axios({
			method: "get",
			url: `${ApiUrl}/auth/`,
			headers: {"Authorization": `Bearer ${AuthenticationState.token}`},
		}).then((res) => {
			setUsers(res.data)
			setFilterUsers(res.data)
			setLoading(false)
		})
	}, [AuthenticationState.token])

	// chercher le rendu des utilisateurs
	const sendSearch = useCallback(
		(value) => {
			let result = users.filter((user) => {
				if (user.firstName.toLowerCase().search(value) !== -1 || user.lastName.toLowerCase().search(value) !== -1) return true
				else return false
			})
			setFilterUsers(result)
		},
		[users]
	)
	
	// supprimer l'utilisateur
	const deleteUser = useCallback(
		(email) => {
			axios({
				method: "delete",
				url: `${ApiUrl}/auth/user/${email}`,
				headers: {"Authorization": `Bearer ${AuthenticationState.token}`},
			})
				.then((res) => {
					if (res.status === 200) {
						messageSuccess("Compte supprimé", 1000)
						getUser()
					}
				})
				.catch(() => {
					messageError("Erreur : impossible de supprimer cet utilisateur.")
				})
		},
		[AuthenticationState.token, getUser]
	)

	const initialMembersRender = useMemo(() => {
		// affiche la liste des collègues
		return (
			<div className="card shadow p-3 h-100 overflow-hidden d-flex flex-column mb-4">
				<h3 className="text-center mb-3">Collègues</h3>
				<input type="text" onChange={(event) => sendSearch(event.target.value.toLowerCase())} className="searchUsers mb-4" aria-label="formulaire membres" placeholder="Rechercher..."></input>
				<ul className="p-0 w-100 overflow-auto" style={{"maxHeight": "80vh"}} >
					{filterUsers.map((user, index) => (
						<div key={index}>
							<li className="d-flex align-items-center justify-content-between mb-4 w-100 text-left">
								<button
									className="d-flex align-items-center justify-content-start flex-grow-1 bg-transparent btn--members text-start text-truncate "
									onClick={() => setMembersRender(<MemberProfil user={user} setMembersRender={setMembersRender} initialMembersRender={initialMembersRender} />)}
								>
									<ProfilLogo photo={user.photo} class="profile-picture--mini" />
									<span className="text-truncate mx-3">
										{user.firstName} {user.lastName}
										<br /> 
										{user.email}
									</span>
								</button>

								{AuthenticationState.isAdmin === true && user.firstName !== AuthenticationState.firstName ? (
									<button
										type="button"
										className="btn-sm btn--trash bg-white fs-5"
										onClick={() => {
											// demande de confirmation
											MySwal.fire({
												icon:"question",
												title: "Administrateur : Voulez-vous supprimer définitivement ce compte ?",
												timer: 15000,
												showCancelButton: true,
												confirmButtonText: "Oui",
												cancelButtonText: "Non",
												buttonsStyling: false,
												customClass: {
													confirmButton: "btn btn--success mx-3",
													cancelButton: "btn btn--cancel mx-3",
													title: "h5 font",
													popup: "card",
												},
											}).then((result) => {
												if (result.isConfirmed) {
													deleteUser(user.email)
												} else return
											})

										}}
										title="Admin: supprimer l'utilisateur"
										aria-label="Admin: supprimer l'utilisateur"
									>
									<FaTrashAlt />
									</button>
								) : null}
							</li>
						</div>
					))}
				</ul>
			</div>
		)
	}, [AuthenticationState.firstName, AuthenticationState.isAdmin, filterUsers, sendSearch])


	const [membersRender, setMembersRender] = useState(initialMembersRender)  

	// obtenir le rendu des membres après l'obtention des utilisateurs
	useEffect(() => {
		setMembersRender(initialMembersRender)
	}, [filterUsers, initialMembersRender, ])

	// amener les utilisateurs à la page de chargement
	useEffect(() => {
		getUser()
	}, [getUser, ])

	// loader page 
	if (loading === true)
		return (
			<div className="d-flex justify-content-center align-items-center vh-100 bg-white">
				<TailSpin type="TailSpin" color="#036bfc" height={100} width={100} timeout={300000} />
			</div>
		)
	else return membersRender
}


function MemberProfil(props) {
	//affiche le profil du membre
	return (
		<div className="card shadow p-3 mb-4 h-100 overflow-hidden d-flex flex-column align-items-center text-truncate">
			<ProfilLogo photo={props.user.photo} />
			<div className="mt-3 mb-2 text-wrap text-break">{props.user.email}</div>
			<div className="mb-3 text-truncate text-wrap">
				{props.user.firstName} {props.user.lastName}
			</div>

			<button
				className="btn-sm btn--customize1"
				onClick={() => {
					props.setMembersRender(props.initialMembersRender)
				}}
			>
				Retour 
			</button>
		</div>
	)
}
