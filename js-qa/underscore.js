// 请求防抖-- 返回一个函数，这个返回函数按照延时执行指定输入的函数fn，
// 如果频繁调用这个返回函数，则永不执行fn
// 直到这个函数不被调用为止

function debounce(fn,delay,opt){
    var timer = null;
    var immediate = opt.immediate; // 是否立即执行
    return function(){
        var context = opt.context || this;
        var args = Array.prototype.slice.call(arguments,1);
        if(immediate){
            immediate = false;
            return fn.apply(context,args);
        }
        clearTimeout(timer);
        timer = setTimeout(()=>{
            return fn.apply(context,args);
        },delay);
    }
}