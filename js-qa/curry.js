
/*
    实现一个函数，接收一个函数作为参数，返回一个函数，当入参数量到达函数的形参个数时，执行函数体
    cosnt fn = function(a,b,c){
 
    }
    const curried = curry(fn)
    curried(1)(2)(3) === fn(1, 2, 3)//eg

*/


function curry(fn){
    return function cc(){
        var args = Array.from(arguments);
        if(args.length === fn.length){
            return fn.apply(window,args);
        }
        return function(){
            args = args.concat(Array.from(arguments));
            return cc.apply(window,args);
        }
    }
}



function fn(a,b,c){
    return a+b+c;
}

var curried = curry(fn)
curried(1)(2)(3) === fn(1, 2, 3)


// 实现一个相加函数add 让 add(1,2,3) === add(1)(2)(3)

function add(){
    var args = Array.from(arguments);

    var fn = function(){
        args = args.concat(Array.from(arguments));
        return add.apply(window,args);
    }

    fn.toString = ()=> args.reduce((a,b)=>a+b);
    return fn;
}


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
    // 将全部参数保留金args数组
    var args = Array.from(arguments);
    var fn = function(){
        // 拼接args
        args = args.concat(Array.from(arguments));
        // 把args当成参数传给add函数执行
        return add.apply(null,args);
    }
    fn.toString = function(){
        var sum = args.reduce((a,b)=>a+b);
        console.log(sum);
    }
    // 返回fn
    return fn;
}

function add(){
    // 通过this保存args
    this.args = this.args || [];
    if(!arguments.length){
        // 在传入空参数时证明函数结束执行，计算求和
        var sum = this.args.reduce((a,b)=>a+b);
        // 将this.args置空，为了下次计算做准备
        this.args = [];
        console.log(sum);
    } else {
        var _this = this;
        // 拼接_this.args
        _this.args = _this.args.concat(Array.from(arguments));
        var fn = function(){
            return add.apply(_this,Array.from(arguments));
        }
        return fn;
    }
}