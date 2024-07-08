export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const removeQuotes = (text: string) => {
  if (!text) {
    return "";
  }
  // let result = s.replace(/'/g, "''").replace(/"/g, '""');s
  let result = text.replace(/"/g, '""');
  try {
    result = result.replace(/\\/g, String.fromCharCode(92, 92));
  } catch (e) {}
  return result;
};
