
let isThenable = x => !!(x!==undefined && x.then);
// 如果传入的arg是一个promise对象，那就继续执行该对象的then函数
let runThenable = (func, arg) => isThenable(arg) ? arg.then(func) : func(arg);

class MyPromise {
    constructor(fn) {
       this.value = undefined;
       this.reason = undefined;
       this.done = false;
       this.successQue = [];
       this.failQue = [];
       try{
            return fn(this.resolve.bind(this),this.reject.bind(this))
       } catch(e){
            this.reject(e);
       }
    }
    resolve(value){
        if(this.done) return;
        this.value = value;
        this.done = true;
        setTimeout(()=>{
            this.successQue.forEach(cb=>cb(this.value))
        },0)
    }
    reject(reason){
        if(this.done) return;
        this.reason = reason;
        this.done = true;
        setTimeout(()=>{
            this.failQue.forEach(cb=>cb(this.reason));
        },0)
    }
    then(onFulfilled,onRejected){
        return new MyPromise((nextFulfilled,nextRejected)=>{
            const handleFulfilled = value =>{
                try{
                    runThenable(nextFulfilled,onFulfilled?onFulfilled(value):value);
                } catch(e){
                    nextRejected(e);
                }
            }
            const handleRejected = reason =>{
                try{
                    if(onRejected){
                        runThenable(nextFulfilled,onRejected(reason));
                    } else {
                        nextRejected(reason);
                    }
                } catch(e){
                    nextRejected(e);
                }
            }
            if(this.done){
                this.reason ===undefined ? handleFulfilled(this.value) : handleRejected(this.reason);
            } else {
                this.successQue.push(handleFulfilled);
                this.failQue.push(handleRejected);
            }
        });
    }
    catch(onRejected){
        return this.then(null,onRejected);
    }
    finially(cb){
        return this.then(value=>{
            MyPromise.resolve(cb()).then(()=>value);
        },reason=>{
            MyPromise.resolve(cb()).then(()=>{throw reason});
        });
    }
}

MyPromise.resolve = value => new MyPromise(r=>r(value));

MyPromise.reject = reason => new MyPromise((r,e)=>e(reason));

MyPromise.All = promises => new MyPromise((resolve,reject)=>{
    let count = promises.length;
    let values = [];
    promises.forEach(p=>p.then(value=>{
        count--;
        values.push(value);
        if(count === 0) {
            resolve(values);
        }
    },error=>{
        reject(error);
    }));
});


MyPromise.Any = promises => new MyPromise((resolve,reject)=>{
    let done = false;
    let count = promises.length;
    promises.forEach(p=>p.then(value=>{
        if(!done){
            resolve(value);
            done = true;
        }
    },error=>{
        count--;
        if(count === 0){
            reject(error)
        }
    }));
});

MyPromise.allSettled = promises => new Promise((resolve,reject)=>{
    let count = promises.length;
    let result = [];
    promises.forEach(p=>p.then(value=>{
        count--;
        result.push({status:'fulfilled',value});
        if(count===0){
            resolve(result);
        }
    },reason=>{
        count--;
        result.push({status:'rejected',reason});
        if(count===0){
            resolve(result);
        }
    }));
})
