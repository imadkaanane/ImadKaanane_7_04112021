import React, { useState } from "react"
import Lottie from "lottie-react"
// Components
import Connexion from "../components/Connexion"
import * as animationData from "../assets/64085-globe.json"

export default function LoginPage() {

	// animation du loader avant le rendu
	const [loading, setLoading] = useState(true)
	setTimeout(() => {
		setLoading(false)
	}, 1300)

	return (
		<React.Fragment>
			{loading ? (
				<Lottie animationData={animationData} options={{ loop: true, autoplay: true }} className="mt-5" style={{ "background": "none", "height": "80vh" }} />
			) : (
				<div className="container d-flex justify-content-center align-items-center mt-5 mb-5">
					<div className="card shadow p-5">
						<div className="d-flex justify-content-center">
							<img src="/img/icon-left-font-monochrome-black.svg" alt="Logo Groupomania" className="img-fluid mx-auto mb-5" />
						</div>
						<Connexion />
					</div>
				</div>
			)}
		</React.Fragment>
	)
}
