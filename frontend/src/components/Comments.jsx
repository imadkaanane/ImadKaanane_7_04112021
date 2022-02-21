import React, { useEffect, useState, useContext, useCallback } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// Components
import { AuthenticationContext } from "../App"
import CommentForm from "./CommentForm"
import ProfilLogo from "./ProfilLogo"
// icons
import { faTrashAlt, faComment } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// Utils
import { ApiUrl } from "../utils/AdressAPI"
import { formatDate } from "../utils/FormatDate"
import { messageError, messageSuccess } from "../utils/MessageAlert"

export default function Comments(props) {
	const { AuthenticationState } = useContext(AuthenticationContext) // utilisation de l'état global AuthenticationContext
	const [commentsRender, setCommentsRender] = useState(2) // définir des commentaires sans click, click ou utilisateur publie un nouveau commentaire

	// indiquer les données des commentaires et actualiser
	const [commentsData, setCommentsData] = useState([])
	const [commentsRefresh, setCommentsRefresh] = useState(false)

	// obtenir tous les commentaires
	const getAllComments = useCallback(() => {
		axios({
			method: "get",
			url: `${ApiUrl}/comments/${props.post.id}`,
			headers: { "Authorization": `Bearer ${AuthenticationState.token}` },
		})
			.then((res) => {
				setCommentsData(res.data)
				setCommentsRefresh(false)
			})
			.catch(() => messageError("Erreur lors du chargement des commentaires."))
	}, [AuthenticationState.token, props.post.id])

	// obtenir les articles et actualiser
	useEffect(() => {
		getAllComments()
		setCommentsRefresh(false)
	}, [commentsRefresh, getAllComments])

	return (
		<div className="card-body pt-0">
			<div className="d-flex justify-content-evenly border-bottom">
				<div>
					<button
						onClick={(e) => {
							e.preventDefault()
							setCommentsRender(commentsRender + 1)
						}}
						className="btn btn--comments shadow-none text-decoration-none"
					>
						
					<span>	{commentsData.length} </span>
					<FontAwesomeIcon icon={faComment} />
					</button>
				</div>
			</div>
			<div className="form-post mt-3">
				<CommentForm post={props.post} setCommentsRefresh={setCommentsRefresh} setCommentsRender={setCommentsRender} commentsRender={commentsRender} />
				<Comment data={commentsData} commentsRender={commentsRender} setCommentsRefresh={setCommentsRefresh} />
			</div>
		</div>
	)
}

// composants des commentaires
function Comment(props) {
	const { AuthenticationState } = useContext(AuthenticationContext) // utiliser l'état global de AuthenticationContext
	const MySwal = withReactContent(Swal) // bouton d'alerte personnalisé

	// suuppression ducommentaire
	const deleteComment = useCallback(
		(id) => {
			axios({
				method: "delete",
				url: `${ApiUrl}/comments/${id}`,
				headers: { "Authorization": `Bearer ${AuthenticationState.token}` },
			})
				.then((res) => {
					if (res.status === 200) {
						props.setCommentsRefresh(true)
						messageSuccess("Commentaire supprimé.", 1000)
					}
				})
				.catch(() => messageError("Erreur : impossible de supprimer ce commentaire."))
		},
		[AuthenticationState.token, props]
	)

	const renderComment = (comment) => {
		return (
			<li key={comment.id} className="card p-2 mb-1">
				<div className="d-flex align-items-center mb-2">
					<ProfilLogo photo={comment.User.photo} class="profile-picture--mini" />
					<span className="fw-bold mb-0 flex-grow-1 mx-2">
						{comment.User.firstName} {comment.User.lastName}
					</span>
					<span className={`d-flex justify-content-end mx-1 text-muted fst-italic article__date`}>{formatDate(comment.createdAt)}</span>
					{comment.UserId === AuthenticationState.user || AuthenticationState.isAdmin === true ? (
						<button
							type="button"
							className="btn-sm btn--trash bg-white fs-6"
							onClick={() => {
								// demande de confirmation
								MySwal.fire({
									icon: "question",
									title: "Voulez-vous supprimer ce commentaire ?",
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
										deleteComment(comment.id)
									} else return
								})
							}}
							title="supprimer le commentaire"
							aria-label="supprimer le commentaire"
						>
							<FontAwesomeIcon icon={faTrashAlt} />
						</button>
					) : null}
				</div>
				<p className="mb-0 mx-5 text-dark">{comment.text}</p>
			</li>
		)
	}

	// Afficher tous les commentaires au clic ou lors de la publication d'un nouveau commentaire
	if (props.commentsRender % 2 === 1) {
		return props.data
			.sort(function (a, b) {
				let dateA = new Date(a.createdAt),
					dateB = new Date(b.createdAt)
				return dateB - dateA
			})
			.map((comment) => renderComment(comment))
	} else return null
}
