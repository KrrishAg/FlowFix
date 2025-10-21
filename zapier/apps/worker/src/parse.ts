export function parse(
  text: string,
  values: any,
  firstChar = "{",
  lastChar = "}"
) {
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
      let next = true;
      for (let i = 0; i < tmpStrArray.length && next; i++) {
        const x = tmpStrArray[i] as string;
        if (localValues[x]) {
          localValues = localValues[x];
        } else {
          finalRes += " ";
          next = false;
        }
      }
      if (next) finalRes += localValues;
      st = end + 1;
    } else {
      finalRes += text.charAt(st);
      st++;
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
