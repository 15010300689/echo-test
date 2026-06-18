function parsePrice(str) {
    let regex = /(\d+(\.\d+)?)-?(\d+(\.\d+)?)?万/g;
    let matches = str.match(regex);
    let result = [];

    console.error(matches);
    
    matches.forEach(match => {
        let parts = match.split('-');
        let num = parts[0].replace('万', '');
        let unit = '万';
        
        result.push({num: num, unit: unit});
        
        if (parts.length > 1) {
            result.push({num: match, unit: unit});
        }
    });
    
    return result;
}

// 测试方法
// let str = '7.89万起、7.89-10.25万';
// let parsedPrices = parsePrice(str);
// console.log(parsedPrices);

function cutString(str, len) {
    let result = '';
    let count = 0;
   
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        // 如果是复杂字，UTF-16编码的第一个代理字符的码点大于255
        count += 2; // 长度加2
        if (count > len) {
          // 已经超出指定长度，退出循环
          break;
        }
        result += str[i]; // 将复杂字添加到结果中
        i++; // 跳过下一个代理字符
      } else {
        // 如果是基本汉字或英文字母，长度加1
        count += 1;
        if (count > len) {
          break;
        }
        result += str[i];
      }
    }
   
    return result;
}
   
// 使用示例
const originalString = '这是一个很长的字符串，我们将其截取前100个汉字。';
// const cutStringResult = cutString(originalString, 100);
// console.log(cutStringResult); // 输出截取的前100个汉字

const nStr = originalString.substr(0, 10)
console.log('nStr', nStr);



function a () {
  if (!item.priceUnit) {
    if (item.price === '面议' ){
      tempObj.price = '面议';
      tempObj.priceUnit = '';
    } else {
      let tempArr = [];
      tempObj.priceUnit = '';
      tempObj.price = '';
      if (!!item.price) {
        tempObj.price = parseFloat(item.price) || '';
        tempArr = item.price.split(parseFloat(tempObj.price))
        tempObj.priceUnit = tempArr.length == 2 ? tempArr[1] : ''
      }
      // tempObj.priceUnit = tempArr.length == 2 ? tempArr[1] : ''
    }
  } else {
    tempObj.price = item.price || '';
    tempObj.priceUnit = item.priceUnit || '';
  }

  tempObj.price = (tempObj.price || '').replace('_', '-');
  console.error('tempObj', tempObj);
}