// Avataaars.io
const maleOptions = {
    topType: ["ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly"],
    facialHairType: ["BeardMedium", "BeardLight", "Blank"],
    clotheType: ["BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall"],
    eyeType: ["Wink", "Happy", "Default"],
    eyebrowType: ["DefaultNatural", "Default", "RaisedExcited", "RaisedExcitedNatural"],
    mouthType: ["Smile", "Twinkle", "Default"],
    skinColor: ["Light", "Brown", "DarkBrown"],
};
const femaleOptions = {
    topType: ["LongHairBob", "LongHairBun", "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida"],
    facialHairType: ["Blank"],
    clotheType: ["BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall"],
    eyeType: ["Happy", "Wink", "Default"],
    eyebrowType: ["DefaultNatural", "Default", "RaisedExcited", "RaisedExcitedNatural"],
    mouthType: ["Smile", "Twinkle", "Default"],
    skinColor: ["Light", "Brown", "DarkBrown"],
};
export async function generateRandomAvatarSVG(gender: string) {
    if(gender.toLowerCase() !== "male" && gender.toLowerCase() !== "female") gender = "male";
    const options = gender.toLowerCase() == "male" ? maleOptions : femaleOptions;
    const topType = options.topType[Math.floor(Math.random() * options.topType.length)];
    const facialHairType = options.facialHairType[Math.floor(Math.random() * options.facialHairType.length)];
    const clotheType = options.clotheType[Math.floor(Math.random() * options.clotheType.length)];
    const eyebrowType = options.eyebrowType[Math.floor(Math.random() * options.eyebrowType.length)];
    const mouthType = options.mouthType[Math.floor(Math.random() * options.mouthType.length)];
    const skinColor = options.skinColor[Math.floor(Math.random() * options.skinColor.length)];
    const avatar = await fetch(`https://avataaars.io/?avatarStyle=Circle&topType=${topType}&facialHairType=${facialHairType}&clotheType=${clotheType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`);
    const avatarSVG = await avatar.text();
    return avatarSVG;
}