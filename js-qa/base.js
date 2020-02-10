// 数组扁平化

// 循环push，遇到数据就递归，传入deep当参数控制扁平层级
var arr = [1,[2,3,[4,[5]]],6];

Array.prototype.flat = function(deep){
    var result = [];
    deep = deep===undefined?1:deep;
    this.forEach(e=>{
        if(Array.isArray(e)){
            deep>0?result = result.concat(e.flat(--deep)):result.push(e);
        } else {
            result.push(e);
        }
    })
    return result;
}