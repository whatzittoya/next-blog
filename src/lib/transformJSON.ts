const transformJSON = (result) => {
  const reformattedArray = result.data.map((value) => {
    const transformData = (value, isarr = false) => {
      let res;
      let res_arr = [];
      let stat = "";
      Object.keys(value).forEach((e) => {
        if (e === "attributes") {
          const attr = value.attributes;

          res = { ...res, ...transformData(attr) };
        } else if (e === "data") {
          const attr = value.data;
          if (value[e].constructor.name == "Array") {
            stat = "arr";
            res = transformData(attr, true);
          } else if (value[e].constructor.name == "Object") {
            res = { ...res, ...transformData(attr) };
          }
        } else {
          //check the value of member is object
          if (value[e].constructor.name == "Array") {
            res = [res, ...transformData(value[e])];
          } else if (value[e].constructor.name == "Object") {
            if (isarr) {
              res_arr = [...res_arr, transformData(value[e])];
            } else {
              res = { ...res, [e]: transformData(value[e]) };
            }
          } else {
            res = { ...res, [e]: value[e] };
          }
        }
      });
      if (res_arr.length > 0) {
        return res_arr;
      }

      return res;
    };

    return transformData(value);
  });
  return reformattedArray;
};
export default transformJSON;
