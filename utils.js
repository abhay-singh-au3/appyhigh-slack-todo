exports.find = (arr, str) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes(str)) {
      return i;
    }
  }
  return -1;
};
