
//===================================================================================
// NOTE: Class names etc has been named by biological naming convensions
//===================================================================================
//
// Biological naming convension:
//
//          5'  ACTGGACTACTGGACTGACT  3'  // Coding stand
//          3'  TGACCTGATGACCTGACTGA  5'  // Template stand
//                   -------->            // RNA polymerase movement on the template strand (aka. "downstream" relative to both DNA and mRNA)
//                        |
//                   starting base in this particular setup (the JSON-data)


// var dna = 'ACTGGACTACTGGACTGACT';  // codingStrand

var bioObj = {
        dna : { 
            A : {name:"Adenin", class:"adenin DNA", src:""},
            C : {name:"Cytosin",class:"cytosin DNA", src:""},
            G : {name:"Guanin", class:"guanin DNA", src:""},
            T : {name:"Thymin", class:"thymin DNA", src:""}
        },
        mRNA : { 
            A : {name:"Adenin", class:"adenin mRNA", src:""},
            C : {name:"Cytosin",class:"cytosin mRNA", src:""},
            G : {name:"Guanin", class:"guanin mRNA", src:""},
            U : {name:"Uracil", class:"uracil mRNA", src:""}
        },
        tRNA : { }
}

var dObj = {

};


function basicPosCalc(){

    window.transcriptionContainer_pos = $('#transcriptionContainer').position();
    $('#xPos').html(transcriptionContainer_pos.left);
    $('#yPos').html(transcriptionContainer_pos.top);

    window.transcriptionContainer_offset = $('#transcriptionContainer').offset();
    $('#xOffset').html(transcriptionContainer_offset.left);
    $('#yOffset').html(transcriptionContainer_offset.top);
}


function setEventhandlers(){

    $(document).on('mousemove', "#transcriptionContainer", function(event) {
        console.log('mousemove - CALLED');
        $('#xCord_abs').html(event.pageX);
        $('#yCord_abs').html(event.pageY);

        $('#xCord_rel').html(event.pageX - transcriptionContainer_pos.left);
        $('#yCord_rel').html(event.pageY - transcriptionContainer_pos.top);
    });

    $( ".draggable_neucleotide" ).draggable({

        revert: function(valid) {
            // ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
            // SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
            if(valid) {
                console.log("Dropped in a valid location");
                // correct_sound();
            }
            else {
             console.log("Dropped in a invalid location");
                // error_sound();
            }
            return !valid;
        },
        start: function(event, ui) {
            console.log('card - START');
            // window.topPos = $(this).css('top');
        },
        stop: function(event, ui) {
            console.log('card - STOP');

            // if (dropZoneObj !== null){ // If student answer is correct...
            //     var dropId = $(dropZoneObj).prop('id');
            //     console.log('card - dropId: ' + dropId);

            //     $(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
            //     $(this).remove();                                               // Remove the original card
            //     organizeCardPile('#'+dropId, 5, 0);
                
            //     // if (dropId == 'wasteBin') {
            //     //  $('.glyphicons-bin').css({'opacity':'0'});
            //     //  $( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
            //     //  $( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
            //     // } 

            //     dropZoneObj = null;  // Reset dropZoneObj...

            //     // console.log('card - CORRECT ');
            //     // correct_sound();                        
            // } 
            // else {  // If student answer is wrong...

            //     console.log('card - ERROR ');
            //     // error_sound();               // <------ Does not work on mobile devices - see the solution ATO found above. 
            //     $(this).css({'top': topPos});   // This is done to make Internet Explore 11 understand that it needs på place the card back to its original position.
            // }

            // if ($('#cardPile .card').length == 0) {
            //     console.log('step_2_template - INIT');
            //     step_2_template();
            // }

        },
        drag: function(event, ui) {
            console.log('card - DRAG');
        }
    });

    $( "#dropZone" ).droppable({
        accept: ".correct_mRNA",

        drop: function(event, ui) {
            console.log('card - DROP - problem_0');
            // window.dropZoneObj = $(this);
        } 
    });
}


function complementaryDnaBase(base){
    var compBase = {"A":"T", "T":"A", "G":"C", "C":"G" };
    return compBase[base];
}


function initTransription(){

    // dObj.dnaArr = dna.split('');  
    dObj.dnaArr = jsonData.codingStrand.split('');

    var HTML = '';
    HTML += '<div class="fadeOut fadeOut_left"></div>';
    HTML += '<div id="dropZone"></div>';
    for (var n in dObj.dnaArr){
        // HTML += '<div class="neucleotideWrap"><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'">'+dObj.dnaArr[n]+'</div></div>';
        // HTML += '<div class="basePairWrap"><div class="neucleotide complementaryStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'">'+complementaryDnaBase(dObj.dnaArr[n])+'</div><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'">'+dObj.dnaArr[n]+'</div></div>';
        HTML += '<div class="basePairWrap"><div class="neucleotide templateStrand '+bioObj.dna[dObj.dnaArr[n]].class+'">'+dObj.dnaArr[n]+'</div><div class="neucleotide codingStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'">'+complementaryDnaBase(dObj.dnaArr[n])+'</div></div>';
    }
    HTML += '<div class="fadeOut fadeOut_right"></div>';
    // HTML += '<div class="Clear"></div>';
    return HTML;
}


function correctmRnaNucleotide(){
    // $('#dropZone').css({position: 'absolute', left: '50%'});  // <----- NOTE: not needed since this is set in CSS, but is added here for clarity...

    var startNeucleotideNo = Math.round(20 * 50/100); // <---- 20 neucleotide in the x-direction times 50% = 50/100, because this is the position of the dropZone i the x-direction.
    var neucleotideInDna = complementaryDnaBase(dObj.dnaArr[startNeucleotideNo]);
    console.log('correctmRnaNucleotide - neucleotideInDna: ' + neucleotideInDna);

    var compBase = {"A":"U", "T":"A", "G":"C", "C":"G" };

    return compBase[neucleotideInDna];
}


function addDraggableNeucleotides(){
    $('.draggable_neucleotide').remove(); // Remove previous neucleotides...

    var count = 0;
    var HTML = '';
    for (var n in bioObj.mRNA){
        console.log('addDraggableNeucleotides - n: ' + n);
        HTML += '<div id="draggable_neucleotide_'+count+'" class="neucleotide draggable_neucleotide '+((n==correctmRnaNucleotide())?'correct_mRNA':'')+' '+bioObj.mRNA[n].class+'">'+n+'</div>';
        ++count;
    }
    $('#transcriptionContainer').append(HTML);

    for (var i = 0; i < count; i++) {
        var x = Math.round(Math.random()*90 + 5);
        var y = Math.round(Math.random()*15);
        if (Math.random() <= 0.5){
            $('#draggable_neucleotide_'+i).css({position: 'absolute',top: String(y)+'%', left: String(x)+'%'});
        } else {
            y = y + 70;
            $('#draggable_neucleotide_'+i).css({position: 'absolute',top: String(y)+'%', left: String(x)+'%'});
        }
    };
}


function ajustScreenHight(){
    var width = $('#transcriptionContainer').width();
    $('#transcriptionContainer').height(Math.round(9/16*width));
}




//=======================================================================================
//                  Run code
//=======================================================================================


$(window).on('resize', function() {
    ajustScreenHight();
});

$(document).ready(function() {
    // getAjaxData("GET", "json/quizData.json", false, "json"); 
    // console.log("jsonData: " + JSON.stringify(jsonData));

    $('#header').prepend(jsonData.header);
    $('#instruction').prepend(instruction(jsonData.instruction));  
    $('#explanation').prepend(explanation(jsonData.explanation));

    basicPosCalc();

    $('#transcriptionContainer').append(initTransription());
    // ajustScreenHight();

    addDraggableNeucleotides();

    setEventhandlers();

    ajustScreenHight();
    
});

