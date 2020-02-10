// 头插法初始化链表

function ListNode(val){
    this.value = val;
    this.next = null;
}

function ListInitHead(array){
    var head = new ListNode(null)
    var current = head;
    for(var i = 0;i<array.length;i++){
        var node = new ListNode(array[i]);
        current.next = node;
        current = current.next;
    }
    current.next = null;
    return head.next;
}


function ListInitTail(array){
    var head = new ListNode(null);
    var current = head;
    for(var i=0;i<array.length;i++){
        var node = new ListNode(array[i]);
        node.next = current.next;
        current.next = node;
    }
    return head.next;
}

// 反转链表  头插法 1个临时变量 2个指针 4行代码

function reverseList(list){
    var prev = null; // 前一节点指针
    var curr = list; // 当前节点指针
    while(curr){
        // 临时变量保存next数据
        var temp = curr.next;
        // next值为前一节点
        curr.next = prev;
        // prev指针指向当前节点
        prev = curr;
        // 当前节点指针指向next节点
        curr = temp;
    }
    // 将变换完的结果保存在head中
    list = prev;
    return list;
}

// 原地反转 要点： 1个头  2个指针  四行代码
function reverseList(list){
    var prev = list;
    var curr = list.next;
    var dummy = {};
    dummy.next = list;
    while(curr){
        // 将前一节点next指向当前节点next
        prev.next = curr.next;
        // 当前节点next指向 头的next
        curr.next = dummy.next;
        // 将当前节点保存到 头的next
        dummy.next = curr;
        // 将当前节点指向前一节点的next
        curr = prev.next;
    }
    return dummy.next;
}
