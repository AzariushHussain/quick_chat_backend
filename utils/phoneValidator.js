function isValidIndianPhoneNumber(phone) {
    const phoneRegex = /^\+91[6789]\d{9}$/;
    return phoneRegex.test(phone);
}

module.exports = { isValidIndianPhoneNumber };