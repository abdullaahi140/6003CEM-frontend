import { DogBody, UserBody } from '../react-app-env';

/**
 * Converts a JSON object to a FormData object
 * @param {UserBody | DogBody} body - The response body from the request to be converted
 * @returns {FormData} - The converted formData object
 */
function jsonToForm(body: UserBody | DogBody): FormData {
	const { upload, ...data } = body;
	
	const form = new FormData();

	Object.keys(data).forEach((key) => {
		if (data[key] !== undefined) {
			form.append(key, data[key].toString());
		}
	});

	if (upload) { // prevent empty image property from being sent
		form.append('upload', upload.file);
	}
	return form;
}

export default jsonToForm;
