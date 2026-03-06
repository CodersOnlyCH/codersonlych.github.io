console.log(`...oh! if you're checking this out, you should definitely
consider becoming a member!

Did you know there is a function for it? Try running:

register({
  first: '<your first name>',
  last: '<your last name>',
  email: '<your email address>',
  public: true, // wether you want your membership to be displayed publicly
  handles: '<your GitHub handle>, <your Discord handle>, etc.'
})
`);

let lastSubmissionTime = 0;
const SUBMISSION_INTERVAL = 30_000;
const FORM_URL = "https://submit-form.com/b5g5SVQ9U";
const FAILED =
  "Oopsies! An error occurred... maybe it's easier to send us an email? boardmembers@codersonly.org";

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

function successMessage(data) {
  return `Welcome aboard ${data.first}!

A member of the board will contact you soon.

If you don't hear from us, reach out at 📧 boardmembers@codersonly.org.
(Something might have gone wrong with our association management system.)

Coders Only ❤️ u`;
}

window.register = function (data) {
  data.handles = data.handles || "no handles";
  data.source = "javascript";

  const errors = dataErrors(data);
  if (errors.length > 0) {
    console.log("Data validation failed:", errors);
    return false;
  }
  if (sentRecently()) {
    console.log(
      "Please don't spam... you've sent a request less than 30 seconds ago.",
    );
    return false;
  }
  return fetch(FORM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      lastSubmissionTime = Date.now();
      console.log(successMessage(data));
    })
    .catch(() => {
      console.log(FAILED);
    });
};
