import React, { useEffect, useState, useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import axios from "axios"
import * as Yup from "yup"
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { faYoutube } from "@fortawesome/free-brands-svg-icons"
// Components
import ProfilLogo from "./ProfilLogo"
import { AuthenticationContext } from "../App"
// Utils
import { ApiUrl } from "../utils/AdressAPI"
import { messageError } from "../utils/MessageAlert"

export default function PostForm(props) {

	const { AuthenticationState } = useContext(AuthenticationContext)  // utiliser l'état global d'authentification (AuthenticationContexte)
	const [media, setMedia] = useState(null)  // état d'entrée du choix média
	const [selectFile, setSelectFile] = useState()  // état du fichier téléchargé
	const [errorMessage, setErrorMessage] = useState(null) // definir le message d'erreur

	// personnaliser la saisie du texte du message de bienvenue avec le nom d'utilisateur
	const [textPlaceHolder, setTextPlaceHolder] = useState("Quoi de neuf ?")
	useEffect(() => {
		setTextPlaceHolder(`Quoi de neuf ${AuthenticationState.firstName} ?`)
	}, [AuthenticationState])

	// soumettre le formulaire et demande
	function formSubmit(values, resetForm) {
		// définir l'objet de données à envoyer
		const formData = new FormData()
		formData.append("author", AuthenticationState.user)
		if (values.text) formData.append("text", values.text)
		if (values.youtube) formData.append("youtube", values.youtube)
		//ajout de fichier s'il existe et le valider
		if (selectFile && selectFile.size < 3000000 && ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(selectFile.type)) {
			formData.append("picture", selectFile)
		} else if (selectFile) {
			setErrorMessage("Erreur de fichier. Formats autorisés : .jpg .jpeg .png .gif, max 3Mo")
			return
		} else { }
		if (values.youtube && selectFile) formData.delete("youtube") //envoi seulement un seul media

		axios({
			method: "post",
			url: `${ApiUrl}/posts`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${AuthenticationState.token}` },
		})
			.then(() => {
				resetForm()
				setErrorMessage(null)
				setSelectFile()
				setMedia("default")
				props.setPostsRefresh(true)
			})
			.catch((error) => {
				if (typeof error.response.data === "string") setErrorMessage(error.response.data)
				else messageError("Erreur : impossible de poster votre post. Veuillez retenter ultérieurement")
			})
	}

	// validation des valeurs d'entrée
	const validationSchema = Yup.object().shape({
		text: Yup.string(),
		youtube: Yup.string(),
	})
	// affiche le formulaire d'envoi des posts
	return (
		<div className="card shadow form-post p-3 d-flex flex-column justify-content-center">
			<h2 className="d-none">Formulaire creation post article</h2>
			<Formik
				initialValues={{ text: "", youtube: "" }}
				validationSchema={validationSchema}
				onSubmit={(values, { resetForm }) => {
					if (values.text === "" && values.youtube === "" && !selectFile) {
						setErrorMessage("Veuillez remplir au moins 1 champs du formulaire")
						return
					}
					formSubmit(values, resetForm)
				}}
			>
				<Form>
					<div className="d-flex align-items-center justify-content-between mb-3">
						<ProfilLogo photo={AuthenticationState.photo} class="profile-picture--mini" />
						<Field name="text" type="textarea" placeholder={textPlaceHolder} className="input-text px-3 py-1 mx-3" style={{ "height": "70px" }} />
						<ErrorMessage name="text" component="div" className="errorInput" />
					</div>

					{(() => { // 3 états : uploader le fichier, envoyer le lien youtube ou choisir entre eux
						// affiche un formullaire pour upload le fichier et le bouton youtube
						if (media === "upload") {
							return (
								<div className="d-flex justify-content-between align-items-center flex-wrap">
									<div className="mx-auto">
										<Field name="picture" onChange={(e) => setSelectFile(e.target.files[0])} type="file" accept=".jpg, .jpeg, .png, .gif" className="mb-3 input-file" />
									</div>
									<ErrorMessage name="picture" component="div" className="errorInput" />
									<button
										type="button"
										onClick={() => {
											setMedia("youtube")
											setSelectFile()
										}}
										className="btn-sm btn--cancel mb-3 d-bloc m-auto"
										title="Joindre une vidéo youtube"
										aria-label="Joindre une vidéo youtube"
									>
										Joindre une vidéo Youtube &nbsp; <FontAwesomeIcon icon={faYoutube} />
									</button>
								</div>
							)
						// afficher un formulaire pour ajouter un lien youtube et le bouton joindre une photo (upload)	
						} else if (media === "youtube") {
							return (
								<div className="d-flex align-items-center flex-wrap">
									<div className="d-inline mx-auto">
										<Field name="youtube" placeholder="Votre lien Youtube" className="input-youtube mb-4 px-2" />
									</div>
									<button
										type="button"
										onClick={() => setMedia("upload")}
										className="btn-sm btn--cancel mb-4 d-bloc m-auto"
										title="Joindre une photo"
										aria-label="Joindre une photo"
									>
										Joindre une photo &nbsp;{" "}
										<span className="awesomeColorIcon">
											<FontAwesomeIcon icon={faCamera} />
										</span>
									</button>
								</div>
							)
						} else {
							// affiche le bouton pour uploader le fichier et le bouton pour les liens youtube
							return (
								<div className="d-flex flex-wrap justify-content-around">
									<button
										type="button"
										onClick={() => setMedia("upload")}
										className="btn btn--cancel mb-4 d-bloc m-auto"
										title="Joindre une photo"
										aria-label="Joindre une photo"
									>
										Joindre une photo &nbsp; <FontAwesomeIcon icon={faCamera} />
									</button>
									<button
										type="button"
										onClick={() => setMedia("youtube")}
										className="btn btn--cancel mb-4 mb-lg-4 d-bloc m-auto"
										title="Joindre une video youtube"
										aria-label="Joindre une video youtube"
									>
										Joindre une vidéo Youtube &nbsp; <FontAwesomeIcon icon={faYoutube} />
									</button>
								</div>
							)
						}

					})()}

					<button type="submit" className="btn btn--success d-bloc m-auto mb-1 mt-lg-0" title="Envoyer les données" aria-label="Envoyer les données">
						Envoyer
					</button>
					{errorMessage && <div className="errorInput mt-1 text-center">{errorMessage}</div>}
				</Form>
			</Formik>
		</div>
	)
}
