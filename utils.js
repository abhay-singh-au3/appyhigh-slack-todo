exports.find = (arr, str) => {
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i].split(' - ')[0];
    console.log(val);
    if (val === `"${str}"`) {
      return i;
    }
  }
  return -1;
};
