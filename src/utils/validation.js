export const regex = {
  name: /^[a-zA-Z\s]{2,30}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
};

// Generic validator
export const validateForm = (formData) => {
  let errors = {};

  if ("name" in formData && !regex.name.test(formData.name)) {
    errors.name = "Enter a valid name (2-30 characters)";
  }

  if ("email" in formData && !regex.email.test(formData.email)) {
    errors.email = "Enter a valid email";
  }



  if ("password" in formData && !regex.password.test(formData.password)) {
    errors.password = "Password must be 8+ chars with letters & numbers";
  }

  if (
    "confirmPassword" in formData &&
    formData.password !== formData.confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};