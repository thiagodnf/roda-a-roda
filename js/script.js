var selected_word,
    available_words = [],
    correct_sound,
    applause_sound,
    fail_sound,
    wrong_sound,
    is_finished = false;
    is_correct = false,
    url = "https://raw.githubusercontent.com/thiagodnf/roda-a-roda/master/database.json"
    words = [];

function showTheAnswer(){
    for(var i = 0; i < selected_word.word.length; i++){
        $("#letter_"+i).text(selected_word.word[i].toUpperCase());
    }
}

function vibrate(miliseconds){
    if(navigator.vibrate){
        navigator.vibrate(30);
    }
}

function getAllIndexes(word, letter){
    var indices = [];

    for(var i = 0; i < word.length; i++) {
        if (word[i].toUpperCase() == letter.toUpperCase()){
            indices.push(i);
        }
    }

    return indices;
}

function finished(success){
    if(success){
        $("#modal-congratulations").modal('show');
        applause_sound.play();
    }else{
        $("#modal-fail").modal('show');
        fail_sound.play();
    }

    showTheAnswer();

    $("#risk-the-answer").attr("disabled","disabled");
    $(".letters").attr("disabled","disabled");

    is_finished = true;
}

function init(){

    $.getJSON(url, function (data) {
      if (data.feed.entry == null) {
           alert("Erro ao buscar as palavras");
       } else {
           $.each(data.feed.entry, function (index, value) {
               available_words.push({
                   hint: value.gsx$hint.$t,
                   words: value.gsx$words.$t.split(","),
               });
           });

           $("#loading").hide();
           $("#content").removeClass("hide").hide().fadeIn();

           nextWord();
       }
   });
}

function getIntRandom(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function nextWord(){
    var hintIndex = getIntRandom(0, available_words.length-1);
    var wordIndex = getIntRandom(0, available_words[hintIndex].words.length-1);

    selected_word = {
        hint: available_words[hintIndex].hint,
        word: available_words[hintIndex].words[wordIndex],
        hits:[]
    };

    $("#risk-the-answer").removeAttr("disabled","disabled");
    $(".letters").removeAttr("disabled");
    $(".accepted-letter").html("&nbsp;");
    $("#hint").val(selected_word.hint.toUpperCase());

    is_finished = false;

    for(var i = 0; i < 12; i++){
        $("#letter_"+i).show();
    }

    for(var i = selected_word.word.length; i < 12; i++){
        $("#letter_"+i).hide();
    }
}

$(function(){

    correct_sound = new Howl({urls: ['mus/correct.mp3']});
    applause_sound = new Howl({urls: ['mus/applause.mp3']});
    wrong_sound = new Howl({urls: ['mus/wrong-2.mp3']});
    fail_sound = new Howl({urls: ['mus/fail.mp3']});

    // enable vibration support
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    $.ajaxSetup({ cache: true });

    $(".letters").click(function(){
        // Get the user input. The text is the selected letter
        var letter = $(this).text();

        var indexes = getAllIndexes(selected_word.word, letter);

        // If there are no indexes, the letters is wrong
        if(indexes.length == 0){
            vibrate(30);
            wrong_sound.play();
        }else{
            // The user pushes a correct button. Notify s(he) using a sound
            correct_sound.play();

            // Put the pressed button letter within the right place
            for(var i = 0; i < indexes.length; i++){
                $("#letter_"+indexes[i]).text(letter);
                $("#letter_"+indexes[i]).fadeTo(100, 0.1).fadeTo(200, 1.0);
            }
        }

        var isCorrect = true;

        for(var i=0;i<selected_word.word.length;i++){
            if(selected_word.word[i].toUpperCase() != $("#letter_"+i).text().toUpperCase()){
                isCorrect = false;
            }
        }

        if(isCorrect){
            finished(true);
        }

        $(this).attr("disabled","disabled")
    });

    $("#form-risk-the-answer").submit(function(e){
        e.preventDefault();
    });

    $('#modal-risk-the-answer').on('show.bs.modal', function () {
        $("#the-anwser").val('');
	});

    $("#btn-risk-the-answer").click(function(){
        if($("#the-anwser").val().toUpperCase() == selected_word.word.toUpperCase()){
            finished(true);
        }else{
            finished(false)
        }

        $("#modal-risk-the-answer").modal('toggle');
    });

    $('#modal-congratulations').on("keypress", function (e) {
        if (e.which == 13){
            $(this).modal('toggle');
        }
    });

    $('#modal-fail').on("keypress", function (e) {
        if (e.which == 13){
            $(this).modal('toggle');
        }
    });

    $("#btn-next-word").click(function(){
        if(is_finished || confirm("Deseja realmente ir para a próxima palavra?")){
            vibrate(30);
            nextWord();
        }
    });

    init();
});
