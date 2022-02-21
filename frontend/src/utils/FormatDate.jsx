export const formatDate = (date) => {
    // Format article date
	let options = {year: "numeric", month: "long", day: "numeric"}
	let dbDate = new Date(date)
	return dbDate.toLocaleDateString("fr-FR", options) + " , " + ("0" + dbDate.getHours()).slice(-2) + "h" + ("0" + dbDate.getMinutes()).slice(-2)
}