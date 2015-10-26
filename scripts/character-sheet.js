var characterSheet = {};

function setEntry(entryKey, entryValue) {
  var textInput = document.getElementById('output.' + entryKey);
  textInput.value = entryValue;
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
    natures += characterSheet['natures'][i] + ' ';
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

function buildRequestData() {
  var requestData = '(';
  if (isLocked('given.names')) {
    requestData += '(given-names . #(';
    for (var i = 0; i < characterSheet['names']['given'].length; ++i) {
      requestData += '((word-language . ' + characterSheet['names']['given'][i]['word-language'] + ')';
      requestData += ' (word-phonemes . ' + characterSheet['names']['given'][i]['word-phonemes'] + '))';
    }
    requestData += '))';
  }
  if (isLocked('other.name')) {
    requestData += '(other-name . ';
    requestData += '((word-language . ' + characterSheet['names']['other']['word-language'] + ')';
    requestData += ' (word-phonemes . ' + characterSheet['names']['other']['word-phonemes'] + '))';
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
  /* TODO */
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
