import React, {useContext, useState} from "react"
import {Formik, Form, Field, ErrorMessage} from "formik"
import axios from "axios"
import * as Yup from "yup"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// import utils
import {ApiUrl} from "../utils/AdressAPI"
// importation des données utilisateurs
import {AuthenticationContext} from "../App"
import { messageSuccess } from "../utils/MessageAlert"

export default function PasswordForm(props) {
	require("yup-password")(Yup) //mise à jour de la librairie yup password 
	const {AuthenticationState} = useContext(AuthenticationContext) // utiliser l'état global d'authentification (AuthenticationContext)
	const MySwal = withReactContent(Swal) // bouton d'alerte personnalisé
	const [errorMessage, setErrorMessage] = useState(null) // définir le message d'erreur du serveur

	// validation des valeurs d'entrée
	const passwordTest = Yup.string()
	.required("obligatoire*")
	.min(6, "trop court, 6 minimum*")
	.max(50, "trop long, 50 maximum*")
	.minLowercase(1, "minimum 1 lettre minuscule")
	.minUppercase(1, "minimum 1 lettre majuscule")
	.minNumbers(1, "minimum 1 chiffre")
	.minSymbols(1, "minimum 1 symbole")

	const ModifyPasswordSchema = Yup.object().shape({
		oldPassword: passwordTest,
		password: passwordTest,
		passwordConfirm: passwordTest,
	})

	// envoi les données du formulaire
	const formSubmit = (values, resetForm) => {
		axios({
			method: "put",
			url: `${ApiUrl}/auth/password`,
			data: values,
			headers: {"Authorization": `Bearer ${AuthenticationState.token}`},
		})
			.then((res) => {
				// si la modification de l'utilisateur est bien faite, connectez-vous avec les données de réponse
				if (res.status === 200) {
					setErrorMessage(null)
					resetForm()
					props.setProfilRender(props.initialProfilRender)
					messageSuccess("Mot de passe modifié", 2500)
				}
			})
			.catch((error) => {
				if (error.response) setErrorMessage(error.response.data)
			})
	}
	// affiche le formulaire de modification du mot de passe
	return (
		<div className="card shadow form-login p-3 h-100 flex-column justify-content-center">
			<h3 className="text-center h4">Modifier mon mot de passe ?</h3>
			<Formik
				initialValues={{
					oldPassword: "",
					password: "",
					passwordConfirm: "",
				}}
				validationSchema={ModifyPasswordSchema}
				onSubmit={(values, {resetForm}) => {
					// demande de confirmation 
					MySwal.fire({
						icon: "question",
						title: "Confirmer l'envoi du nouveau mot de passe ?",
						timer: 15000,
						showCancelButton: true,
						confirmButtonText: "Oui",
						cancelButtonText: "Non",
						buttonsStyling: false,
						customClass: {
							confirmButton: "btn btn--customize2 mx-3",
							cancelButton: "btn btn--customize1 mx-3",
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
					<Field name="oldPassword" type="password" placeholder="Ancien mot de passe" />
					<ErrorMessage name="oldPassword" component="div" className="errorInput" />

					<Field name="password" type="password" placeholder="Nouveau mot de passe" />
					<ErrorMessage name="password" component="div" className="errorInput" />

					<Field name="passwordConfirm" type="password" placeholder="Confirmer le mot de passe" />
					<ErrorMessage name="passwordConfirm" component="div" className="errorInput" />

					<button type="submit" className="btn btn--success" title="Modifier mot de passe" aria-label="Modifier mot de passe">
						Modifier le mot de passe
					</button>
					{errorMessage && <span className="errorInput mt-1 text-center ">{errorMessage}</span>}

					<button
						className="btn btn--cancel"
						onClick={() => {
							props.setProfilRender(props.initialProfilRender)
						}}
					>
						Fermer
					</button>
				</Form>
			</Formik>
		</div>
	)
}
