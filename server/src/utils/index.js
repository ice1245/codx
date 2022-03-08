function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toLowerCase();
}
function makeid (slots) {
  const res = []
  for(let c = 0; c < slots; ++c) {
    res.push(randomString(3))
  }
  return res.join("-")
}

module.exports = {
  randomString,
  makeid
}