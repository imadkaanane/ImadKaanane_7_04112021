import React, { useState, useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import axios from "axios"
import * as Yup from "yup"
// Components
import ProfilLogo from "./ProfilLogo"
import { AuthenticationContext } from "../App"
// Utils
import { ApiUrl } from "../utils/AdressAPI"
import { messageError } from "../utils/MessageAlert"


export default function CommentForm(props) {

	const { AuthenticationState } = useContext(AuthenticationContext) // utiliser l'état global de AuthenticationContext
	const [errorMessage, setErrorMessage] = useState(null) // définir le message d'erreur

	// envoie les données du formulaire
	function formSubmit(values, resetForm) {
		axios({
			method: "post",
			url: `${ApiUrl}/comments/${props.post.id}`,
			headers: { "Authorization": `Bearer ${AuthenticationState.token}` },
			data: values,
		})
			.then((res) => {
				if (res.status === 200) {
					resetForm()
					props.setCommentsRefresh(true)
					if (props.commentsRender % 2 === 0) props.setCommentsRender(1) //afficher tous les commentaires
				} else {
					return res.status(403)
				}
			})
			.catch((error) => {
				if (typeof error.response.data === "string") setErrorMessage(error.response.data)
				else messageError("Erreur : impossible de poster votre commentaire. Veuillez retenter ultérieurement")
			})
	}

	// validation des valeurs d'entrée
	const validationSchema = Yup.object().shape({
		text: Yup.string().min(2, "trop court, min 2 caractères*").max(400, "trop long, max 400 caractères*").required(""),
	})

	return (
		<React.Fragment>
			<Formik
				initialValues={{ text: "" }}
				validationSchema={validationSchema}
				onSubmit={(values, { resetForm }) => {
					formSubmit(values, resetForm)
				}}
			>
				<Form>
					<div className="mb-3">
						<div className="d-flex align-items-center justify-content-between">
							<ProfilLogo photo={AuthenticationState.photo} class="profile-picture--mini" />
							<div className="d-flex form-post flex-grow-1 mx-3">
								<Field name="text" type="textarea" placeholder="Écrivez votre commentaire" className="input-text px-3 py-1" />
								<button type="submit" className="btn-sm btn--success mx-3" title="Commenter le post" aria-label="Commenter le post">
									Commenter
								</button>
							</div>
						</div>
						{errorMessage ? <div className="errorInput mt-1 text-center">{errorMessage}</div> : <ErrorMessage name="text" component="div" className="errorInput mx-5" />}
					</div>
				</Form>
			</Formik>
		</React.Fragment>
	)
}
