
let randomString = null;

document.addEventListener('DOMContentLoaded', function() {
  
  var stringType = document.getElementById('stringType');
  for (let def of Object.keys(def_stringtypes)) {
    let option = document.createElement("option");
    option.text = def_stringtypes[def].description;
    option.value = def;
    stringType.add(option);
  }
  var resultValue = document.getElementById('resultValue');
  var createStringButton = document.getElementById('createString');
  
  createStringButton.addEventListener('click', function() {
    let name = stringType.value + '';
    let definition = def_stringtypes[name];
    randomString = null;
    resultValue.innerHTML = '';
    resultCopy.style.display = 'none';
    if (name !== '') {
      randomString = getRandomString(definition);
      resultValue.innerHTML = randomString;
      resultCopy.style.display = 'block';
    }
    else {
      alert('Please select a definition');
    }
  }, false);
  
  resultCopy.addEventListener('click', function() {
    /* Copy the created string to clipboard */
    navigator.clipboard.writeText(randomString).then(()=>{
        alert("Copied the text");
      },()=>{
        alert("Failed to copy the text");
      }
    );
  }, false);
}, false);

