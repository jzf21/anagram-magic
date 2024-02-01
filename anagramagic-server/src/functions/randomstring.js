function generateRandomString() {
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const randomChars = [];
  const randomlength = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < randomlength; i++) {
    randomChars.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
  }
  for (let i = 0; i < 7 - randomlength; i++) {
    randomChars.push(
      consonants.charAt(Math.floor(Math.random() * consonants.length))
    );
  }
  console.log(randomChars);

  let randomString = randomChars.join("");
  console.log("hi", randomString);
  return randomString;
}

module.exports = generateRandomString;
