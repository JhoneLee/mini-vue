const isThenable = x => !!(x && x.then);
const runThenable = (fn,args) => isThenable(args)? args.then(fn) : fn(args);

class MyPromise {
    constructor(executor){
        this.fulfilledQue = [];
        this.rejectedQue = [];
        this.value = undefined;
        this.reason = undefined;
        this.done = false;
        try{
            return executor(this.resolve.bind(this),this.reject.bind(this));
        } catch(e){
            this.reject(e);
        }
    }
    resolve(val){
        if(this.done) return;
        this.value = val;
        this.done = true;
        setTimeout(()=>{
            this.fulfilledQue.forEach(cb=>cb(val));
        },0)
    }
    reject(reason){
        if(this.done) return;
        this.reason = reason;
        this.done = true;
        setTimeout(()=>{
            this.rejectedQue.forEach(cb=>cb(reason));
        },0)
    }

    then(onFulFilled,onRejected){
        return new MyPromise((nextFulFilled,nextRejected)=>{
            const handleFulfilled = val => {
                try{
                    runThenable(nextFulFilled,onFulFilled?onFulFilled(val):val);
                } catch(e){
                    nextRejected(e);
                }
            }

            const handleRejected = reason => {
                try{
                    if(onRejected){
                        runThenable(nextFulFilled,onRejected(reason))
                    } else {
                        nextRejected(reason);
                    }
                }catch(e){
                    nextRejected(e);
                }
            }

            if(this.done){
                this.reason === undefined ? handleFulfilled(this.value):handleRejected(this.reason);
            } else {
                this.fulfilledQue.push(handleFulfilled);
                this.rejectedQue.push(handleRejected);
            }
        });
    }
    catch(onRejected){
        return this.then(null,onRejected);
    }
}

MyPromise.resolve = x => new MyPromise(r=>r(x));

MyPromise.reject = x => new MyPromise((r,f)=>f(x));

MyPromise.all = promises => new MyPromise((resolve,reject)=>{
    let values = [];
    let count = promises.length;
    promises.forEach(p=>p.then(value=>{
        count--;
        values.push(value);
    },reason=>{

    }))
})