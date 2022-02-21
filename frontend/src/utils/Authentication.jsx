// utils
import { dataURL } from "./DataURL"

export let initialAuthentication = {}

// définir le délai d'expiration du stockage local 
const hours = 24
let saved = localStorage.getItem('savedAt')

if (saved && (new Date().getTime() - saved > hours * 60 * 60 * 1000)) {
	localStorage.clear()
	initialAuthentication = {
		isAuthenticated: false,
		isAdmin: false,
		user: null,
		token: null,
		firstName: null,
		lastName: null,
		email: null,
		photo: null,
	}
} else if (JSON.parse(localStorage.getItem("isAuthenticated")) === true) { // Init initialAuth si l'utilisateur est dans le stockage local
	initialAuthentication = {
		user: JSON.parse(localStorage.getItem("user")),
		token: JSON.parse(localStorage.getItem("token")),
		firstName: JSON.parse(localStorage.getItem("firstName")),
		lastName: JSON.parse(localStorage.getItem("lastName")),
		email: JSON.parse(localStorage.getItem("email")),
		photo: JSON.parse(localStorage.getItem("photo")),
		isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")),
		isAdmin: JSON.parse(localStorage.getItem("isAdmin")),
	}
} else {
	localStorage.clear()
	initialAuthentication = {
		isAuthenticated: false,
		isAdmin: false,
		user: null,
		token: null,
		firstName: null,
		lastName: null,
		email: null,
		photo: null,
	}
}

// Action à faire en cas de
export const AuthenticationReducer = (authenticationState, action) => {
	switch (action.type) {
		case "LOGIN":
			// enregistrer les données utilisateur
			localStorage.setItem("user", JSON.stringify(action.payload.user))
			localStorage.setItem("token", JSON.stringify(action.payload.token))
			localStorage.setItem("firstName", JSON.stringify(action.payload.firstName))
			localStorage.setItem("lastName", JSON.stringify(action.payload.lastName))
			localStorage.setItem("email", JSON.stringify(action.payload.email))
			localStorage.setItem("isAuthenticated", JSON.stringify(action.payload.isAuthenticated))
			localStorage.setItem("isAdmin", JSON.stringify(action.payload.isAdmin))
			localStorage.setItem('savedAt', new Date().getTime())

			// enregistrer la photo de profil
			dataURL(action.payload.photo).then((dataUrl) => {
				localStorage.setItem("photo", JSON.stringify(dataUrl))
			})

			return {
				...authenticationState,
				user: action.payload.user,
				token: action.payload.token,
				firstName: action.payload.firstName,
				lastName: action.payload.lastName,
				email: action.payload.email,
				photo: action.payload.photo,
				isAuthenticated: action.payload.isAuthenticated,
				isAdmin: action.payload.isAdmin,
			}
		case "LOGOUT":
			localStorage.clear()
			return {
				isAuthenticated: false,
				isAdmin: false,
				user: null,
				token: null,
				firstName: null,
				lastName: null,
				email: null,
				photo: null,
			}
		default:
			return authenticationState
	}
}
