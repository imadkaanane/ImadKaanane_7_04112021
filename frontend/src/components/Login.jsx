import React, {useContext, useState} from "react"
import {Formik, Form, Field, ErrorMessage} from "formik"
import axios from "axios"
import * as Yup from "yup"
import {useNavigate} from "react-router-dom"
// utils
import {ApiUrl} from "../utils/AdressAPI"
import {messageError} from "../utils/MessageAlert"
// components
import {AuthenticationContext} from "../App"

export default function Login() {
	require("yup-password")(Yup) // mettre à jour la librairie yup password
	let navigate = useNavigate() //utilisation de API HOOKS useNvigate pour naviguer aprés la soumission du formulaire 
	const {dispatchAuthenticationState} = useContext(AuthenticationContext)  // action d'envoi et état d'authentification
	const [errorMessage, setErrorMessage] = useState(null)  // définir le message d'erreur du serveur

	// validation des valeurs d'entrée
	const LoginSchema = Yup.object().shape({
		email: Yup.string()
			.email("mail invalide*")
			.test("@groupomania.com", "mail@groupomania.com*", (email) => email && email.indexOf("@groupomania.com", email.length - "@groupomania.com".length) !== -1)
			.required("obligatoire*"),
		password: Yup.string()
			.required("obligatoire*")
			.min(6, "trop court, 6 minimum*")
			.max(50, "trop long, 50 maximum*")
			.minLowercase(1, "minimum 1 lettre minuscule")
			.minUppercase(1, "minimum 1 lettre majuscule")
			.minNumbers(1, "minimum 1 chiffre")
			.minSymbols(1, "minimum 1 symbole"),
	})

	// envoyer les données du formulaire puis se connecter
	const formSubmit = (values, resetForm) => {
		axios({
			method: "post",
			url: `${ApiUrl}/auth/login`,
			data: values,
		})
			.then((res) => {
				// lancer l'action d'authentification
				if (res.status === 200) {
					dispatchAuthenticationState({
						type: "LOGIN",
						payload: res.data,
					})
					setErrorMessage(null)
					resetForm()
					navigate("/home")
				}
			})
			.catch((error) => {
				if (typeof error.response.data === "string") setErrorMessage(error.response.data)
				else messageError("Erreur : impossible de se connecter. Veuillez contacter un admin ou retenter ultérieurement")
			})
	}
	// affiche le formulaire de connaxion (login)
	return (
		<div className="form-login">

			<Formik
				initialValues={{
					email: "",
					password: "",
				}}
				validationSchema={LoginSchema}
				onSubmit={(values, {resetForm}) => {
					formSubmit(values, resetForm)
				}}
			>
				{() => (
					<Form className="d-flex flex-column align-items-center">
						<Field name="email" type="email" placeholder="Mail Groupomania" className="input--login px-2" />
						<ErrorMessage name="email" component="div" className="errorInput align-self-start" />

						<Field name="password" type="password" placeholder="Mot de passe" className="input--login px-2" />
						<ErrorMessage name="password" component="div" className="errorInput align-self-start" />

						<button type="submit" className="btn-lg btn--success" title="Se connecter" aria-label="Se connecter">
							Se connecter
						</button>

						{errorMessage && (
							<div className="text-danger small text-center">
								<br />
								{errorMessage}
							</div>
						)}
					</Form>
				)}
			</Formik>
		</div>
	)
}
