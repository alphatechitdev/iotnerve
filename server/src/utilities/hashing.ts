
import argon2 from 'argon2';

const hashPassword = async (plainPassword:string) => {
    try {
        const hashedPassword = await argon2.hash(plainPassword, {
        type:argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });
    return hashedPassword;
    } catch (error) {
        console.error("Error While Hashing Password, ", error);
        throw Error;
    }
};



export const verifyPassword = (hashedPassword:string, password:string) => {
    try {
        if (! argon2.verify(hashedPassword, password)) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error("Error While Verification, ", error);
        return false;
    }
}

export default hashPassword;