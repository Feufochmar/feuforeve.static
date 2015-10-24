function getFlag() {
  document.getElementById('flag').innerHTML = '';
  document.getElementById('raw').innerHTML = '';
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        document.getElementById('flag').innerHTML = request.responseText;
        document.getElementById('raw').innerHTML = request.responseText;
      }
    };
  request.open('GET', '/FlagGenerator/RawFlag', true);
  request.send();
}
