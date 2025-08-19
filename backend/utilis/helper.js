import bcrypt from "bcryptjs";

// hash password

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

// validation input feilds
const validateRegisterInput = ({ email, username, password }) => {
  if (!username || !email || !password) {
    return "All fields are required";
  }

  if (username.length < 3) {
    return "Username should be at least 3 characters long";
  }

  if (password.length < 6) {
    return "Password should be at least 6 characters long";
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
  if (!passwordRegex.test(password)) {
    return "Password must contain at least one uppercase letter and one special character";
  }

  return null; // no error
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export { hashPassword, validateRegisterInput, verifyPassword };
