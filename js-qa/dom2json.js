

function dom2obj(node){
    const attrs = node.attributes;
    const tag = node.tagName.toLowerCase();
    let obj = {tag,children:[]};
    Array.from(attrs).forEach(e=>{
        obj[e.localName] = e.value;
    });
    Array.from(node.children).forEach(e=>{
        obj.children.push(dom2obj(e));
    });
    return obj;
}

function dom2json(node){
    var obj = dom2obj(node);
    console.log(obj);
    return JSON.stringify(obj);
}



