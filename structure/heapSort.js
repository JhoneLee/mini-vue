// 堆排序

function buildMaxHeap(arr){
    let len = arr.length;
    var copy = arr.slice(0);
    // 调整当前堆为大顶堆
    // 调整起始位置在当前堆的最后一个非叶子节点的子节点
    let begin = Math.floor(len/2-1);
    // 从该中心子节点开始向堆的根方向调整
    for(let i = begin;i>=0;i--){
        // 进行堆调整
        heapify(copy,i,len);
    }
    return copy;
}


function heapify(heap,index,length){
    let left = 2*index+1; // 左节点下标
    let right = 2*index+2; // 右节点下标
    let largest = index;
    // 如果左子节点大于父节点，交换
    console.log('begin:',heap[largest],heap[left],heap[right]);
    if(left<length && heap[left]>heap[largest]){
        largest = left;
    }
    // 如果右子节点大于和左子节点比较后得到的父节点，再次交换
    if(right<length && heap[right]>heap[largest]){
        largest = right;
    }
    console.log('after:',heap[largest],heap[left],heap[right]);
    // 此判断标识 此子树最大顶置换成功
    if(largest!==index){
        // 将最大值的节点值交换到父节点位置
        swap(heap,largest,index);
        console.log('end:',heap);
        console.log('**********************')
        // 尾递归执行调整
        heapify(heap,largest,length);
    }
}


function heapSort(arr,flag){
    // 构建大顶堆
    let heap = buildMaxHeap(arr);
    let len = heap.length;
    if(!flag){
        // 默认升序
        for(let i=heap.length-1;i>0;i--){
            // 将堆顶放入数组最后
            swap(heap,0,i);
            // 继续调整剩余节点为大顶堆
            heapify(heap,0,--len);
        }
    } else {
        // 用大顶堆无法降序排序，因为你的堆顶就从来没变过，如何进行堆调整？
        for(let i=1;i<arr.length;i++){
            heapify(heap,0,len);
        }
    }
    return heap;
}


function swap(heap,index1,index2){
    let temp = heap[index1];
    heap[index1] = heap[index2];
    heap[index2] = temp;
}


// 小顶堆

function buildMinHeap(arr){
    let heap = arr.slice(0);
    let len = heap.length;
    let mid = Math.floor(len/2-1);
    for(let i=mid;i>=0;i--){
        minHeapify(heap,i,len);
    }
    return heap;
}

function minHeapify(heap,index,length){
    let minimum = index;
    let left = index*2+1;
    let right = index*2+2;
    if(left<length && heap[left]<heap[minimum]){
        minimum = left;
    }
    if(right<length && heap[right]<heap[minimum]){
        minimum = right;
    }
    if(minimum !== index){
        swap(heap,minimum,index);
        minHeapify(heap,minimum,length);
    }
}

function minHeapSort(arr){
    let heap = buildMinHeap(arr);
    let len = arr.length;
    for(i=arr.length-1;i>0;i--){
        swap(heap,0,i);
        minHeapify(heap,0,--len);
    }
    return heap;
}




