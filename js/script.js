var error_audio,
    selected_word,
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
    alert("Parabéns, você acertou!");
    showTheAnswer();
    $("#risk-the-answer").attr("disabled","disabled");
    $(".letters").attr("disabled","disabled");
}

function init(){
    jQuery.support.cors = true;

    $.get("https://raw.githubusercontent.com/thiagodnf/roda-a-roda/master/data/data.json", function(data){
        available_words = JSON.parse("\"data\":"+data+"")
        nextWord();
    });
}

function getIntRandom(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function nextWord(){
    console.log(available_words)
    console.log(available_words.length);
    var index = getIntRandom(0,available_words.length);
    console.log(index);

    selected_word = {hint:"carro", word:"motor",hits:[]};

    $("#risk-the-answer").removeAttr("disabled","disabled");
    $(".letters").removeAttr("disabled");
    $(".accepted-letter").text("");

    for(var i=selected_word.word.length;i<12;i++){
        $("#letter_"+i).hide();
    }

    $("#hint").text(selected_word.hint.toUpperCase());
}

$(function(){

    $(".letters").click(function(){
        var letter = $(this).text();

        var indexes = getAllIndexes(selected_word.word, letter);

        if(indexes.length == 0){
            console.log("Letra não encontrada");
        }else{
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
        if($("#the-anwser").val() == selected_word.word){
            finished();
        }else{

        }

        $("#modal-risk-the-answer").modal('toggle');
    });

    $("#btn-restart").click(function(){
        nextWord();
    });

    init();
});
