var synth = window.speechSynthesis;
var speechSynthesis = speechSynthesis;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
var stopRecording = false;
var clicked = false;

var diagnostic = document.querySelector('.output');
var hints = document.querySelector('.hints');

var voices = [];
var utterThis;
var utterances = ["Value for grit rating?", "Value for lather?", "Value for alkai free?","All fields have been filled."]

function populateVoiceList() {
    voices = synth.getVoices().sort(function(a, b) {
        const aname = a.name.toUpperCase(),
            bname = b.name.toUpperCase();
        if (aname < bname) return -1;
        else if (aname == bname) return 0;
        else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for (i = 0; i < voices.length; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if (voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
}


document.body.onclick = function() {
  if(!clicked){
    speak(0);
    clicked = true;}

}

recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var response = event.results[0][0].transcript;
    diagnostic.textContent = 'Response received: ' + response + '.';
    //bg.style.backgroundresponse = response;

    if (response.includes("stop") || response.includes("save")) {
        stopRecording = true;
    }
    var a = document.forms["Form1"]["fname1"].value;
    var b = document.forms["Form2"]["fname2"].value;
    var c = document.forms["Form3"]["fname3"].value;
    var value = parseFloat(response);
    console.log(isNaN(value));
    if (a == null || a == "") {
      if(!isNaN(value)){
        if (value <= 3.0) {
            document.getElementById('fname1').value = response;
            speak(1);
        } else {
            diagnostic.textContent = 'Value should be less than 3.0.';
            speak(0);
        }
      }
      else{
        speak(0);
      }
    } else if (b == null || b == "") {
      if(!isNaN(value)){
        if (value >= 200.0) {
            document.getElementById('fname2').value = response;
            speak(2);
        } else {
            diagnostic.textContent = 'Value should be greater than 200.0.';
            speak(1);
        }
      }
      else{
        speak(1);
      }
    } else if (c == null || c == "") {
      if(!isNaN(value)){
        if (value >= 0.05) {
            document.getElementById('fname3').value = response;
            speak(3);
        } else {
            diagnostic.textContent = 'Value should be greater than 0.05.';
            speak(2);
        }
    }
    else{
      speak(2);
    }
  }
    console.log('Confidence: ' + event.results[0][0].confidence);
}

function speak(position) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    utterThis = new SpeechSynthesisUtterance(utterances[position]);
    console.log(voices);
    utterThis.voice = voices[11];
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
    utterThis.onend = function(event) {
        console.log('SpeechSynthesisUtterance.onend');
        if(position != 3){
        recognition.start();}
    }
    utterThis.onerror = function(event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
}



recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onnomatch = function(event) {
    //diagnostic.textContent = "I didn't recognise that response.";
    console.log("no match");
}

recognition.onerror = function(event) {
    //diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    console.log("error");
}