/*
    实现一个add方法，使计算结果能够满足如下预期：
    add(1)(2)(3) ()
    add(1, 2, 3)(4)()
*/

/*
  实现要点
  每次都要返回add函数
  收集arguments参数，当调用到最后无参数传入的时候
  遍历arguments数据求和

  如果无最后传空值操作，需要改写函数的toString方法求和

*/
function add(){
    if(!arguments.length) { return []; }
    var args = Array.from(arguments);
    var fn = function(params){
        return args.concat(add(params));
    }
    fn.toString = function(){
        var sum = args.reduce((a,b)=>a+b);
        console.log(sum);
    }
    return fn;
}