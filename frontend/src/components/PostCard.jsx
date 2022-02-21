import React, { useContext } from "react"
import ReactPlayer from "react-player/youtube"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// components
import { AuthenticationContext } from "../App"
import ProfilLogo from "./ProfilLogo"
import Comments from "./Comments"
// Utils
import { ApiUrl } from "../utils/AdressAPI"
import { formatDate } from "../utils/FormatDate"
import { messageError, messageSuccess } from "../utils/MessageAlert"
// icons
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"



export default function PostCard(props) {

	const navigate = useNavigate() // utilisation de useNavigate 
	const { AuthenticationState } = useContext(AuthenticationContext) // utilisation de l'état global d'authentification
	const MySwal = withReactContent(Swal) // bouton d'alerte personnalisé

	// Format date de l'article
	formatDate(props.post.createdAt)
	let postDate = formatDate(props.post.createdAt)

	// suppression de l'article demandé
	const deletePost = () => {
		axios({
			method: "delete",
			url: `${ApiUrl}/posts/${props.post.id}`,
			headers: { "Authorization": `Bearer ${AuthenticationState.token}` },
		})
			.then((res) => {
				if (res.status === 200) {
					//actualiser tous les posts. et diriger vers la page d'accueil
					if (props.setPostsRefresh) props.setPostsRefresh(true)
					else navigate("/home")
					messageSuccess("Post supprimé.", 1000)
				}
			})
			.catch(() => messageError("Erreur : impossible de supprimer ce post."))
	}

	let post = props.post

	// définir la taille du texte css en fonction du média (ou non). Parce que le débordement de texte : les points de suspension ne fonctionnent pas verticalement
	let cardBody = ""
	let cardText = ""
	let mediaContainer = ""
	let cardMediaNone = ""
	if (!post.picture && !post.youtube) {
		cardBody = "card-body--header--max"
		cardText = "card-text--max"
		cardMediaNone = "d-none"
	}
	if (!post.text) {
		cardBody = "card-body--header--min"
		mediaContainer = "media-container--max"
	}

	return (
		<div className={`card shadow post w-100 mb-4 ${props.class} `}>
			<div className={`border-bottom ${props.class}__send`}>
				<div className={`card-body card-body--header mb-3 align-items-center ${cardBody}`}>
					<div className="d-flex align-items-end flex-wrap mb-1">
						<ProfilLogo photo={props.post.User.photo} class="profile-picture--mini" />

						<span className="h5 flex-grow-1 mx-3">
							{props.post.User.firstName} {props.post.User.lastName}
						</span>

						{props.post.UserId === AuthenticationState.user || AuthenticationState.isAdmin === true ? (

							<button
								type="button"
								className="btn-sm bg-white btn--trash fs-5"
								onClick={() => {
									// demande de confirmation
									MySwal.fire({
										icon: "question",
										title: " Voulez-vous Supprimer ce post ?",
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
											deletePost()
										} else return
									})
								}}
								title="supprimer le post"
								aria-label="supprimer le post"
							>
								<FontAwesomeIcon icon={faTrashAlt} />
							</button>
						) : null}

					</div>

					<div className={`d-flex justify-content-end mb-2 mx-1 text-muted fst-italic post__date`}>{postDate}</div>

					<div className="text-decoration-none" title="Ouvrir le post">
						<p className={`card-text text-dark ${cardText}`}>{props.post.text}</p>
					</div>
				</div>
				{post.youtube || post.picture ? (
					<div className={`media-container ${mediaContainer} ${cardMediaNone}`}>
						<div className={`text-decoration-none`}>
							{post.youtube ? (
								<ReactPlayer url={props.post.youtube} width="100%" className="overflow-hidden" config={{ youtube: { playerVars: { origin: "https://www.youtube.com" } } }} />
							) : (
								<img src={props.post.picture} alt="article multimédia" />
							)}
						</div>
					</div>
				) : null}
			</div>

			<Comments post={props.post} setPostsRefresh={props.setPostsRefresh} />

		</div>
	)
}
