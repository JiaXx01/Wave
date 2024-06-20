export function useSearch() {
  const searchList = window.location.search.slice(1).split('&')
  const search = searchList.reduce(
    (pre, cur) => {
      const [key, value] = cur.split('=')
      if (!key || !value) return pre
      pre[key] = value
      return pre
    },
    {} as Record<string, string>
  )
  return search
}
