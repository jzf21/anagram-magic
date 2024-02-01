export default function generateRandomString() {
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const allLetters = vowels + consonants;

  const randomChars = [];
  const usedLetters = new Set();

  // Ensure at least 2 unique vowels
  for (let i = 0; i < 2; i++) {
    const randomVowel = vowels.charAt(
      Math.floor(Math.random() * vowels.length)
    );
    randomChars.push(randomVowel);
    usedLetters.add(randomVowel);
  }

  // Ensure 7 characters in total with unique letters
  while (randomChars.length < 7) {
    const randomLetter = allLetters.charAt(
      Math.floor(Math.random() * allLetters.length)
    );
    if (!usedLetters.has(randomLetter)) {
      randomChars.push(randomLetter);
      usedLetters.add(randomLetter);
    }
  }

  console.log(randomChars);

  const randomString = randomChars.join("");
  return randomString;
}
