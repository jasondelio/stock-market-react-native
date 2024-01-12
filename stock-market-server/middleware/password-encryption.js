const bcrypt = require ('bcrypt');

//Function for hashing password using bcrypt
const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

//Function for comparing the hash password with the inputted plain password
const comparePassword = async(inputPassword, hashedPassword ) => {
    const isSame = await bcrypt.compare(inputPassword, hashedPassword); 
    return isSame;
}

module.exports = { hashPassword, comparePassword };