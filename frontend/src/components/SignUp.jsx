import React, {useState} from "react"
import {Formik, Form, Field, ErrorMessage} from "formik"
import axios from "axios"
import * as Yup from "yup"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// import utils
import {ApiUrl} from "../utils/AdressAPI"
import { messageError } from "../utils/MessageAlert"

export default function SignUp(props) {
	require('yup-password')(Yup)  //mise à jour yup password librairie
	const MySwal = withReactContent(Swal)  // bouton d'alerte personnalisé
	const [selectFile, setSelectFile] = useState()  // état du fichier téléchargé
	const [errorMessage, setErrorMessage] = useState(null)  // définir le message d'erreur du serveur
	// valider les valeurs d'entrée
	const SignupSchema = Yup.object().shape({
		firstName: Yup.string().min(3, "trop court*").max(50, "trop long*").required("obligatoire*"),
		lastName: Yup.string().min(3, "trop court*").max(50, "trop long*").required("obligatoire*"),
		email: Yup.string()
			.email("mail invalide*")
			.test("@groupomania.com", "mail@groupomania.com*", (email) => email && email.indexOf("@groupomania.com", email.length - "@groupomania.com".length) !== -1)
			.required("obligatoire*"),
		password: Yup.string().required("obligatoire*").min(6, "trop court, 6 minimum*").max(50, "trop long, 50 maximum*").minLowercase(1, "minimum 1 lettre minuscule").minUppercase(1, "minimum 1 lettre majuscule").minNumbers(1, "minimum 1 chiffre").minSymbols(1, "minimum 1 symbole"),
		passwordConfirm: Yup.string().required("obligatoire*").min(6, "trop court, 6 minimum*").max(50, "trop long, 50 maximum*").minLowercase(1, "minimum 1 lettre minuscule").minUppercase(1, "minimum 1 lettre majuscule").minNumbers(1, "minimum 1 chiffre").minSymbols(1, "minimum 1 symbole"),
	})

	// envoyer les données du formulaire 
	const formSubmit = (values, resetForm) => {

		// définir l'objet de données à envoyer
		const formData = new FormData()
		for (let i in values) {
			if (i === "password" || i === "passwordConfirm") formData.append(i, values[i])
			else if (i === "email") formData.append(i, values[i].toLowerCase())
			else formData.append(i, values[i].charAt(0).toUpperCase() + values[i].slice(1).toLowerCase()) 
		}
		// ajout du fichier s'il existe et le validé
		if (selectFile && selectFile.size < 3000000 && ["image/jpg", "image/jpeg", "image/png"].includes(selectFile.type)) {
			formData.append("picture", selectFile)
		} else if (selectFile) {
			setErrorMessage("Erreur de fichier. Non obligatoire. Sinon choisir un fichier au format .jpg .jpeg .png, max 3Mo")
			return
		} else {}

		axios({
			method: "post",
			url: `${ApiUrl}/auth/signup`,
			headers: {"Content-Type": "multipart/form-data"},
			data: formData,
		})
			.then((res) => {
				if (res.status === 200) {
					setErrorMessage(null)
					resetForm()
					MySwal.fire({
						title: "Votre compte a bien été créé. Vous pouvez désormais vous connecter avec vos identifiants.",
						icon: "success",
						showCloseButton: false,
						buttonsStyling: false,
						customClass: {
							confirmButton: "btn btn--success mx-3",
							title: "h4 font",
							popup: "card",
						},
					})
					props.setConnexion("login")
				}
			})
			.catch((error) => {
				if (typeof error.response.data === "string") setErrorMessage(error.response.data)
				else messageError("Erreur : impossible de créer un compte. Veuillez contacter un admin ou retenter ultérieurement")
			})

	}

	return (
		<div className="form-login ">
			
			<Formik
				initialValues={{
					firstName: "",
					lastName: "",
					email: "",
					password: "",
					passwordConfirm: "",

				}}
				validationSchema={SignupSchema}
				onSubmit={(values, {resetForm}) => {
					// définir un message d'erreur si le fichier est incorrect
					if (selectFile && selectFile.size > 3000000 && ["image/jpg", "image/jpeg", "image/png"].notIncludes(selectFile.type)) {
						setErrorMessage("Erreur de fichier. Non obligatoire. Formats autorisés : .jpg .jpeg .png, max 3Mo")
						return
					} 
					formSubmit(values, resetForm)
				}}
			>
				<Form className="d-flex flex-column align-items-center">
					<Field name="firstName" type="text" placeholder="Prénom" className=" px-2" />
					<ErrorMessage name="firstName" component="div" className="errorInput align-self-start px-4" />

					<Field name="lastName" type="text" placeholder="Nom" className=" px-2" />
					<ErrorMessage name="lastName" component="div" className="errorInput align-self-start px-4" />

					<Field name="email" type="email" placeholder="Mail Groupomania" className="px-2" />
					<ErrorMessage name="email" component="div" className="errorInput align-self-start px-4" />

					<Field name="password" type="password" placeholder="Mot de passe" className=" px-2" />
					<ErrorMessage name="password" component="div" className="errorInput align-self-start px-4" />

					<Field name="passwordConfirm" type="password" placeholder="Confirmer le mot de passe" className=" px-2" />
					<ErrorMessage name="passwordConfirm" component="div" className="errorInput align-self-start px-4" />

					<Field name="picture" onChange={(e) => setSelectFile(e.target.files[0])} type="file" accept=".jpg, .jpeg, .png," className="input-file" />
					<ErrorMessage name="picture" component="div" className="errorInput align-self-start px-4" />

					<button type="submit" className="btn-lg btn--success" title="S'inscrire" aria-label="S'inscrire">
						s'inscrire
					</button>

					{errorMessage && (
						<div className="text-danger small text-center">
							<br />
							{errorMessage}
						</div>
					)}
				</Form>
			</Formik>
		</div>
	)
}
