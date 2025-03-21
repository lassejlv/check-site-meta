export const recentSuggestionsLocal = {
  get: () => {
    try {
      const val = JSON.parse(localStorage.getItem('recents') ?? "[]")
      if (!Array.isArray(val)) {
        throw new Error('Invalid data')
      }
      return val
    } catch (error) {
      localStorage.setItem('recents', JSON.stringify([]))
      return []
    }
  },
  add: (value: string) => {
    try {
      const storedRecents = JSON.parse(localStorage.getItem('recents') ?? "[]")
      const recents = [...new Set([value, ...storedRecents])].slice(0, 20)
      localStorage.setItem('recents', JSON.stringify(recents))
    } catch (error) {
      localStorage.setItem('recents', JSON.stringify([value]))
    }
  },
  clear: () => {
    localStorage.setItem('recents', JSON.stringify([]))
    return []
  }
}