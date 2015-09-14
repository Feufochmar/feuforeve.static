function getSvgRawImage(address, idSvg, idRaw) {
  document.getElementById(idSvg).innerHTML = '';
  if (idRaw) {
    document.getElementById(idRaw).innerHTML = '';
  }
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        document.getElementById(idSvg).innerHTML = request.responseText;
        if (idRaw) {
          document.getElementById(idRaw).innerHTML = request.responseText;
        }
      }
    };
  request.open('GET', address, false);
  request.send(null);
}
function getSvgImage(address, idSvg) {
  getSvgRawImage(address, idSvg, false);
}
