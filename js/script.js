var selected_word,
    available_words,
    is_correct = false,
    words = [];


function showTheAnswer(){
    for(var i=0;i<selected_word.word.length;i++){
        $("#letter_"+i).text(selected_word.word[i].toUpperCase());
    }
}

function getAllIndexes(word, letter){
    var indices = [];

    for(var i=0; i<word.length;i++) {
        if (word[i].toUpperCase() == letter.toUpperCase()){
            indices.push(i);
        }
    }

    return indices;
}

function finished(){
    $("#modal-congratulations").modal('show');
    var sound = new Howl({urls: ['mus/applause.mp3']}).play();
    showTheAnswer();
    $("#risk-the-answer").attr("disabled","disabled");
    $(".letters").attr("disabled","disabled");
}

function init(){
    // enable vibration support
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    jQuery.support.cors = true;

    $.get("https://raw.githubusercontent.com/thiagodnf/roda-a-roda/master/data/data.json", function(data){
        $("#content").removeClass("hide");
        $("#loading").hide();
        available_words = JSON.parse(data)
        nextWord();
    });
}

function getIntRandom(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function nextWord(){
    var index1 = getIntRandom(0, available_words.data.length-1);
    var index2 = getIntRandom(0, available_words.data[index1].words.length-1);

    var hint = available_words.data[index1].hint;
    var word = available_words.data[index1].words[index2];

    selected_word = {hint:hint, word:word,hits:[]};

    $("#risk-the-answer").removeAttr("disabled","disabled");
    $(".letters").removeAttr("disabled");
    $(".accepted-letter").html("&nbsp;");

    for(var i=0;i<12;i++){
        $("#letter_"+i).show();
    }

    for(var i=selected_word.word.length;i<12;i++){
        $("#letter_"+i).hide();
    }

    $("#hint").val(selected_word.hint.toUpperCase());
}

$(function(){

    $(".letters").click(function(){
        var letter = $(this).text();

        var indexes = getAllIndexes(selected_word.word, letter);

        if(indexes.length == 0){
            if(navigator.vibrate != null) navigator.vibrate(30);
        }else{
            var sound = new Howl({urls: ['mus/correct.mp3']}).play();
            for(var i=0;i<indexes.length;i++){
                $("#letter_"+indexes[i]).text(letter);
            }

        }

        var isCorrect = true;

        for(var i=0;i<selected_word.word.length;i++){
            if(selected_word.word[i].toUpperCase() != $("#letter_"+i).text().toUpperCase()){
                isCorrect = false;
            }
        }

        if(isCorrect){
            finished();
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
            finished();
        }else{
            alert("Você errou! Tente novamente.")
        }

        $("#modal-risk-the-answer").modal('toggle');
    });

    $("#btn-next-word").click(function(){
        if(navigator.vibrate != null) navigator.vibrate(30);
        nextWord();
    });

    init();
});
