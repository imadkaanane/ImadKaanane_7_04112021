import React, { useContext, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import axios from "axios"
import * as Yup from "yup"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// import utils
import { ApiUrl } from "../utils/AdressAPI"
import { messageError, messageSuccess } from "../utils/MessageAlert"
// import components
import { AuthenticationContext } from "../App"
import PasswordForm from "./PasswordForm"

export default function ModifyProfilForm(props) {

	const { AuthenticationState, dispatchAuthenticationState } = useContext(AuthenticationContext)  // utiliser l'état global d'authentification et l'action d'envoi
	const MySwal = withReactContent(Swal)  // bouton d'alerte personnalisé
	const [selectFile, setSelectFile] = useState()  // état du fichier téléchargé
	const [errorMessage, setErrorMessage] = useState(null)  // définir le message d'erreur du serveur

	// validation des valeurs d'entrées
	const ValidationSchema = Yup.object().shape({
		firstName: Yup.string().min(2, "trop court*").max(50, "Trop long*"),
		lastName: Yup.string().min(2, "trop court*").max(50, "Trop long*"),
		password: Yup.string().min(4, "trop court*").max(50, "Trop long*"),
	})

	// envoi les données du formulaire
	const formSubmit = (values, resetForm) => {
		// besoin du contenu
		if (!values.firstName && !values.lastName && !selectFile) return setErrorMessage("Veuillez remplir au moins 1 champs du formulaire")

		// définir l'objet de données à envoyer
		const formData = new FormData()
		for (let i in values) {
			if (!values[i]) {
			} else if (i === "email") formData.append(i, values[i].toLowerCase())
			else formData.append(i, values[i].charAt(0).toUpperCase() + values[i].slice(1).toLowerCase())
		}

		// ajouter un fichier s'il existe et le validé
		if (selectFile && selectFile.size < 3000000 && ["image/jpg", "image/jpeg", "image/png"].includes(selectFile.type)) {
			formData.append("picture", selectFile)
		} else if (selectFile) {
			messageError("Erreur de fichier. Non obligatoire. Sinon choisir un fichier au format .jpg .jpeg .png, max 3Mo")
			return
		} else { }

		axios({
			method: "put",
			url: `${ApiUrl}/auth/`,
			data: formData,
			headers: { "Authorization": `Bearer ${AuthenticationState.token}`, "Content-Type": "multipart/form-data" },
		})
			.then((res) => {
				// lancer l'authentification
				if (res.status === 200) {
					dispatchAuthenticationState({
						type: "LOGIN",
						payload: res.data,
					})
					setErrorMessage(null)
					resetForm()
				}
			})
			.catch((error) => {
				if (typeof error.response.data === "string") setErrorMessage(error.response.data)
				else messageError("Erreur : impossible de modifier votre compte. Veuillez contacter un admin ou retenter ultérieurement")
			})
	}
	// suppression du compte
	const deleteAccount = () => {
		axios({
			method: "delete",
			url: `${ApiUrl}/auth`,
			headers: { "Authorization": `Bearer ${AuthenticationState.token}` },
		})
			.then((res) => {
				if (res.status === 200) {
					dispatchAuthenticationState({
						type: "LOGOUT",
					})
					messageSuccess("Votre compte a bien été supprimé", 1300)
				}
			})
			.catch((error) => {
				if (typeof error.response.data === "string") setErrorMessage(error.response.data)
				else messageError("Erreur : impossible de supprimer votre compte. Veuillez contacter un admin ou retenter ultérieurement")
			})
	}
	//affiche le formulaire de modification du profil
	return (
		<div className="card shadow form-login p-3 h-100 flex-column justify-content-center">
			<h3 className="text-center h4">Modifier mes informations ?</h3>

			<Formik
				initialValues={{
					firstName: "",
					lastName: "",
					photo: "",
				}}
				validationSchema={ValidationSchema}
				onSubmit={(values, { resetForm }) => {

					// besoin de contenu
					if (!values.firstName && !values.lastName && !selectFile) return setErrorMessage("Veuillez remplir au moins 1 champs du formulaire")

					// afficher les nouvelles informations et demander confirmation
					let newFirstName = ""
					let newLastName = ""
					let newFile = ""
					if (values.firstName) newFirstName = `Prénom : ${values.firstName}`
					if (values.lastName) newLastName = `Nom : ${values.lastName}`
					if (selectFile) newFile = `Photo de profil : ${selectFile.name}`

					MySwal.fire({
						icon: "question",
						title: "Êtes-vous sûr de vouloir modifier ces informations ?",
						html: `  <div >${newFirstName} <br/> ${newLastName} <br/> ${newFile}</div>`,
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
							formSubmit(values, resetForm)
						} else return
					})
				}}
			>
				<Form className="d-flex flex-column align-items-center">
					<Field name="firstName" type="text" placeholder={`Prénom actuel : ${AuthenticationState.firstName}`} className="px-2" />
					<ErrorMessage name="firstName" component="div" className="errorInput" />

					<Field name="lastName" type="text" placeholder={`Nom actuel : ${AuthenticationState.lastName}`} className="px-2" />
					<ErrorMessage name="lastName" component="div" className="errorInput" />

					<Field name="picture" onChange={(e) => setSelectFile(e.target.files[0])} type="file" accept=".jpg, .jpeg, .png," className="input-file" />
					<ErrorMessage name="picture" component="div" className="errorInput" />

					<button
						type="submit"
						className="btn btn--success"
						title="Modifier"
						aria-label="Modifier"
					>
						Modifier
					</button>
					{errorMessage ? (
						<span className="errorInput mt-1 text-center ">{errorMessage}</span>
					) : (
						<span className="errorInput mt-1 text-center ">Seuls les champs saisis seront modifiés</span>
					)}

					<button
						onClick={() => props.setProfilRender(<PasswordForm setProfilRender={props.setProfilRender} initialProfilRender={props.initialProfilRender} />)}
						className="btn btn--success"
					>
						Modifier le mot de passe ?
					</button>
				</Form>
			</Formik>
			<span className="mt-2 mb-3">ou</span>
			<button
				className="btn btn--cancel mt-0 mb-0"
				onClick={() => {
					MySwal.fire({
						icon: "question",
						title: "Êtes-vous certain de vouloir supprimer votre compte définitivement ?",
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
							deleteAccount()
						} else return
					})
				}}
			>
				Supprimer le compte ?
			</button>
			<button
				className="btn btn--link"
				onClick={() => {
					props.setProfilRender(props.initialProfilRender)
				}}
			>
				Fermer
			</button>
		</div>
	)
}
