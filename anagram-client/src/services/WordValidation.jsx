async function isValidWord(word) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await response.json();
  return data.title==="No Definitions Found" ? false : true;
}

export default isValidWord;

