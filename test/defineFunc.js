/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-07 20:45:43
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-07 20:46:11
*/

// 自定义call
Function.prototype.myCall = function(context){
    context = context || window;
    context.fn = this;
    var args = [];
    for(var i = 1;i< arguments.length;i++){
        args.push("arguments["+i+"]");
    }
    // var res = new Function("context","context.fn("+args.join(',')+")");
    var res = eval("context.fn("+args.join(',')+")");
    delete context.fn;
    return res;
}
// 自定义apply
Function.prototype.myApply = function(context,arr){
    context = context || window;
    context.fn = this;
    var params = [];
    for(var i=0;i<arr.length;i++){
        params.push("arr["+i+"]");
    }
    var res = eval("context.fn("+params.join(',')+")");
    delete context.fn;
    return res;
}
// 自定义bind
Function.prototype.myBind = function(context){
    context = context || window;
    var _this = this;
    var args = Array.prototype.slice.call(arguments,1);
    console.log(args,Object.prototype.toString.call(args));
    return function(){
        _this.apply(context,args);
    }
}