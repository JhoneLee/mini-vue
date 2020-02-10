/*
  手写符合规范的promise
 */

 /*
    1.promise 的大致结构 是接收一个异步函数fn作为参数，这个函数有resolve、reject两个参数，表示成功还是失败
    2.promise 内部参数state来表示当前状态：pending（等待） fulfilled （实现） rejected(失败的)
    3.promise 分别创建变量 this.value  this.reason 保存成功值和失败值
    4.promise 内部有两个函数 this.resolve  this.reject 负责实现传入函数的resolve\reject参数，
      并将state状态有pending改为fulfilled 或rejected
    5.promise 的then 为了能够链式调用每次调用都需要返回一个 new Promise
    6.promise then有两个可选参数onFulfilled 和 onRejected ，promise规范对于传入内容没有规定，不是函数忽略就好
    7.promise 之所以能够处理异步，是因为then会将onFulfilled和 onRejected函数在state pending态时存入两个数组，
      一旦this.resolve  this.reject被执行，就会改变状态，并执行数组中的函数
    8.最后返回fn(this.resolve,this.reject)


  */

// thenable 检测，如果传入的参数是undefined 或者 没有then方法 返回false
let isThenable = x => !!(x!==undefined && x.then);
// 如果传入的arg是一个promise对象，那就继续执行该对象的then函数
let runThenable = (func, arg) => isThenable(arg) ? arg.then(func) : func(arg);

class MyPromise{
  constructor(executor){
    // 存放成功函数的数组
    this.successQue = [];
    // 存放失败函数的数组
    this.failQue = [];
    this.value = undefined;
    this.reason = undefined;
    // 判断当前promise传入的executor是否执行完毕
    this.done = false;

    this.resolve = value => {
      // 所有回调函数的队列只能执行一次，防止在executor中写多个resolve，导致回调函数队列多次执行
      if(this.done) return;
      this.value = value;
      this.done = true;
      
      // setImmediate(() => {
      //   this.succ_que.forEach(cb => cb(result));
      // });

      //加入延时机制 防止promise里面有同步函数 导致resolve先执行 then还没注册上函数
      setTimeout(()=>{
          this.successQue.forEach(cb=>cb(value));
      },0)
    };

    this.reject = reason => {
      // 所有回调函数的队列只能执行一次，防止在executor中写多个reject，导致回调函数队列多次执行
      if(this.done) return;
      this.reason = reason;
      this.done = true;
      // setImmediate(() => {
      //   this.fail_que.forEach(cb => cb(error));
      // });
      //加入延时机制 防止promise里面有同步函数 导致resolve先执行 then还没注册上函数
      setTimeout(()=>{
          this.failQue.forEach(cb=>cb(reason));
      },0)
    };
    // then函数

    this.then = (onFulfilled, onRejected) => new MyPromise((nextFulfilled, nextReject) => {
      let handleResolve = value => {
        try{
          // 如果上一次的onFullFilled是一个newPromise，则将nextResolve当做then的onFulFilled，供这个newPromise使用
          // 如果onFulFilled是个函数，就将函数的执行结果传递给nextResolve
          // 如果onFulFilled为空，需要将结果传递给nextResolve，本次的then什么都不做
          // 即使onFulFilled不是函数且不是promise，会在执行时报错而被catch到，执行下次的nextReject
          runThenable(nextFulfilled, onFulfilled ? onFulfilled(value) : value);
        } catch (e) {
          nextReject(e)
        }
      };
      let handleReject = reason => {
        try{
          // 需要判断onReject是否为函数或者undefined
          if(onRejected){
            // 根据promise规范，本次执行onRejected的结果，需要传递给下一次的nextResolve，而不是nextReject
            runThenable(nextFulfilled, onRejected(reason));
          } else {
            nextReject(reason);
          }
        }catch (e) {
          nextReject(e)
        }
      };

      if(this.done){
        console.log(this.reason,this.value)
        // 先检测失败项，在Promise.All的时候可能 value 和 reason都有值，所以需要先检测reason，先执行reject
        this.reason === undefined ? handleResolve(this.value):handleReject(this.reason)
      }else{
        this.successQue.push(handleResolve);
        this.failQue.push(handleReject);
      }
    });

    this.catch = onRejected => this.then(null, onRejected);

    try{
      executor(this.resolve, this.reject);
    }catch (e) {
      this.reject(e);
    }
  }
}
// Promise.resolve 就是直接执行 promise的onFulfilled
MyPromise.resolve = x => new MyPromise(r => r(x));

MyPromise.reject = x => new MyPromise((r,f)=>f(x));

// promise race  只返回执行最快的结果，不管这个结果是resolve还是reject

MyPromise.race = (...promises)=> {
    var flag = false;
    return new MyPromise((onFulfilled,onRejected)=>{
        promises.forEach(p=>p.then(value=>{
            onFulfilled(value);
        },error=>{
            onRejected(error);
        }))
    });
}

// 只返回第一个成功的promise后就结束，如果都不成功，返回一个error
MyPromise.Any = (...promises) => {
  let done = false;
  let count = promises.length;
  return new MyPromise((onFulfilled,onRejected) => {
    promises.forEach(p => p.then(
        value =>{
            // 确保第一个resolve被执行
            if(!done){
                done = true;
                onFulfilled(value);
            }
            count--;
        }, error=>{
            console.log('遍历计数：',count);
            count--;
            if(count==0){
                onRejected(error);
            }
        })
    );
  })
};


// promise.all 规则，一堆promise都执行成功时，返回一个数组存储成功结果，
// 如果其中有一个或多个失败，仅返回第一个失败值，而不是失败数组


// 实现原理，先再函数中定义储存各个promise执行结果的数组values，然后得到promise数组的长度
// 实际上就是新建一个newPromise，在这个newPromise 的onfulFilled中遍历执行promise数组元素的then，直到计数count为0
MyPromise.All = (...promises)=>{
  let count = promises.length;
  let values = [];

  return new MyPromise((onFulfilled, onRejected) => {
    // 遍历执行promise
    promises.forEach((p, i) =>{
      p.then(v => {
        // 存储执行结果
        values[i] = v;
        count --;
        // 当遍历完毕时，调用onFulfilled函数对结果集合操作
        if(count === 0) onFulfilled(values);
        // 当首次出现错误时，直接掉onRejected，结束循环
      }, onRejected);
    });
  });
};

// test:
MyPromise.resolve(1)
  .then(v=> v+1)
  .catch(e => console.log(`won't happen error: ${e}`))
  .then(v => {console.log(`continued: ${v}`); throw new Error("throw");})
  .then(v => {console.log("won't happen then");})
  .catch(e => {console.log(`catched: ${e}`); return 100;})
  .then(v => {console.log(`continue after catch: ${v}`); return v;})
  .then(v => new MyPromise(r=> setTimeout(() => r(v+500), 3000)))
  .then(v => console.log(`last: ${v}`))
;
console.log("===========");