var characterSheet = {};

function setEntry(entryKey, entryValue) {
  var textInput = document.getElementById('output.' + entryKey);
  textInput.value = entryValue;
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
  var species = '';
  if (characterSheet['species']['mimic-key']) {
    species += characterSheet['species']['mimic-name'] + ' ';
  }
  species += characterSheet['species']['name'];
  setEntry('species', species);
  setEntry('affinity', characterSheet['affinity']['name']);
  setEntry('gender', characterSheet['gender']['title']);
  setEntry('gender.pronouns', characterSheet['gender']['pronouns']);
  /* TODO */
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
  if (isLocked('language')) {
    requestData += '(language . ' + characterSheet['names']['language']['key'] + ')';
  }
  /**/
  if (isLocked('species')) {
    requestData += '(species . ' + characterSheet['species']['key'] + ')';
    var baseSpecies = '#f';
    if (characterSheet['species']['mimic-key']) {
      baseSpecies = characterSheet['species']['mimic-key'];
    }
    requestData += '(base-species . ' + baseSpecies + ')';
  }
  if (isLocked('affinity')) {
    requestData += '(affinity . ' + characterSheet['affinity']['key'] + ')';
  }
  if (isLocked('gender')) {
    requestData += '(gender . ' + characterSheet['gender']['key'] + ')';
  }
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
