const Web3 = require("web3");
const axios = require("axios");

const web3 = new Web3();
// "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213"

async function getData(address) {
  let res = await axios.get(
    `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=6N9P8EYIKS3G2C6VX2EGGYWN8GB3C5611F`
  );
  let contractName = res.data.contractName;

  let code = res.data.result[0].SourceCode;
  let abi = res.data.result[0].ABI;
  let abiJson = JSON.parse(abi);
  let functions = [];
  let lines = [];
  let des = "";
  let commentStart = false;
  let lineCounter = 0;
  let i;
  let regex;

  for (let item of abiJson) {
    let methodId = web3.eth.abi.encodeFunctionSignature({
      name: item.name,
      type: item.type,
      inputs: item.inputs,
    });

    regex = new RegExp("function" + "\\s+" + item.name + "\\s*" + "[(]", "g");

    lines = code.split(regex)[0];

    if (lines.length > 1) {
      lines = lines.split("\n");
    } else {
      lines = [];
    }

    des = "";
    commentStart = false;
    lineCounter = 0;

    for (i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes("*/")) {
        commentStart = true;
      }
      if (lines[i].includes("*") && commentStart) {
        des = lines[i] + des;
      }
      if (lines[i].includes("/*")) {
        commentStart = false;
        break;
      }
      if (!commentStart && lineCounter > 1) {
        break;
      }
      lineCounter++;
    }

    des = des
      .replaceAll("/*", "")
      .replaceAll("*/", "")
      .replaceAll(/[\r\n*]/g, "")
      .replaceAll(/\s+/g, " ")
      .replaceAll("@dev", "\n@dev")
      .replaceAll("@param", "\n@param")
      .replaceAll("@return", "\n@return")
      .trim();
    // .split("\n");

    functions.push({
      name: item.name,
      id: methodId.slice(0, 10),
      description: des,
    });

    // console.log(des);
  }

  console.log(functions);
}

getData("0x16980b3b4a3f9d89e33311b5aa8f80303e5ca4f8");

// readme:
//
// 1-currently it only supports multiline comments , single line comments can be achieve with the same logic.
// 2-currently it only decodes method ids for functions we need to filter the item in the for loop , if item.type = 'function'
// then (encodeFunctionSignature) this function should be used, else if item.type = 'event' then (encodeEventSignature) this
// function will be used , please verify the functions from web3 documentation
// 3-exception handling should be done for unverified contracts, etherscan api breaks.
