var nums = [3,2,4], target = 6





for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
        if (nums[0] + nums[j] === target && i !== j) {
            return console.log([i, j])
        }
    }
}