const { Readable } = require('stream')
const xlsx = require('xlsx')

export const streamFile = (query, fileFormat = 'xlsx', chunkSize = 1000) => {
  const results = query
  let currentIndex = 0

  return new Readable({
    read (size) {
      try {
        while (currentIndex < results.length) {
          const chunk = results.slice(currentIndex, currentIndex + chunkSize)

          switch (fileFormat) {
            case 'xlsx': {
              const workbook = xlsx.utils.book_new()
              const worksheet = xlsx.utils.json_to_sheet(chunk)
              xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

              // Create a readable stream from the workbook buffer
              const workbookBuffer = xlsx.write(workbook, { type: 'binary' })
              this.push(workbookBuffer)
              break
            }

            case 'csv': {
              const csvData = chunk.map((row) => Object.values(row).join(','))
              const csvString = csvData.join('\n')
              this.push(csvString)
              break
            }

            default:
              throw new Error(`Unsupported file format: ${fileFormat}`)
          }

          currentIndex += chunkSize

          if (chunk.length < chunkSize) {
            break
          }
        }

        if (currentIndex >= results.length) {
          this.push(null)
        }
      } catch (error) {
        console.error(error)
        this.emit('error', error)
      }
    }
  })
}
