export const removeUndefined = (data: Record<string, any>) => {
  for (let key in data) {
    if (
      data[key] === undefined ||
      data[key] === null ||
      data[key] === "" ||
      data[key] === "null" ||
      data[key] === "undefined"
    ) {
      delete data[key];
    }
  }
};
export const capitalizeFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};
// exampleCamelCaseString to 'Example Camel Case String'
export const capitalizeCamelSpace = (name: string) => {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return capitalized.replace(/([A-Z])/g, " $1").trim();
};
//send array and check all is same
exports.isAllSameinArray = (dataArray: any[], name: string | number) => {
  if (dataArray.length === 0) return false; // or true, based on how you want to treat an empty array

  const firstElementName = name ?? dataArray[0];
  return dataArray.every((item) => item === firstElementName);
};
// let input = "   Hello   world!   This is    a test.  ";
// "Hello world! This is a test."
exports.trimNameLower = (name: string) => {
  if (typeof name !== "string") {
    throw new Error("Invalid type, expected string");
  }
  // Log the original name for debugging
  console.log("Original name:", JSON.stringify(name));
  const trimmedName = name
    .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
  // Log the trimmed name for debugging
  console.log("Trimmed name:", JSON.stringify(trimmedName));
  return trimmedName;
};

// const data = pick(req.body, [
//   'title',
//   'description',
//   'date'
// ]);
exports.pickObj = (obj: object, keys: []) => {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
