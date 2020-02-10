
function fn(a,b,c){
    return a+b+c;
}

function curry(fn){
    return function c(){
        var args = Array.from(arguments);
        if(args.length === fn.length){
            return fn.apply(window,args);
        } else {
            return function(){
                args = args.concat(Array.from(arguments));
                return c.apply(window,args);
            }
        }
    }
}

var c = curry(fn);

c(1,2)(3) === fn(1,2,3);
c(4)(3)(2) === fn(4,2,3);