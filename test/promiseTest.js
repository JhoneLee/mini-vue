
function isThenable(arg){
    return !!(arg && arg.then)
}

function runThenable(func,arg){
    if(!isThenable(arg)){
        return func(arg);
    } else {
        return arg.then(func);
    }
}

class MyPromise {
    constructor(executor){
        this.value = undefined;
        this.reason = undefined;
        this.done = false;
        this.successQue = [];
        this.failQue = [];
        try{
            return executor(this.resolve.bind(this),this.reject.bind(this));
        } catch(e){
            this.reject(e);
        }
    }
    resolve(val){
        if(this.done) return;
        this.done = true;
        this.value = val;
        setTimeout(()=>{
            this.successQue.forEach(cb=>cb(val));
        },0)
    }
    reject(reason){
        if(this.done) return;
        this.done = true;
        this.reason = reason;
        setTimeout(()=>{
            this.failQue.forEach(cb=>cb(reason));
        },0);
    }
    catch(onRejected){
        return this.then(null,onRejected);
    }
    then(onFulfilled,onRejected){
        return new MyPromise((nextFulfilled,nextRejected)=>{
            const handleFulfilled = (value)=>{
                try{
                    return runThenable(nextFulfilled,onFulfilled?onFulfilled(value):value);
                } catch(e){
                    nextRejected(e);
                }
            };

            const handleRejected = (reason)=>{
                try{
                    if(onRejected){
                        return runThenable(nextFulfilled,onRejected(reason))
                    } else {
                        return nextRejected(reason);
                    }
                } catch(e){
                    nextRejected(e);
                }
            }

            if(this.done){
                this.reason !== undefined?handleRejected(this.reason):handleFulfilled(this.value);
            } else {
                this.successQue.push(handleFulfilled);
                this.failQue.push(handleRejected);
            }
        });
    }

}

MyPromise.resolve = x => new MyPromise(r=>r(x));

MyPromise.reject = x=> new MyPromise((r,j)=>j(x));

MyPromise.All = promises => new MyPromise((onFulfilled,onRejected)=>{
    let count = promises.length;
    let results = [];
    promises.forEach((p,i)=>{
        return p.then((value)=>{
            results.push(value);
            count--;
            if(count==0){
                onFulfilled(results);
            }
        },(error)=>{
            onRejected(error);
        })
    });
})

MyPromise.Any = promises => new MyPromise((onFulfilled,onRejected)=>{
    let count = promises.length;
    promises.forEach((p,i)=>p.then(value=>{
        onFulfilled(value);
    },error=>{
        count--;
        if(count==0){
            onRejected(error);
        }
    }));
});

MyPromise.race = promises => new MyPromise((onFulfilled,onRejected)=>{
    promises.forEach(p=>p.then(value=>onRejected(value),error=>onRejected(error)))
});
