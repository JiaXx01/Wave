import SparkMd5 from 'spark-md5'

onmessage = ({ data: file }) => {
  const spark = new SparkMd5.ArrayBuffer()
  const fileReader = new FileReader()
  fileReader.onload = e => {
    spark.append(e.target?.result as ArrayBuffer)
    const hash = spark.end()
    postMessage(hash)
  }
  fileReader.readAsArrayBuffer(file)
}
