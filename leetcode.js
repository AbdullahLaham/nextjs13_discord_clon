
// var nums = [3,2,4], target = 6





// for (let i = 0; i < nums.length; i++) {
//     for (let j = 0; j < nums.length; j++) {
//         if (nums[0] + nums[j] === target && i !== j) {
//             return console.log([i, j])
//         }
//     }
// }






// let strs = ["flower","flow","flight"];
// let max = strs[0];
// for (let i = 0; i<strs.length; i++) {
//     if (strs[i].length > max?.length) max = strs[i]
// }

// let sames = [];

// for (let j=0; j < max?.length; j++) {
//     let count = 0;
//     for (let i=0; i < strs.length - 1; i++) {
//         if (strs[i][j] == strs[i+1][j]) count++;
//     }
//     if (count == strs.length - 1) sames.push(max[j]);
//     else break;

// }
// console.log(sames.join(""))


// let list1 = [1,2,4], list2 = [1,3,4]
// if (list1.length == 0) return list2
// if (list2.length == 0) return list1
// let max = list1?.length > list2?.length ? list1 : list2;
//     let arr = []
//     for (let j=0; j < max?.length; j++) {
//         arr.push(list1[j])
//         arr.push(list2[j])
//     }
//     return console.log(arr);






// let nums = [0,0,1,1,1,2,2,3,3,4];
// let arr = [];

//     for (let i = 0; i < nums.length; i++) {
//         if (!arr.includes(nums[i])) arr.push(nums[i])
//     }

//     for (let i = 0; i < nums.length; i++) {
//         nums.shift();
//     }

//     // for (let i = 0; i < arr.length; i++) {
//     //     nums.push(arr[i]);
//     // }
//     return console.log(nums);




    // digits = [6,1,4,5,3,9,0,1,9,5,1,8,6,7,0,5,5,4,3]

    // let num = digits.join("");

    // console.log(num);

    // num = BigInt(num)  + BigInt(1);

    // return console.log(`${num}`.split(""));
    




    let nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
    let max = nums1?.length > nums2.length ? nums1?.length : nums2?.length;
    let arr =[];
    for (i = 0; i < max; i++) {
        if (nums1[i]) arr.push(nums1[i]);
        if (nums2[i]) arr.push(nums2[i]);
    }
    return console.log([...nums1, ...nums2].filter((item) => item !== 0).sort((a,b) => a - b)) ;
    