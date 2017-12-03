/**
 * 使用循环链表实现解决约瑟夫环问题
 * */

//根据参数初始化链表
//n,总人数，初始化为[1,2,3,...,n]
//k,开始报数位置，链表的head
//m,数到m的出列
// function init(m,n,k){
//     ele_array = initElements(n);
//     head = circleList(ele_array,k);
//     return {
//         eles:ele_array,
//         circleList:head
//     } 
// }


function initElements(n) {
    var ele_array = [];
    for (var i = 0; i < n; i++) {
        ele_array.push(i + 1)
    }
    return ele_array;
}

// 链表节点
function Node(element) {
    this.element = element;
    this.next = null;
}

//初始化链表，参数ele_array,k
//返回head位置
function circleList(ele_array, k) {
    index = ele_array.indexOf(k);
    if (index == -1) {
        return false;
    }
    var head = new Node(ele_array[index]);
    var p = head;
    for (var i = index + 1; i < ele_array.length; i++) {
        var temp = new Node(ele_array[i]);
        p.next = temp;
        p = temp;
    }
    for (var i = 0; i < index; i++) {
        var temp = new Node(ele_array[i]);
        p.next = temp;
        p = temp;
    }
    p.next = head;
    return head;
}

function Josephus(circleList, m, n, k, speed) {
    this.head = circleList;
    this.m = m;
    this.n = n;
    this.k = k;
    this.speed = speed;
    this.kill_arr = [];
    this.kill_ele = '';
    // this.getOneKilled = function() {
    //     var current = this.head;
    //     if (current.next.element != current.element) {
    //         for (var i = 1; i < m; i++) {
    //             var temp = current;
    //             current = current.next;
    //         }
    //         this.kill_ele = current.element;
    //         this.kill_arr.push(this.kill_ele);
    //         temp.next = current.next;
    //         current = temp.next;
    //         this.head = current;
    //     } else {
    //         kill_ele = current.element;
    //         current = null;
    //         this.head = current;
    //         this.kill_ele = current.element;
    //         this.kill_arr.push(this.kill_ele);
    //     }  
};

// 一次出列
// 参数head(循环链表的返回值),m(数到m的出列)
// 返回值，curr_ele，head,m
function getOneKilled(josephus) {
    var current = josephus.head;
    if (current.next.element != current.element) {
        for (var i = 1; i < josephus.m; i++) {
            var temp = current;
            current = current.next;
        }
        josephus.kill_ele = current.element;
        josephus.kill_arr.push(current.element);
        temp.next = current.next;
        current = temp.next;
        josephus.head = current;
    } else {
        josephus.kill_ele = current.element;
        josephus.kill_arr.push(current.element);
        current = null;
        josephus.head = current;
    }
    return josephus;
}


function getAllKilled(circleList, m) {
    var current = circleList;
    var kill_arr = [];
    while (current.next.element != current.element) {
        for (var i = 1; i < m; i++) {
            var temp = current;
            current = current.next;
        }
        //删除节点的本质即改变其前一个元素的后继
        kill_arr.push(current.element)
        temp.next = current.next;
        current = temp.next;
    }
    kill_arr.push(current.element)

    //返回自杀次序
    return kill_arr;
}