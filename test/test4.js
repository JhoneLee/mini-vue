/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-08 09:58:19
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-08 09:58:19
*/


function ab(r,f){
   setTimeout(()=>{
     var flag = Math.random()>0.5;
     console.log('ab 执行',flag)
     if(flag){
        r(true)
     } else {
        f(false)
     }
   },100)
}

var p = new MyPromise(ab)

p.
then((res)=>{console.log('success',res);return res;},(rej)=>{console.log('fail',rej);return rej})


var arr = [new Promise(function(resolve, reject) {
    setTimeout(()=>{
       console.log('p3 执行');
       resolve('foo3')
    },3000)
}),new Promise(function(resolve, reject) {
    setTimeout(()=>{
       console.log('p6 执行');
       reject('foo6')
    },2000)
}),new Promise(function(resolve, reject) {
    setTimeout(()=>{
       console.log('p7 执行');
       resolve('foo7')
    },30)
})]


