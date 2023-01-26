// 1. 支持动态扩容的数组
class FlexibleArray {
    constructor(num) {
        this.array = [];
        this.curLength = num;
    }
    getArray() {
        return this.array;
    }
    add(val) {
        if (this.array.length >= this.curLength) {
            this.curLength *= 2;
            const newArray = [];
            for (const item of this.array) {
                newArray.push(item);
            }
            this.array = newArray;
        }
        this.array.push(val);
        console.log(this.getArray(), this.curLength);
    }
}

// const a = new FlexibleArray(2);
// a.add(1);
// a.add(2);
// a.add(3);

/**
 * 2. 实现一个大小固定的有序数组，支持动态增删改操作
 */
class SortedArray {
    constructor(num) {
        this.maxLength = num;
        this.array = [];
    }
    add(val) {
        if (this.array.length >= this.maxLength) {
            console.log('too long');
            return;
        }
        if (this.array.length === 0) {
            this.array.push(val);
            return;
        }
        const curLength = this.array.length;
        let insterted = false;
        for (let i = curLength - 1; i >= 0; i--) {
            const cur = this.array[i];
            if (cur > val) {
                this.array[i+1] = cur;
            } else {
                this.array[i+1] = val;
                insterted = true;
                break;
            }
        }
        if (!insterted){
           this.array[0] = val; 
        }
        console.log(this.array);
    }
    delete(targetIndex) {
        if (targetIndex >= this.maxLength) {
            console.log('too big');
            return;
        }
        for (let i = targetIndex; i < this.array.length; i++) {
            this.array[i] = this.array[i+1];
        }
        if (targetIndex < this.array.length) {
            this.array.pop();
        }
        console.log(this.array);
    }
    change(targetIndex, val) {
        this.delete(targetIndex);
        this.add(val);
    }
}
// const a2 = new SortedArray(5);
// a2.add(4);
// a2.add(7);
// a2.add(3);
// a2.add(6);
// a2.add(1);
// a2.add(9);
// a2.delete(3);
// a2.delete(4);
// 总结：往后移动时，index 从后往前遍历；往前移动时，index 从前往后遍历

/**
 * 3.实现两个有序数组合并为一个有序数组
 * https://leetcode.cn/problems/merge-sorted-array/description/
 */
// 第一版双指针法，没看 leetcode 前
function mergeSortedArray(list1, list2) {
    const result = [];
    let index1 = 0;
    let index2 = 0;
    while(index1 < list1.length || index2 < list2.length) {
        if (index1 >= list1.length) {
            result.push(list2[index2]);
            index2++;
        } else if (index2 >= list2.length) {
            result.push(list1[index1]);
            index1++; 
        } else if (list1[index1] >= list2[index2]) {
            result.push(list2[index2]);
            index2++;
        } else {
            result.push(list1[index1]);
            index1++;
        }
    }
    console.log(result);
}
// mergeSortedArray(
//     [1,3,7,7],
//     [1,2,6,8,10]
// );

// 逆向双指针法
var merge = function(nums1, m, nums2, n) {
    let index1 = m - 1;
    let index2 = n - 1;
    let resultIndex = nums1.length - 1;
    while(index1 >= 0 && index2 >= 0) {
        if (nums1[index1] <= nums2[index2]) {
            nums1[resultIndex] = nums2[index2];
            index2 --;
            resultIndex --;
        } else {
            nums1[resultIndex] = nums1[index1];
            index1 --;
            resultIndex --;
        }
    }
    while(index2 >= 0) {
        nums1[resultIndex] = nums2[index2];
        index2 --;
        resultIndex --;
    }
};

/**
 * 4. 双数之和
 * https://leetcode.cn/problems/two-sum/solutions/
 */
// 解法1，蹩脚的双指针
var twoSum = function(nums, target) {
    const indexedNums = nums.map((num, index) => ({
        index,
        value: num
    }));
    indexedNums.sort((a, b) => a.value - b.value);
    let i = 0;
    let j = indexedNums.length - 1;
    while(i < j) {
        const firstNum = indexedNums[i].value;
        const lastNum = indexedNums[j].value;
        if (firstNum + lastNum === target) {
            return [indexedNums[i].index, indexedNums[j].index];
        }
        if (firstNum + lastNum < target) {
            i ++;
        } else {
            j --;
        }
    }
};
// 解法2，哈希表
var twoSum = function(nums, target) {
    const numIndexMap = new Map();
    for(let i = 0; i < nums.length; i++) {
        const remain = target - nums[i];
        if (numIndexMap.get(remain) !== undefined) {
            return [numIndexMap.get(remain), i];
        }
        numIndexMap.set(nums[i], i);
    }
};


/**
 * 5. 三数之和
 * https://leetcode.cn/problems/3sum/description/
 */
// 暴力解法，直接超出时间限制可还行
var threeSum = function(nums) {
    const len = nums.length;
    if (len < 3) {
        return [];
    }
    let result = [];
    for(let i = 0; i < len - 2; i ++) {
        for(let j = i + 1; j < len - 1; j ++) {
            for(let k = j + 1; k < len; k ++) {
                if (nums[i]+ nums[j] + nums[k] === 0) {
                    const cur = [nums[i], nums[j], nums[k]].sort();
                    if (!isDuplicate(result, cur)) {
                        result.push(cur);
                    }
                }
            }
        }
    }
    function isTheSame(nums1, nums2) {
        return nums1[0] === nums2[0] && nums1[1] === nums2[1]
        // let hasDiff = false;
        // let copyed = nums2.slice();
        // for(let i = 0; i < 2; i++) {
        //     if (!copyed.includes(nums1[i])) {
        //         hasDiff = true;
        //         break;
        //     }
        //     copyed.splice(copyed.indexOf(nums1[i]), 1);
        // }
        // return hasDiff;
    }
    function isDuplicate(nums1, nums2) {
        return nums1.find(item => isTheSame(item, nums2));
    }
    return result;
    // const newResult = [];
    // while(result.length) {
    //     const cur = result.shift();
    //     newResult.push(cur);
    //     for(let i = result.length - 1; i >= 0; i--) {
    //         if (!hasDiff(result[i], cur)) {
    //             result.splice(i,1);
    //         }
    //     }
    // }
    // return newResult;
};
// 排序 + 双指针
var threeSum = function(nums) {
    const sortedNums = nums.sort((a,b) => a - b);
    const uniqueSet = new Set();
    const result = [];
    for(let i = 0; i< sortedNums.length - 2; i++) {
        if (uniqueSet.has(nums[i])) {
            continue;
        }
        uniqueSet.add(nums[i]);
        let j = i+1;
        let k = nums.length - 1;
        const target = 0 - nums[i];
        while (j < k) {
            if (nums[j] + nums[k] === target) {
                result.push([nums[i], nums[j], nums[k]]);
                const lastJValue = nums[j];
                const lastKValue = nums[k];
                do {
                    j++;
                    k--;
                } while(nums[j] === lastJValue && nums[k] === lastKValue)
            } else if (nums[j] + nums[k] < target) {
                j++;
            } else {
                k--;
            }
        }
    }
    return result;
};