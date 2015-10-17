function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function updateLink(h) {
  /* h is an array of integers - convert it to a string */
  var strBuffer = "";
  for (var i = 0; i < h.length; ++i) {
    strBuffer += String.fromCharCode(h[i]);
  }
  /* Convert the string into a base64 string */
  var encoded = utf8_to_b64(strBuffer);
  document.getElementById('preset.link').innerHTML='<a href="#' + encoded + '">Link to current selection</a>';
}

function hashToIntegers(h) {
  /* Convert back to an array of integers */
  var arr = [];
  if (h) {
    var encoded = h.substr(1);
    var strBuffer = b64_to_utf8(encoded);
    if (strBuffer) {
      for (var i = 0; i < strBuffer.length; ++i) {
        arr.push(strBuffer.charCodeAt(i));
      }
    }
  }
  return arr;
}

function initToyCatCreator() {
  var svgDoc = document.getElementById('toy.cat.creator').getSVGDocument();
  var svgWin = svgDoc.defaultView;
  svgWin.addChangeStateCallback(updateLink);
  svgWin.initFromState(hashToIntegers(location.hash));
}
