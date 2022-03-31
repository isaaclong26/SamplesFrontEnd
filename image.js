function convertToValidFilename(string) {
    return (string.replace(/[\/|\\:*?"<>']/g, ""));
  }

  let word = process.argv[2]

  console.log(convertToValidFilename(word))