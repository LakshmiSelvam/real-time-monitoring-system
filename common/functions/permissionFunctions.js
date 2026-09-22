
export function validateSidebar(userPermissions, refnames, deployement) {
	if (localStorage.getItem("functionalRoleId") < 5) {
		if(refnames.length === 1 && refnames[0] === "VIEW_DEVICES" && deployement){
			if(deployement.Deployment){
				return deployement.Deployment.isDeviceBasedAlert;
			}
			
		}
		return true;
	}
	for (let index = 0; index < refnames.length; index++) {
		const refname = refnames[index];
		if (userPermissions.includes(refname)) {
			return true;
		}
	}
	return false;
}

export function validatePermission(userPermissions, refname) {
	if (localStorage.getItem("functionalRoleId") < 5) {
		return true;
	}
	if (Array.isArray(refname)) {
		for (let index = 0; index < refname.length; index++) {
			if (userPermissions.includes(refname[index])) {
				return true;
			}
		}
	}else{
		if (userPermissions.includes(refname)) {
			return true;
		}
	}
	return false;
}
