// stocker l'image de profil dans le stockage local à partir de la base de données
export const dataURL = (url) =>
	fetch(url) 
		.then((response) => response.blob())
		.then(
			(blob) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onloadend = () => resolve(reader.result)
					reader.onerror = reject
					reader.readAsDataURL(blob)
				})
		)
