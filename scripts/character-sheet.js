var characterSheet = {};

function setEntry(entryKey, entryValue) {
  var textInput = document.getElementById('output.' + entryKey);
  textInput.innerHTML = entryValue;
}

function setSpeciesEntry(speciesKey, speciesValue) {
  var species = '';
  if (speciesValue['mimic-key']) {
    species += speciesValue['mimic-name'] + ' ';
  }
  species += speciesValue['name'];
  setEntry(speciesKey, species);
}

function setParentEntry(parentKey, parentValue) {
  if (parentValue) {
    document.getElementById(parentKey).style.display = 'block';
    setEntry(parentKey + '.name', parentValue['given-name']['transcription']);
    setEntry(parentKey + '.name.pronounciation', parentValue['given-name']['pronounciation']);
    setSpeciesEntry(parentKey + '.species', parentValue['species']);
    setEntry(parentKey + '.gender', parentValue['gender']['title']);
    setEntry(parentKey + '.gender.pronouns', parentValue['gender']['pronouns']);
    setEntry(parentKey + '.language', parentValue['language']['name']);

  } else {
    document.getElementById(parentKey).style.display = 'none';
    setEntry(parentKey + '.name', 'N/A');
    setEntry(parentKey + '.name.pronounciation', 'N/A');
    setEntry(parentKey + '.species', 'N/A');
    setEntry(parentKey + '.gender', 'N/A');
    setEntry(parentKey + '.gender.pronouns', 'N/A');
    setEntry(parentKey + '.language', 'N/A');
  }
}
function setGrandParentEntry(grandParentKey, grandParentValue) {
  setParentEntry(grandParentKey, grandParentValue);
  if (grandParentValue) {
    setEntry(grandParentKey + '.name.family', grandParentValue['family-name']['transcription']);
    setEntry(grandParentKey + '.name.family.pronounciation', grandParentValue['family-name']['pronounciation']);
  } else {
    setEntry(grandParentKey + '.name.family', 'N/A');
    setEntry(grandParentKey + '.name.family.pronounciation', 'N/A');
  }
}

function isLocked(lockKey) {
  var lock = document.getElementById('lock.' + lockKey);
  return lock.checked;
}

function updateEntries() {
  setEntry('short.name', characterSheet['names']['short']['transcription']);
  setEntry('short.name.pronounciation', characterSheet['names']['short']['pronounciation']);
  setEntry('full.name', characterSheet['names']['full']['transcription']);
  setEntry('full.name.pronounciation', characterSheet['names']['full']['pronounciation']);
  var givenNamesTranscription = '';
  var givenNamesPronounciation = '';
  for (var i = 0; i < characterSheet['names']['given'].length; ++i) {
    givenNamesTranscription += characterSheet['names']['given'][i]['transcription'] + ' ';
    givenNamesPronounciation += characterSheet['names']['given'][i]['pronounciation'] + ' ';
  }
  setEntry('given.names', givenNamesTranscription);
  setEntry('given.names.pronounciation', givenNamesPronounciation);
  setEntry('other.name', characterSheet['names']['other']['transcription']);
  setEntry('other.name.pronounciation', characterSheet['names']['other']['pronounciation']);
  setEntry('language', characterSheet['names']['language']['name']);
  /**/
  setSpeciesEntry('species', characterSheet['species']);
  setEntry('affinity', characterSheet['affinity']['name']);
  setEntry('gender', characterSheet['gender']['title']);
  setEntry('gender.pronouns', characterSheet['gender']['pronouns']);
  /**/
  setEntry('birthdate.month', characterSheet['birthdate']['month']['name']);
  setEntry('birthdate.day', characterSheet['birthdate']['day']);
  setEntry('astrological.sign', characterSheet['birthdate']['astrological-sign']['name']);
  setEntry('birth.place', characterSheet['birth-place']);
  setEntry('sex', characterSheet['sex']['description']);
  /**/
  setEntry('living.place', characterSheet['living-place']);
  setEntry('age', characterSheet['age']['description']);
  if (characterSheet['profession']) {
    setEntry('profession', characterSheet['profession']);
  } else {
    setEntry('profession', 'none');
  }
  /**/
  setEntry('size', characterSheet['size']);
  if (characterSheet['weight']) {
    setEntry('weight', characterSheet['weight']);
  } else {
    setEntry('weight', 'middle-weighted');
  }
  var natures = '';
  for (var i = 0; i < characterSheet['natures'].length; ++i) {
    natures += characterSheet['natures'][i];
    if (i < (characterSheet['natures'].length - 1)) {
      natures += ', ';
    }
  }
  setEntry('traits.nature', natures);
  var traits = '';
  for (var i = 0; i < characterSheet['traits'].length; ++i) {
    traits += characterSheet['traits'][i] + ' ';
  }
  setEntry('traits.other', traits);
  setEntry('motto', characterSheet['motto']);
  /**/
  setParentEntry('mother', characterSheet['mother']);
  setParentEntry('father', characterSheet['father']);
  setGrandParentEntry('grandmother.mother', characterSheet['gmm']);
  setGrandParentEntry('grandfather.mother', characterSheet['gfm']);
  setGrandParentEntry('grandmother.father', characterSheet['gmf']);
  setGrandParentEntry('grandfather.father', characterSheet['gff']);
}

function getDataForRequest(entryId, key, value) {
  var data = '';
  if (isLocked(entryId)) {
    data = '(' + key + ' . ' + value + ')';
  }
  return data;
}

function buildRequestWord(word) {
  var data = '('
  data += '(word-language . ' + word['word-language'] + ')';
  data += '(word-phonemes . ' + word['word-phonemes'] + ')';
  data += ')';
  return data;
}

function hasParentLock(idEntry) {
  return isLocked(idEntry + '.name') ||
         isLocked(idEntry + '.species') ||
         isLocked(idEntry + '.gender') ||
         isLocked(idEntry + '.language');
}

function hasGrandParentLock(idEntry) {
  return hasParentLock(idEntry) || isLocked(idEntry + '.name.family');
}

function buildParentData(idEntry, key) {
  var requestData = '';
  if (isLocked(idEntry + '.name')) {
    requestData += '(given-name . ';
    requestData += buildRequestWord(characterSheet[key]['given-name']);
    requestData += ')';
  }
  if (isLocked(idEntry + '.species')) {
    requestData += '(species . ' + characterSheet[key]['species']['key'] + ')';
    var baseSpecies = '#f';
    if (characterSheet[key]['species']['mimic-key']) {
      baseSpecies = characterSheet[key]['species']['mimic-key'];
    }
    requestData += '(base-species . ' + baseSpecies + ')';
  }
  requestData += getDataForRequest(idEntry + '.gender', 'gender', characterSheet[key]['gender']['key']);
  requestData += getDataForRequest(idEntry + '.language', 'language', characterSheet[key]['language']['key']);
  return requestData;
}

function getParentDataForRequest(idEntry, key) {
  var requestData = '';
  if (characterSheet[key] && hasParentLock(idEntry)) {
    requestData += '(' + key + ' . (';
    requestData += buildParentData(idEntry, key);
    requestData += '))';
  }
  return requestData;
}

function getGrandParentDataForRequest(idEntry, key) {
  var requestData = '';
  if (characterSheet[key] && hasGrandParentLock(idEntry)) {
    requestData += '(' + key + ' . (';
    requestData += buildParentData(idEntry, key);
    if (isLocked(idEntry + '.name.family')) {
      requestData += '(family-name . ';
      requestData += buildRequestWord(characterSheet[key]['family-name']);
      requestData += ')';
    }
    requestData += '))';
  }
  return requestData;
}

function buildRequestData() {
  var requestData = '(';
  if (isLocked('given.names')) {
    requestData += '(given-names . #(';
    for (var i = 0; i < characterSheet['names']['given'].length; ++i) {
      requestData += buildRequestWord(characterSheet['names']['given'][i]);
    }
    requestData += '))';
  }
  if (isLocked('other.name')) {
    requestData += '(other-name . ';
    requestData += buildRequestWord(characterSheet['names']['other']);
    requestData += ')';
  }
  requestData += getDataForRequest('language', 'language', characterSheet['names']['language']['key']);
  /**/
  if (isLocked('species')) {
    requestData += '(species . ' + characterSheet['species']['key'] + ')';
    var baseSpecies = '#f';
    if (characterSheet['species']['mimic-key']) {
      baseSpecies = characterSheet['species']['mimic-key'];
    }
    requestData += '(base-species . ' + baseSpecies + ')';
  }
  requestData += getDataForRequest('affinity', 'affinity', characterSheet['affinity']['key']);
  requestData += getDataForRequest('gender', 'gender', characterSheet['gender']['key']);
  /**/
  if (isLocked('birthdate.month') || isLocked('birthdate.day') || isLocked('astrological.sign')) {
    requestData += '(birthdate . (';
    requestData += getDataForRequest('birthdate.month', 'month', characterSheet['birthdate']['month']['key']);
    requestData += getDataForRequest('birthdate.day', 'day', characterSheet['birthdate']['day']);
    requestData += getDataForRequest('astrological.sign', 'astrological-sign',
                                     characterSheet['birthdate']['astrological-sign']['key']);
    requestData += '))';
  }
  requestData += getDataForRequest('birth.place', 'birth-place', '"' + characterSheet['birth-place'] + '"');
  requestData += getDataForRequest('sex', 'sex', characterSheet['sex']['key']);
  /**/
  requestData += getDataForRequest('living.place', 'living-place', '"' + characterSheet['living-place'] + '"');
  requestData += getDataForRequest('age', 'age', characterSheet['age']['key']);
  if (characterSheet['profession']) {
    requestData += getDataForRequest('profession', 'profession', '"' + characterSheet['profession'] + '"');
  } else {
    requestData += getDataForRequest('profession', 'profession', '"none"');
  }
  /**/
  requestData += getDataForRequest('size', 'size', '"' + characterSheet['size'] + '"');
  if (characterSheet['weight']) {
    requestData += getDataForRequest('weight', 'weight', '"' + characterSheet['weight'] + '"');
  } else {
    requestData += getDataForRequest('weight', 'weight', '"middle-weighted"');
  }
  var natures = '#(';
  for (var i = 0; i < characterSheet['natures'].length; ++i) {
    natures += '"' + characterSheet['natures'][i] + '" ';
  }
  natures += ')';
  requestData += getDataForRequest('traits.nature', 'natures', natures);
  var traits = '#(';
  for (var i = 0; i < characterSheet['traits'].length; ++i) {
    traits += '"' + characterSheet['traits'][i] + '" ';
  }
  traits += ')';
  requestData += getDataForRequest('traits.other', 'traits', traits);
  requestData += getDataForRequest('motto', 'motto', '"' + characterSheet['motto'].replace(/"/g, '\\"') + '"');
  /**/
  requestData += getParentDataForRequest('mother', 'mother');
  requestData += getParentDataForRequest('father', 'father');
  requestData += getGrandParentDataForRequest('grandmother.mother', 'gmm');
  requestData += getGrandParentDataForRequest('grandfather.mother', 'gfm');
  requestData += getGrandParentDataForRequest('grandmother.father', 'gmf');
  requestData += getGrandParentDataForRequest('grandfather.father', 'gff');
  requestData += ')';
  console.log(requestData);
  return requestData;
}

function updateSheet() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        console.log(request.responseText);
        characterSheet = JSON.parse(request.responseText);
        updateEntries();
      }
    };
  request.open('POST', '/FloraCharacterGenerator/sheet/backend', true);
  request.setRequestHeader('Content-Type', 'text/x-sexpr;charset=UTF-8');
  if (Object.getOwnPropertyNames(characterSheet).length == 0) {
    request.send(null);
  } else {
    request.send(buildRequestData());
  }
}
