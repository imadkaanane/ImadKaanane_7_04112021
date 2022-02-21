import React, { useContext, useEffect, useState, useCallback } from "react"
import { AuthenticationContext } from "../App"
import axios from "axios"
import { TailSpin } from "react-loader-spinner"
// Components
import Navigation from "../components/Navigation"
import Profil from "../components/Profil"
import PostForm from "../components/PostForm"
import PostCard from "../components/PostCard"
import Members from "../components/Members"

// Utils
import { ApiUrl } from "../utils/AdressAPI"

export default function HomePage() {
	const { AuthenticationState } = useContext(AuthenticationContext) // utiliser l'authentification globalstate

	// définir et actualiser les données des articles
	const [postsData, setPostsData] = useState(false)
	const [postsRefresh, setPostsRefresh] = useState(false)

	// obtenir tous les articles
	const getAllPosts = useCallback(() => {
		axios({
			method: "get",
			url: `${ApiUrl}/posts`,
			headers: { "Authorization": `Bearer ${AuthenticationState.token}` },
		}).then((res) => {
			setPostsData(res.data)
		})
	}, [AuthenticationState.token])

	// événement : obtenir et actualiser des articles
	useEffect(() => {
		getAllPosts()
		setPostsRefresh(false)
	}, [postsRefresh, AuthenticationState, getAllPosts])


	// chargement de la page
	if (postsData === false)
		return (
			<div className="d-flex justify-content-center align-items-center vh-100 bg-white">
				<TailSpin type="TailSpin" color="#036bfc" height={100} width={100} timeout={300000} />
			</div>
		)
	else
		return (
			<React.Fragment>
				<Navigation />
				<div className="container gx-0">
					<div className="row">
						<div className="d-none d-lg-block col-4">
							<aside className="p-0 d-none d-lg-block mb-4">
								<Profil />
							</aside>
							<aside className="p-0 d-none d-lg-block">
								<Members />
							</aside>
						</div>
						<div className="col-lg-8 mb-4">
							<aside className="align-self-center mb-4 ">
								<h1 className="d-none">Page d'accueil Groupomania</h1>
								<PostForm setPostsRefresh={setPostsRefresh} />
							</aside>
							<main className="d-lg-flex justify-content-lg-between flex-wrap">
								{postsData
									.sort(function (a, b) {
										let dateA = new Date(a.createdAt),
											dateB = new Date(b.createdAt)
										return dateB - dateA
									})
									.map((post) => (
										<PostCard post={post} key={post.id} setPostsRefresh={setPostsRefresh} class="post--card" />
									))}
							</main>
						</div>
					</div>
				</div>
			</React.Fragment>
		)
}
