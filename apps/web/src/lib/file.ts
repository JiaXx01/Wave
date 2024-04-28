export function selectFileFromLocal(options?: {
  accept?: string
  maxSize?: number
}): Promise<File | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    if (options?.accept) {
      input.accept = options.accept
    }
    input.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      input.remove()
      if (!file) return resolve(null)
      if (options?.maxSize && file.size > options.maxSize)
        return reject('文件过大')
      resolve(file)
    })
    input.click()
  })
}
