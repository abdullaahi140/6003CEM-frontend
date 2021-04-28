/**
 * Check the HTTP status code and resolve or reject accordingly
 * @param {object} response - the Response() object to process
 */
export function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	return new Promise((resolve, reject) => reject(response));
}

/**
 * Extract the response body for further processing
 * @param {object} response - the Response() object to process
 */
export function json(response, image) {
	if (image) {
		return response.blob();
	}
	return response.json();
}
