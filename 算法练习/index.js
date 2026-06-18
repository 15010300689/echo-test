/**
 * 合并两个有序链表
 */

const mergeTwoLists = function(l1, l2) {
    if (!l1 && !l2) return null;
    if (l1 === null) return l2;
    if (l2 === null) return l1;

    if (l1.val <l2.val) {
        l1.next = mergeTwoLists(l1.next, l2)
        return l1;
    }

    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
}


const l1 = [1,2,4], l2 = [1,3,4];
console.log(mergeTwoLists(l1, l2))

/**
 * keep-alive
 * 缓存当前组件：
 * 
 */