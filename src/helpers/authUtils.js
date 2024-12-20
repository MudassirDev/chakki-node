import argon2 from "argon2";

const validateValues = (keys, data) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!data[key]) {
            return key;
        }
    }
    return null;
};

const hashPassword = async (pass) => {
    try {
        const hash = await argon2.hash(pass);
        return hash;
    } catch (err) {
        throw new Error(err);
    }
}

export {validateValues, hashPassword}