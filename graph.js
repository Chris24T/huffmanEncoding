
/*
* @param {(int|node)} l - left node
* @param {(int|node)} r - right node
*/
function node(l ,r) {
    
    this.left = l || null;
    this.right = r || null;
    this.value = ((this.left?.[1] || this.left?.value) + (this.right?.[1] || this.right?.value)) || 0
    
    function getLeft() {return this.right}

    function setLeft() {}

    function getRight() {return this.left}

    function setRight() {}

    function getValue() {}

    function setValue({letter, frequency}) {
        this.value.letter = letter
        this.value.frequency = frequency
    }
}

function graph() {
    
    this.text = ""
    this.encoding = ""
    const that = this    
    const RLencoding = {left:"0", right:"1"}
    
    graph.prototype.encode = function(toEncodeStr) {
        const {encoderMap:encoder, encoderTree} = buildEncoder(toEncodeStr)  
        this.root = encoderTree
        this.encoder = encoder

        let code = ""
        for (char of toEncodeStr) {
            code += encoder[char]
        }
        return code
    }

    graph.prototype.decode = function(toDecodeStr) {
        let text = "";
        generateTextFromCode(this.root, "decode", ({code, node:[letter]}) => {text+=letter;}, toDecodeStr)
        return text
    }

    function buildEncoder(str) {
        const frequencyMap = Object.entries(str.split("").reduce((prev, cur, index)=> {            
            prev[cur] = (prev[cur] + 1) || 1
            return prev
        }, {})).sort((a, b) => a[1] - b[1]) 

        encoderTree = treeify(frequencyMap)[0] // 0 index as the "root" node is an object, inside an array
        
        let encoderMap = {}
        generateCodeFromText(encoderTree, "encode", ({code, node:[letter]}) => {encoderMap[letter] = code})
        return {encoderMap, encoderTree}
        
    }

    function generateTextFromCode(node, mode, cb, code="") {
        
        if(!node.left && !node.right) {
            cb({code, node})
            if(mode === "decode") {
                generateTextFromCode(that.root, mode, cb, code)
            }

            return
        }
            
            let pathDir = code[0]            
            if(!pathDir) return //finished decode             
            code = code.substring(1)                       
            pathDir === RLencoding.left ? generateTextFromCode(node.left, mode, cb, code) : generateTextFromCode(node.right, mode, cb, code)
    }

    function generateCodeFromText(node, mode, cb, code="") {
        
        
        // at leaf
        if(!node.left && !node.right) {
            cb({code, node})
            
            // if in decode mode, must start from root again            
                              
            return
        }

        if (mode === "encode") {
            //preorder tree traversal
            code += RLencoding.left            
            generateCodeFromText(node.left, mode, cb, code)
            code = code.slice(0, code.length - 1)
            code += RLencoding.right
            generateCodeFromText(node.right, mode, cb, code)
        }
    }

    // graph.prototype.encode = function(str) {
    //     const frequencyMap = str.split("").reduce((prev, cur, index)=> {            
    //         prev[cur] = (prev[cur] + 1) || 1
    //         return prev
    //     }, {})
    
    //     const sortedArray = Object.entries(frequencyMap).sort((a, b) => a[1] - b[1])        

    //     this.root = treeify(sortedArray)[0]

    //     //traverse completed tree, compute map :
    //     let encoder = {}
        
    //     //traverse tree, build map
    //     this.encodeDecode(this.root, "encode", ({code, node:[letter]}) => {encoder[letter] = code})

    //     //encode(encoder, str)
        
    //     return {code:encoding, tree:this.root}
          
    // }

    // graph.prototype.decode = function ({code, tree:rootNode}) {
    //     let text = ""
    //     this.encodeDecode(rootNode, "decode", ({node:[letter, frequency]}) => {text+=letter;}, code) // v cool destructuring javascript
    //     return text


    // }

    function treeify(arr) {

        if(arr.length === 1) return arr

        arr.push(new node(arr[0], arr?.[1]))
        arr.splice(0, 2) // can ignore odd case as delete will extend to out of bounds
        arr.sort((a, b) => (a.value || a ) - (b.value || b))

        return treeify(arr)
    }

    graph.prototype._encode = function(node, mode, cb, code="") {
        if(!node.left && !node.right) {
            cb({code, node})
            _encode(this.root, mode, cb, code)
                             
            return
        }
    }


    // preorder traversal
    graph.prototype.encodeDecode = function(node, mode, cb, code="") {
            
        

        // at leaf
        if(!node.left && !node.right) {
            cb({code, node})
            console.log(node[0])
            // if in decode mode, must start from root again            
            if(mode === "decode") {
                this.encodeDecode(this.root, mode, cb, code)      
            }                     
            return
        }
        
        if(mode === "decode") {
            let path = code[0]
            if(!path) return 
            console.log(code)
            console.log(path)
            code = code.substring(1)  
            console.log(code)
            console.log("\n")          
            path === RLencoding.left ? this.encodeDecode(node.left, mode, cb, code) : this.encodeDecode(node.right, mode, cb, code)

        } else if (mode === "encode") {
            //preorder tree traversal
            code += RLencoding.left            
            this.encodeDecode(node.left, mode, cb, code)
            code = code.slice(0, code.length - 1)
            code += RLencoding.right
            this.encodeDecode(node.right, mode, cb, code)

        }

        
    }

}

module.exports = new graph()

// based on 