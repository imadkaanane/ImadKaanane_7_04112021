import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// pages
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import ProfilPage from "./pages/ProfilPage"
import MembersPage from "./pages/MembersPage"
// utils
import { initialAuthentication, AuthenticationReducer } from "./utils/Authentication"

// stocker les données globales d'authentification
export const AuthenticationContext = React.createContext()

function App() {

	// envoyer les données d'authentification et action
	const [AuthenticationState, dispatchAuthenticationState] = React.useReducer(AuthenticationReducer, initialAuthentication)

	let routes

	// accès aux différentes routes si connecté ou non
	if (!AuthenticationState.isAuthenticated) {
		routes = (
			<Router>
				<Routes>
					<Route path="/" element={<LoginPage />} />
				</Routes>
			</Router>
		)
	} else {
		routes = (
			<Router>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/profil" element={<ProfilPage />} />
					<Route path="/members" element={<MembersPage />} />
				</Routes>
			</Router>
		)

	}


	return (
		<AuthenticationContext.Provider value={{ AuthenticationState, dispatchAuthenticationState, }}>
			{routes}
		</AuthenticationContext.Provider>
	)
}

export default App
