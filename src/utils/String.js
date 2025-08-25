export function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural
}
