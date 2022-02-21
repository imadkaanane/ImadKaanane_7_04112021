import React, { useState } from "react"
// Components
import SignUp from "./SignUp"
import Login from "./Login"

export default function Connexion() {
	// état de connexion 
	const [connexion, setConnexion] = useState()

	return (
		<div>
			{(() => {
				if (connexion === "signUp") {
					// affiche la page d'inscription
					return (
						<div className="d-flex flex-column align-items-center mb-5 ">
							<SignUp setConnexion={setConnexion} />
							<br /> Déjà un compte ? <br /> <br />
							<button className="btn btn--cancel" onClick={() => setConnexion("login")} title="Se connecter" aria-label="Se connecter">
								Se connecter
							</button>
						</div>
					)
				} else if (connexion === "login") {
					// affiche la page login
					return (
						<div className="d-flex flex-column align-items-center mb-5">
							<Login />
							<br /> Créer un compte ? <br /> <br />
							<button className="btn btn--cancel" onClick={() => setConnexion("signUp")} title="S'inscrire" aria-label="S'inscrire">
								S'inscrire
							</button>
						</div>
					)
				}
				else {
					// affiche la page de demarrage
					return (
						<div className="d-flex flex-column align-items-center mb-5">
							<button type="button" onClick={() => setConnexion("signUp")} className="btn btn--success" title="S'inscrire" aria-label="S'inscrire">
								S'inscrire
							</button>
							<br></br> ou <br></br> <br></br>
							<button type="button" onClick={() => setConnexion("login")} className="btn btn--cancel" title="Se connecter" aria-label="Se connecter">
								Se connecter
							</button>
						</div>
					)
				}

			})()}
		</div>
	)
}
