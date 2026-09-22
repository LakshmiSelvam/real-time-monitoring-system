import moment from "moment-timezone";

export function desc(a, b, orderBy) {
	let parsedA = (b[orderBy] || "").toString().trim();
	let parsedB = (a[orderBy] || "").toString().trim();
	if(orderBy && orderBy.toLowerCase().includes("date")){
		let valueA = {}
		let valueB = {}
		Object.assign(valueA, a)
		Object.assign(valueB, b)
		if(!valueA[orderBy]){
			valueA[orderBy] = moment("1990", "YYYY")
		}
		if(!valueB[orderBy]){
			valueB[orderBy] = moment("1990", "YYYY")
		}
		return moment(valueA[orderBy], a.format) - moment(valueB[orderBy], b.format)
	}
	return (parsedB.localeCompare("a") >= 0) - (parsedA.localeCompare("a") >= 0) || parsedA.localeCompare(parsedB);
}

export function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
	return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}