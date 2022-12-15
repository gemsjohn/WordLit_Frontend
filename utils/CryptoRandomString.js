const characters = 'abcdefghijklmnopqrstuvxyz';
const numberCharacters = '0123456789';
const specialCharacters = '-';


export const generateCryptoRandomString = () => {
    let result = '';
    let charLength = characters.length;
    let numLength = numberCharacters.length;
    let specCharLength = specialCharacters.length;


    for (var i = 0; i < 20; i++) {
        if (i === 4 || i === 9 || i === 14) {
            result += specialCharacters.charAt(Math.floor(Math.random() * specCharLength));
        } else {
            result += characters.toLowerCase().charAt(Math.floor(Math.random() * charLength));
            result += numberCharacters.charAt(Math.floor(Math.random() * numLength));
        }
    }
    return result;
};