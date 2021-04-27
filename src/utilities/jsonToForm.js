/**
 * Converts a JSON object to a FormData object
 * @param {object} body - The response body from the request to be converted
 * @returns {FormData} - The converted formData object
 */

function jsonToForm(body) {
	const { confirm: _confirm, upload, ...data } = body;
	const form = new FormData();

	Object.keys(data).forEach((key) => {
		if (data[key]) {
			form.append(key, data[key]);
		}
	});

	if (upload) { // prevent empty image property from being sent
		form.append('upload', upload.file);
	}
	return form;
}

export default jsonToForm;
