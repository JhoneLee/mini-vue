//插入排序
function insertSort(nums){
    var res = [];
    for(let i=0;i<nums.length;i++){
        let temp = nums[i];
        let j = i-1;
        while(j>=0 && res[j]>temp){
            res[j+1] = res[j];
            j--;
        }
        res[j+1] = temp;
    }
    return res;
}


// 快速排序

function quickSort(nums){
    if(nums.length<1) return nums;
    let mid = nums.filter(e=>e==nums[0]);
    let left = nums.filter(e=>e<nums[0]);
    let right = nums.filter(e=>e>nums[0]);
    return quickSort(left).concat(mid,quickSort(right));
}

// 冒泡排序

function bubbleSort(nums){
    var res = nums.slice(0);
    for(let i=0;i<res.length;i++){
        for(let j=i+1;j<res.length;j++){
            if(res[i]>res[j]){
                let temp = res[i];
                res[i] = res[j];
                res[j] = temp;
            }
        }
    }
    return res;
}

// 选择排序
function selectionSort(nums){
    let res = nums.slice(0);
    for(let i=0;i<res.length;i++){
        let minIndex = i;
        for(let j=i+1;j<res.length;j++){
            if(res[j]<res[i]){
                minIndex = j;
            }
        }
        let temp = res[i];
        res[i] = res[minIndex];
        res[minIndex] = temp;
    }
    return res;
}

// 二分查找法
function search(nums,val){
    let left=0,right = nums.length-1;
    while(left<=right){
        let mid = left + Math.floor((right-left)/2);
        if(nums[mid] === val){
            return mid;
        } else if(val<nums[mid]){
            right = mid-1;
        } else {
            left = mid+1;
        }
    }
    return -1;
}