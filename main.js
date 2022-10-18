const graph = require("./graph.js")
const textInput = "hello World"


const encoding = graph.encode(textInput)

console.log(`Text "${textInput}" encoded to "${encoding}" via Huffman Coding`)

const decoding = graph.decode(encoding)
console.log(`Code "${encoding}" decoded to "${decoding}" via Huffman Coding`)