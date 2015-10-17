function updateCurrentStateLink(h) {
  document.getElementById('preset.link').innerHTML='<a href="' + h + '">Link to current selection</a>';
}

function initToyCatCreator() {
  var svgDoc = document.getElementById('toy.cat.creator').getSVGDocument();
  var svgWin = svgDoc.defaultView;
  svgWin.addHashCallback(updateCurrentStateLink);
  svgWin.initFromHash(location.hash);
}
