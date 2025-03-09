console.log(`...oh! if you're checking this out, you should definitely
consider becoming a member!

Did you know there is a function for it? Try running:

register({
  first: '<your first name>',
  last: '<your last name>',
  email: '<your email address>',
  public: true, # wether you want your membership to be displayed publicly
  handles: '<your GitHub handle>, <your Discord handle>, etc.'
})
`);

let lastSubmissionTime = 0;
const SUBMISSION_INTERVAL = 30_000;
const FORM_URL = "https://codersonly.clubdesk.com/home";
const FAILED = "Oopsies! An error occurred... maybe it's easier to send us an email? contact@codersonly.org";

function dataErrors(data) {
    let errors = [];

    if (!data.first || typeof data.first !== "string") {
        errors.push("Invalid first name");
    }
    if (!data.last || typeof data.last !== "string") {
        errors.push("Invalid last name");
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push("Invalid email address");
    }
    if (typeof data.public !== "boolean") {
        errors.push("Invalid public value");
    }
    if (!data.handles || typeof data.handles !== "string") {
        errors.push("Invalid handles");
    }
	return errors;
}

function sentRecently() {
	return SUBMISSION_INTERVAL > Date.now() - lastSubmissionTime;
}

function toFormData(data) {
	const _data = new URLSearchParams();
	_data.append("1000066", "");
	_data.append("1000066_col_024", "1000066_val_024");
	_data.append("1000066_col_1", data.first);
	_data.append("1000066_col_2", data.last);
	_data.append("1000066_col_3", data.email);
	_data.append("1000066_attr_1739953922200", data.public ? "Ja" : "");
	_data.append("1000066_attr_1739953011633", data.handles);
	_data.append("079_col_023", "");
	return _data;
}

function submitForm(data) {
	return fetch(FORM_URL, {
			method: "POST",
			mode: "no-cors",
			headers: {
				"Content-Type":
					"application/x-www-form-urlencoded",
			},
			body: toFormData(data),
		});
}

function successMessage(data) {
	return `Welcome aboard ${data.first}!

A member of the board will contact you soon.

If you don't hear from us, reach out at 📧 contact@codersonly.org.
(Something might have gone wrong with our association management system.)

Coders Only ❤️ u`;
}

window.register = function (data) {

	data.handles = data.handles || 'no handles';

	const errors = dataErrors(data);
	if (errors.length > 0) {
		console.log("Data validation failed:", errors);
		return false;
	}
	if (sentRecently()) {
		console.log(
			"Please don't spam... you've sent a request less than 30 seconds ago."
		);
		return false;
	}
	submitForm(data).then((response) => {
		lastSubmissionTime = Date.now();
		console.log(successMessage(data));
	}).catch(() => {
		console.log(FAILED);
	});
};
