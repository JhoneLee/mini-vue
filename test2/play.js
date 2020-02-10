      /*
  N级台阶，一次只能跳3级4级或者5级，请问一种有多少种跳法
*/

// 利用动态规划
// 第i阶的时候有三种可能 i-3 i-4 i-5
// 那么dp[i] = dp[i-3]+dp[i-4]+dp[i-5]
function getN(n){
    var a = [];
    a[3] = 1,a[4]=1,a[5]=1;
    for(var i=6;i<n+1;i++){
        var s3 = a[i-3] || 0;
        var s4 = a[i-4] || 0;
        var s5 = a[i-5] || 0;
        a[i] = s3+s4+s5;
    }
    return a[n];
}


/*
 [-1,-2,8,9,-10] 求最大和
*/
// 假设这是什么条件都没有，就求数组内相加最大值
// 给数组排序，找到正数之后全部数组相加
/*=========================*/
// 如果是最大连续子数组和，那也简单
// 利用动态规划，sum = max(number[i],sum+number[i])
// sum 初始值就是 number[0]

function getMaxSum(nums){
    var currSum = nums[0];
    var maxSums = [nums[0]];
    for(var i=1;i<nums.length;i++){
        currSum = Math.max(nums[i],currSum+nums[i]);
        maxSums.push(currSum);
    }
    maxSums.sort((a,b)=>b-a);
    return maxSums[0];
}


// 算法题，给一个字符串，给出该字符串字符的所有排列组合方式
// 这种只是算出了不同字符字符串的组合
// 如包含相同内容如何求解？直接去重
function comStr(s) {
    if(s.length<=1) return [s];
    var result = [];
    for(var i=0;i<s.length;i++){
        var ns = s[i];
        var substr = s.slice(0,i)+s.slice(i+1,s.length);
        var newResult = comStr(substr);
        for(var j=0;j<newResult.length;j++){
            result.push(ns+newResult[j]);
        }
    }
    var set = new Set(result);
    result = Array.from(set);
    return result;
};


// 写版本号排序的代码（及优化），时间复杂度
// 请写出多种方法并优化
function sortVersion(versions){
    let arr = [];
    for(var i=0;i<versions.length;i++){
        arr.push(versions[i].split('.'));
    }
    function quickSort(arr){
        if(arr.length<=1) return arr;
        var left = [];
        var right = [];
        var mid = arr.splice(Math.floor(arr.length/2),1);
        for(var i=0;i<arr.length;i++){
            if(compareVersion(arr[i],mid[0])){
                right.push(arr[i]);
            } else {
                left.push(arr[i]);
            }
        }
        return quickSort(left).concat(mid,quickSort(right));
    }
  
    function compareVersion(v1,v2){
        // v1 = v1.split('.');
        // v2 = v2.split('.');
        var len = Math.max(v1.length,v2.length);
        for(var i=0;i<len;i++){
            if(!v2[i] && v1[i]){
                return true;
            }else if(+v1[i]>+v2[i]){
                return true;
            } else if(v1[i] === v2[i]){
                continue;
            } else {
                return false;
            }
        }
        return false;
    }

    var nv = quickSort(arr);
    nv = nv.map(e=>e.join('.'));
    return nv;
}


// 在不修改Array的push方法的前提下，[].push(1,2)能够console.log出1，2

// 使用Object.defineProperty定义value即可

var ArrayPrototype = Array.prototype;
var copyArrayProto = Object.create(Array.prototype);
var fn = copyArrayProto.push;
Object.defineProperty(ArrayPrototype,'push',{
    value(){
        console.log(arguments);
        return fn.apply(this,Array.from(arguments))
    }
})

[].push(1,2)


//动态规划求解硬币找零问题：求解给定金额最少硬币数

// 输入： 硬币数组  金额数 

// 先给所有选择设置最大硬币数 假设存在1元硬币，然后再+1
// 为何每次要在上一次结果上+1 是因为dp[i] = dp[i-coin](上一次集合) + coin（搭配本次硬币面额 也就是1种）
var coinChange = function(coins, amount) {
    var dp = [0];
    for(var i=1;i<amount+1;i++){
        dp[i] = amount+1;
        for(var j=0;j<coins.length;j++){
            if(coins[j]<=i){
                // 遍历硬币数组，分别计算 不同面额硬币下 组合有多少种
               dp[i] = Math.min(dp[i-coins[j]]+1,dp[i]);
            }
        }
    }
    console.log(dp)
    return dp[amount]>amount?-1:dp[amount];
};

// 一个数组求两数相加和等于m总共有多少种可能性

function twoSum(arr,m){
    if(arr.length<=1) return [];
    var table = {};
    var result = [];
    // 此解法是取到这两个和的值
    for(var i=0;i<arr.length;i++){
        var sub = m-arr[i];
        if(table[arr[i]]!==undefined){
            result.push([sub,arr[i]]);
        } else {
            table[sub] = sub;
        }
    }
    return result;
}


function twoSum(arr,m){
    if(arr.length<=1) return [];
    var table = {};
    var result = [];
    // 此解法是取到这两个值的下标
    for(var i=0;i<arr.length;i++){
        var sub = m-arr[i];
        if(table[arr[i]]!==undefined){
            result.push([table[arr[i]],i]);
        } else {
            table[sub] = i;
        }
    }
    return result;
}

// 给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

function hasPathSum(root,sum){
    if(root == null) return false;
    sum -= root.val;
    if(root.right===null && root.left===null){
        return sum===0;
    }
    return hasPathSum(root.left,sum) || hasPathSum(root.right,sum);
}


function curry(fn){
    var args = Array.from(arguments)[1] || [];
    if(args.length == fn.length){
        return fn.apply(window,args);
    } else {
        return function (){
            args = args.concat(Array.from(arguments));
            return curry(fn,args);
        }
    }
}