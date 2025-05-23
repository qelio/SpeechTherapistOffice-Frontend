export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validateFullName(fullName) {
    return /^[А-Яа-яЁёA-Za-z\s-]+$/.test(fullName) && fullName.trim().split(" ").length >= 2;
}

export function validateBirthDate(dateStr) {
    const birthDate = new Date(dateStr);
    const today = new Date();
    return birthDate <= today;
}

export function validatePassword(password) {
    const hasUpper = /[A-ZА-ЯЁ]/.test(password);
    const hasLower = /[a-zа-яё]/.test(password);
    const hasDigit = /\d/.test(password);
    const noSpaces = /^\S+$/.test(password);
    const allowedChars = /^[A-Za-zА-Яа-яЁё0-9~!?@#$%^&*_\-+\[\](){}<>\/\\|"'.,:;]+$/.test(password);
    const validLength = password.length >= 8 && password.length <= 128;

    return hasUpper && hasLower && hasDigit && noSpaces && allowedChars && validLength;
}

export function passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}

export function validatePhoneNumber(phone) {
    const cleaned = phone.replace(/[\s\-().]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(cleaned);
}
