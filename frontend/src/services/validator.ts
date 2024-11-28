
export const validator = () => {
    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const compareValue = (value: string, compareVal: string): boolean => {
        return value === compareVal;
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const cnhValidate = (cnh: string): boolean => {
        const regex = /^[A-Z0-9]{11}$/;
        return regex.test(cnh);
    };

    const verifyIfIsNotNull = (value: string): boolean => {
        return value.length > 3;
    };

    const validateFee = (value: string): boolean => {
        return value.length > 3 && value != '0,00';
    };

    return {
        validateEmail,
        compareValue,
        validatePassword,
        cnhValidate,
        verifyIfIsNotNull,
        validateFee
    };
}

