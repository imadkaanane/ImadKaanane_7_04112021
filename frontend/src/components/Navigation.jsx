import React, { useContext } from "react"
import { NavLink } from "react-router-dom"

//icons
import { faUserFriends, faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// components
import { AuthenticationContext } from "../App"
import ProfilLogo from "./ProfilLogo"
// utils
import { messageSuccess } from "../utils/MessageAlert"

export default function Navigation() {

    const { AuthenticationState, dispatchAuthenticationState } = useContext(AuthenticationContext) // action d'envoi et état d'authentification

    // lancer l'action de déconnexion
    const deconnect = () => {
        dispatchAuthenticationState({
            type: "LOGOUT",
        })
    }

    return (
        // affiche la barre de navigation
        <header className="header shadow py-0">
            <nav className="navbar navbar-expand mb-4">
                <div className="container ">
                    <NavLink className="navbar-brand d-lg-block" to="/home" title="Retour accueil">
                        <img src="/img/icon-left-font-monochrome-white.svg" alt="Retour accueil" className="navbar-brand__logo" />
                    </NavLink>

                    <div >
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item" >
                                <NavLink className="nav-link active" to="/home" aria-label="Acceuil" title="Acceuil">
                                    <FontAwesomeIcon icon={faHome} />
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/members" aria-label="Membres" title="Membres">
                                    <FontAwesomeIcon icon={faUserFriends} />
                                </NavLink>
                            </li>
                            <li className="nav-item ">
                                <NavLink className="nav-link" to="/profil" aria-label="Profil" title="Profil">
                                    <ProfilLogo photo={AuthenticationState.photo} class="profile-picture--mini mr-0" />
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    onClick={() => {
                                        deconnect()
                                        messageSuccess("Vous êtes déconnecté", 1000)
                                    }}
                                    to="/"
                                    className="nav-link"
                                    title="Se deconnecter"
                                    aria-label="Se deconnecter"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />

                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}
