export function parse(
  text: string,
  values: any,
  firstChar = "{",
  lastChar = "}"
) {
  if (!text) return "";
  const n = text.length;
  let st = 0,
    finalRes = "";

  while (st < n) {
    if (text.charAt(st) === firstChar) {
      let end = st + 1;
      while (end < n && text.charAt(end) !== lastChar) {
        end++;
      }
      const tmpStrArray = text.slice(st + 1, end).split(".");
      let localValues = { ...values };
      //going in depth of the values object
      for (const x of tmpStrArray) {
        localValues = localValues[x];
      }
      finalRes += localValues;
      st = end + 1;
    } else {
      finalRes += text.charAt(st);
      st++;
      //   end++;
    }
  }
  return finalRes;
}

//if let say github sends a json like
// {
//     comment: {
//         name: "Krrish",
//         amount: 50
//     }
// }
//In this case my text would be like ...some text...{comment.name}..more text...{comment.amount}
