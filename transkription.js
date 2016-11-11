
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

// background-color: #454E4F == 069078079,  #454C4C == 069076076


var bioObj = {
        dna : { 
            A : {name:"Adenin", class:"adenin DNA", src: {codingStrand: 'ao.png', templateStrand: 'an.png'} },
            C : {name:"Cytosin",class:"cytosin DNA", src: {codingStrand: 'co.png', templateStrand: 'cn.png'} },
            G : {name:"Guanin", class:"guanin DNA", src: {codingStrand: 'go.png', templateStrand: 'gn.png'} },
            T : {name:"Thymin", class:"thymin DNA", src: {codingStrand: 'to.png', templateStrand: 'tn.png'} }
        },
        mRNA : { 
            A : {name:"Adenin", class:"adenin mRNA", src:"am.png"},
            C : {name:"Cytosin",class:"cytosin mRNA", src:"cm.png"},
            G : {name:"Guanin", class:"guanin mRNA", src:"gm.png"},
            U : {name:"Uracil", class:"uracil mRNA", src:"um.png"}
        }
}

var dObj = {
    duration: 1000,  // Average animation time in Brownian motion
    length: 2,        // Average length in percent relative to screen height or width in Brownian motion animation.
    wrongFeedbackTriggered: false,
    idOfWronglyMovedNeucleotide: null,
    idOfLastMovedNeucleotide: null
};



function basicPosCalc(){

    window.transcriptionContainer_pos = $('#transcriptionContainer').position();
    $('#xPos').html(transcriptionContainer_pos.left);
    $('#yPos').html(transcriptionContainer_pos.top);

    window.transcriptionContainer_offset = $('#transcriptionContainer').offset();
    $('#xOffset').html(transcriptionContainer_offset.left);
    $('#yOffset').html(transcriptionContainer_offset.top);
}


function randVec(length){
    return {x: length*(Math.random()-0.5), y: length*(Math.random()-0.5)};
}


// IMPORTANT: Class "draggable" (and NOT clases: "ui-draggable", "ui-draggable-handle" and "ui-draggable-dragging") makes all the problems of cloning from ouside and into a droppable.
function SimpleClone(TargetSelector) {
    var Clone = $(TargetSelector).clone().removeClass("draggable").css({
        'position': 'absolute',
        'top': 'auto',
        'left': '1%',
        'height': 'auto', // <---- NEW
        'width': '102%'    // <---- NEW
    }); // This is necessary for cloning inside the droppable to work properly!!!
    Clone = Clone.removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging draggable_neucleotide"); // This just cleans the attributes so the DOM-element looks nicer.
    return Clone;
}


function brownianMotionInit(){
    window.counter = 0;
    // var duration = dObj;
    // // var length = 6;
    // var length = 2;
    for (var n in dObj.moveObjArr){

        brownianMotion3(n, dObj.duration, dObj.length); // UNCOMMENT 24-10-2016

    }
}


// dObj.moveObjArr.push({neucleotideNo:i, x:x, y:y, brownianMotion:true, animationInfo: {x:x, y:y, angel:null, duration:null}});
function brownianMotion3(n, duration, length){

    if (dObj.moveObjArr[n].brownianMotion){

        // console.log('brownianMotion3 - counter: ' + counter);
        // ++counter;

        dObj.moveObjArr[n].animationInfo.duration = duration*Math.random() + 300;  // <------ Random instad?

        var vec = randVec(length);
        dObj.moveObjArr[n].animationInfo.x = String(vec.x + dObj.moveObjArr[n].x)+'%';
        dObj.moveObjArr[n].animationInfo.y = String(vec.y + dObj.moveObjArr[n].y)+'%';
        console.log('brownianMotion3 - dObj.moveObjArr[n].x: ' + dObj.moveObjArr[n].x + ', dObj.moveObjArr[n].y: '+dObj.moveObjArr[n].y);

        var randDeg = Math.round(180*(Math.random()-0.5));

        $( '#draggable_neucleotide_'+n ).animate({
                left: dObj.moveObjArr[n].animationInfo.x,
                top: dObj.moveObjArr[n].animationInfo.y,
                // step: function(now) {  // http://stackoverflow.com/questions/15191058/css-rotation-cross-browser-with-jquery-animate
                //     console.log('brownianMotion2 - STEP');
                //     $(this).css({
                //         transform: 'rotate(' + String(now + 180*(Math.random()-0.5)) + 'deg)'
                //     });
                // }

                // rotate: String(Math.round(180*(Math.random()-0.5)))+'deg'

                duration: dObj.moveObjArr[n].animationInfo.duration

                
                // step: function(){
                //     var randDeg = Math.round(180*(Math.random()-0.5));
                //     $('#draggable_neucleotide_'+n).animate(
                //         {rotation: 360},
                //         {
                //             // duration: 'slow',
                //             duration: 2*dObj.moveObjArr[n].animationInfo.duration,
                //             step: function(now, fx) {
                //                 $('#draggable_neucleotide_'+n).css({"transform": "rotate("+randDeg+"deg)"});
                //             }
                //         }
                //     );
                // }

            },
            function() {  // Animation complete.
                dObj.moveObjArr[n].animationInfo.angel += 5*((Math.random()-0.5)>0)?1:-1;

                $( this ).css({                                         // <---- Virker godt med animate i x og y, men er ser ud som det hakker
                        '-moz-transform': 'rotate('+dObj.moveObjArr[n].animationInfo.angel+'deg)',
                        '-webkit-transform': 'rotate('+dObj.moveObjArr[n].animationInfo.angel+'deg)',
                        'transform': 'rotate('+dObj.moveObjArr[n].animationInfo.angel+'deg)' 
                });

                // $('#draggable_neucleotide_'+n).animate(                // <---- Virker godt knap så godt med animate i x og y
                //     {rotation: 360},
                //     {
                //         // duration: 'slow',
                //         duration: 2*dObj.moveObjArr[n].animationInfo.duration,
                //         step: function(now, fx) {
                //             $('#draggable_neucleotide_'+n).css({"transform": "rotate("+randDeg+"deg)"});
                //         }
                //     }
                // );
                console.log('brownianMotion3 - ANIMATION COMPLETE');
                brownianMotion3(n, duration, length);  // UNCOMMENT 24-10-2016
            }
        );

        // setInterval(function(){ 
        //     var randDeg = Math.round(180*(Math.random()-0.5));
        //     $('#draggable_neucleotide_'+n).css({                                         
        //             '-moz-transform': 'rotate('+randDeg+'deg)',
        //             '-webkit-transform': 'rotate('+randDeg+'deg)',
        //             'transform': 'rotate('+randDeg+'deg)' 
        //     });
        // }, 1000);

        // $('#draggable_neucleotide_'+n).animate(              
        //     {rotation: 360},
        //     {
        //         // duration: 'slow',
        //         duration: 2*dObj.moveObjArr[n].animationInfo.duration,
        //         step: function(now, fx) {
        //             $('#draggable_neucleotide_'+n).css({"transform": "rotate("+randDeg+"deg)"});
        //         }
        //     }
        // );
    }
}





function giveFeedback(valid, id, callBack){
    
    // var id = $(this).prop('id').replace('draggable_neucleotide_','');


    dObj.moveObjArr[id].brownianMotion = false;

    $('#draggable_neucleotide_'+id).animate({
            left: dObj.xPos,
            top: dObj.yPos,
            duration: 0
    }, function(){
        
    });

    // $('#draggable_neucleotide_'+id).css({left: dObj.xPos, top: dObj.yPos});
    console.log('giveFeedback - id: ' + id);

    var HTML = 'Du skal anvende baseparringsprincippet kendt fra DNA replikation, men med den undtagelse at uracil erstatter thymin i mRNA. Dvs: cytosin (C) parres med guanin (G) og uracil (U) parres med thymin (T).';

    UserMsgBox("body", '<h3>Du har svaret <span class="label label-danger">Forkert!</span></h3><p>'+HTML+'</p>');

    if (!valid) {  // IMPORTANT: valid = "false" if it is the wrong draggable!
        console.log('giveFeedback - WRONG');
       
    } else {
        console.log('giveFeedback - CORRECT');

    }

    dObj.wrongFeedbackTriggered = true;
    dObj.idOfWronglyMovedNeucleotide = id;

    // dObj.userMsgBox_click = false;

    callBack();

}


function getHeightOfDnaNucleotides(){
    window.heigtObj = {};
    heigtObj.adenin = $(".basePairWrap .adenin img").height();
    heigtObj.cytosin = $(".basePairWrap .cytosin img").height();
    heigtObj.guanin = $(".basePairWrap .guanin img").height();
    heigtObj.thymin = $(".basePairWrap .thymin img").height();
    console.log('getHeightOfDraggableNucleotides - adenin: ' + heigtObj.adenin + ', cytosin: ' + heigtObj.cytosin + ', guanin: ' + heigtObj.guanin + ', thymin: ' + heigtObj.thymin);   
}



function anmateDnaMovement(){

    ++dObj.currentNucleotide;
    console.log('anmateDnaMovement - currentNucleotide: ' + dObj.currentNucleotide);

    // Only if the student is NOT finished with the execise, then...
    if (dObj.currentNucleotide < dObj.dnaArr.length){ // Only if currentNucleotide < dnaArr.length  <===> the student is NOT finished with the execise, then...

        // var TemplateNucleotide = bioObj.dna[complementaryDnaBase(dObj.dnaArr[dObj.currentNucleotide])].name.toLowerCase();
        // console.log('anmateDnaMovement - TemplateNucleotide: ' + TemplateNucleotide);

        // var TemplateNucleotide = bioObj.dna[complementaryDnaBase(dObj.dnaArr[dObj.currentNucleotide])].name.toLowerCase();
        // console.log('anmateDnaMovement - TemplateNucleotide: ' + TemplateNucleotide);

        // var ImgHeight_tmplStrand = heigtObj.TemplateNucleotide;
        // var ImgHeight_tmplStrand
        // console.log('anmateDnaMovement - height: ' + height);

        $('#transcriptionContainer').append(returnDnaBasePair(dObj.currentNucleotide));  // <----- Append the new basepair - then set the width to 0%!!!
        $(".basePairWrap:last").css({width: '0%'});

        $(".basePairWrap:last").animate({
            width: '5%',
            // backgroundColor: '#F00',
            duration: 400
        }, function(){
            
        });

        var height1 = $(".basePairWrap .codingStrand img").eq(0).height();
        console.log('anmateDnaMovement - height1: ' + height1);
        var height2 = $(".basePairWrap .templateStrand img").eq(0).height();
        console.log('anmateDnaMovement - height2: ' + height2);

        $(".basePairWrap:first .codingStrand img").height(height1+'px');
        $(".basePairWrap:first .templateStrand img").height(height2+'px');

        $(".basePairWrap:first").eq(0).animate({
            width: '0%',
            duration: 400
        }, function(){
            $(this).remove();
            $('.draggable_neucleotide').fadeOut(function(){
                
            });

            addDraggableNeucleotides();
            setEventhandlers();   // Reset all eventhandlers - the line above is NOT enough!

            brownianMotion3(dObj.idOfLastMovedNeucleotide, dObj.duration, dObj.length);  // This is needed to make the correctly dropped neucleotide move again AFTER is has been added by the lines above. 
            
        });



        // $(".basePairWrap").eq(0).animate({
        //     marginLeft: '-5%',
        //     opacity: '0',
        //     duration: 5000
        // });

    } else {

        UserMsgBox("body", 'Tillykke du er færdig med øvelsen! (kursist ser video af mRNA forlade cellekærnen)');

    }
    
    
}


function isDraggableValid(){
    // dObj.currentDraggableNeucleotide
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
            console.log('card - REVERT');

            var id = $(this).prop('id').replace('draggable_neucleotide_','');   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
            console.log('draggable_neucleotide - mousedown - id: ' + id);

            dObj.idOfLastMovedNeucleotide = id;

            // ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
            // SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
            if(valid) {
                console.log("Dropped in a valid location - SUCCESS");
                // console.log("Dropped in a valid location - valid: " + JSON.stringify(valid));
                // correct_sound();

                dObj.moveObjArr[id].brownianMotion = false;

                // TEST TIL KOPIERING:
                // <div class="neucleotide correct_mRNA adenin mRNA mRNA_string"><img class="img-responsive" src="img/am.png"></div>
                // <div class="neucleotide correct_mRNA cytosin mRNA mRNA_string"><img class="img-responsive" src="img/cm.png"></div>
                // <div class="neucleotide correct_mRNA guanin mRNA mRNA_string"><img class="img-responsive" src="img/gm.png"></div>
                // <div class="neucleotide correct_mRNA uracil mRNA mRNA_string"><img class="img-responsive" src="img/um.png"></div>


                $(".templateStrandWrap").eq(10).append(SimpleClone($(this)).addClass("mRNA_string"));  // Append the cloned draggable to dropzone
                $(this).remove();                                               // Remove the original draggable

                $(".templateStrandWrap:eq(10) .mRNA_string").removeAttr('style id');  // Remove all inline style AND the id!!!

                anmateDnaMovement();
                
            }
            else {
                console.log("Dropped in a invalid location - FALIURE");
                // console.log("Dropped in a invalid location - valid: " + JSON.stringify(valid));
                // error_sound();

                if (!dObj.isCurrentDraggableCorrect) {

                    giveFeedback(valid, id, function(valid){  // <------ VIRKER IKKE! Funktionen "delay()" i "giveFeedback()" returnere rigtig nok sit callback når userMsgBox er lukket, men console.log() i MARK (#1#) exekveres med det samme! LØSNING: animer at nukleotiderne flyver tilbage på plads manuelt! ()
                        console.log('revert - valid - giveFeedback');

                        // This makes the neucleotide move again:
                        // dObj.moveObjArr[id].brownianMotion = true;
                        // brownianMotion3(id, dObj.duration, dObj.length);  // UNCOMMENT 24-10-2016
                        
                    });

                


                    //////////////////////////////////////////////////////////////////////////////////
                    //
                    //  FORHINDRE "REVERT" - se: http://stackoverflow.com/questions/7056520/with-jquery-uis-draggable-how-do-you-change-the-revert-on-stop
                    //
                    //  (efter at "revert" er forhindret efter ovenstående metode, så skal draggable animeres tilbage på plads!)
                    //
                    //  HUSK AT UKOMMENTERE (forneden):
                    //  dObj.moveObjArr[id].brownianMotion = true;
                    //  brownianMotion3(id, dObj.duration, dObj.length);  // UNCOMMENT 24-10-2016
                    //
                    ////////////////////////////////////////////////////////////////////////////////// 


                    // alert("Reverting!");  // <----- EN HELT ALMINDELIG ALERT VIRKER!!!


                    var id = $(this).prop('id').replace('draggable_neucleotide_','');
                    console.log('card - REVERT - id: ' + id);
                    dObj.moveObjArr[id].brownianMotion = true;
                    $(this).width(dObj.moveObjArr[id].width);    // Re-ajust the width, since JQuery wants to set a new width
                    $(this).height(dObj.moveObjArr[id].height);  // Re-ajust the height, since JQuery wants to set a new height
                    
                    // This makes the neucleotide move again:
                    // dObj.moveObjArr[id].brownianMotion = true;
                    // brownianMotion3(id, dObj.duration, dObj.length);  // UNCOMMENT 24-10-2016
                } else {

                    // This makes the correct neucleotide move again:
                    dObj.moveObjArr[id].brownianMotion = true;
                    brownianMotion3(id, dObj.duration, dObj.length);  // added 04-11-2016

                }
            }
            console.log('valid - giveFeedback - END');  // MARK (#1#)
            
            // return !valid;
            return false;  // returning "false" prevents revert from happening (eventhough the "revert"-event is called).
        },
        start: function(event, ui) {
            console.log('card - START');

            // var id = $(this).prop('id').replace('draggable_neucleotide_','');
            // $('#draggable_neucleotide_'+id).draggable( "option", "revert", false );   // <--- 28-10-2016: Dette virker (dvs "revert" slås fra), men det er så ikke muligt at tjekke svar!

            var baseClass = $(this).attr('class');
            console.log('start - baseClass: ' + baseClass);

            dObj.isCurrentDraggableCorrect = (baseClass.indexOf('correct_mRNA') !== -1)? true : false;

            for (var n in bioObj.mRNA){
                if (baseClass.indexOf(bioObj.mRNA[n].name.toLowerCase()) !== -1){
                    dObj.currentDraggableNeucleotide = bioObj.mRNA[n].name.toLowerCase();
                } 
            }
            console.log('start - currentDraggableNeucleotide: ' + dObj.currentDraggableNeucleotide);
        },
        stop: function(event, ui) {
            console.log('card - STOP');

            var id = $(this).prop('id').replace('draggable_neucleotide_','');  
            console.log('card - DRAG - id: ' + id);

            // $('#draggable_neucleotide_'+id).draggable( "option", "revert", true );

            
            // dObj.moveObjArr[id].animationInfo.drag = false;


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

            var id = $(this).prop('id').replace('draggable_neucleotide_','');  
            console.log('card - DRAG - id: ' + id);

            var offset = $(this).position();
            dObj.xPos = offset.left;
            dObj.yPos = offset.top;


            // dObj.moveObjArr[id].animationInfo.drag = true;


            // var id = $(this).prop('id').replace('draggable_neucleotide_','');  // <------- MARK (#3b#) - IMPORTANT: This is not good - (#3a#) is better. The reason is that if the user 
            // console.log('card - DRAG - id: ' + id);
            // dObj.moveObjArr[id].brownianMotion = false;
            
            // dObj.moveObjArr[id].animationInfo.angel = 0;
            // $( this ).css({                                         // <---- Virker godt med animate i x og y, men er ser ud som det hakker
            //     '-moz-transform': 'rotate('+dObj.moveObjArr[id].animationInfo.angel+'deg)',
            //     '-webkit-transform': 'rotate('+dObj.moveObjArr[id].animationInfo.angel+'deg)',
            //     'transform': 'rotate('+dObj.moveObjArr[id].animationInfo.angel+'deg)' 
            // });
        }
    });

    $( "#dropZone" ).droppable({
        accept: ".correct_mRNA",

        drop: function(event, ui) {
            console.log('card - DROP');
            // window.dropZoneObj = $(this);
        } 
    });


    // WORKAROUND - PART 1/2 - see: MARK (#3a#) and MARK (#3b#):
    // If the following action is placed inside the "drag" property of "$('.draggable_neucleotide').draggable()" above, then the following problems occur:
    //      (1)  If you only perform a mousedown action (but not a drag), then the animate() still makes the neucleotide move.
    //      (2)  If you only perform a mousedown action (but not a drag), then the size (width and height) of the neucleotide may be altered due to the movement.
    $(document).on('mousedown', ".draggable_neucleotide", function(event) {
        console.log('draggable_neucleotide - mousedown - CALLED');
        var id = $(this).prop('id').replace('draggable_neucleotide_','');   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
        console.log('draggable_neucleotide - mousedown - id: ' + id);
        dObj.moveObjArr[id].brownianMotion = false;
        dObj.moveObjArr[id].animationInfo.mousedown = true;
        console.log('draggable_neucleotide - mousedown - dObj.moveObjArr['+id+'].animationInfo: ' + JSON.stringify(dObj.moveObjArr[id].animationInfo));

        // $( this ).stop( true, true );  // This is an attempt to stop the animation of the neucleotide when it gets mousedown 
        
        dObj.moveObjArr[id].animationInfo.angel = 0;
        $( this ).css({                                         // <---- Virker godt med animate i x og y, men er ser ud som det hakker
            '-moz-transform': 'rotate('+dObj.moveObjArr[id].animationInfo.angel+'deg)',
            '-webkit-transform': 'rotate('+dObj.moveObjArr[id].animationInfo.angel+'deg)',
            'transform': 'rotate('+dObj.moveObjArr[id].animationInfo.angel+'deg)' 
        });
    });

    // WORKAROUND - PART 2/2 - see: MARK (#3a#) and MARK (#3b#):
    // This is set in place so that the neucleotide will return to its origanel state, in the event that you only perform a mousedown action (but not a drag):
    // $(document).on('mouseup', ".draggable_neucleotide", function(event) {  // transcriptionContainer
    $(document).on('mouseup', ".draggable_neucleotide", function(event) {
        console.log('draggable_neucleotide - mouseup - CALLED');
        var id = $(this).prop('id').replace('draggable_neucleotide_','');   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
        console.log('draggable_neucleotide - mouseup - id: ' + id);

        // dObj.moveObjArr[id].brownianMotion = true;  // 24-10-2016 - This causes a problem if the it is the correct neucleotide!

        if ((typeof(dObj.moveObjArr[id].animationInfo.mousedown)!=='undefined') && (dObj.moveObjArr[id].animationInfo.mousedown)) {  // If "drag" is defined AND false (false because the user has not dragged the nucleotide (only mousedown) )
            console.log('draggable_neucleotide - mouseup - RETURN TO STATE');
            dObj.moveObjArr[id].brownianMotion = true;
            $(this).width(dObj.moveObjArr[id].width);    // Re-ajust the width, since JQuery wants to set a new width
            $(this).height(dObj.moveObjArr[id].height);  // Re-ajust the height, since JQuery wants to set a new height
            // brownianMotion3(id, dObj.duration, dObj.length);  // UNCOMMENT 24-10-2016
            // dObj.moveObjArr[id].animationInfo.mousedown = false;
        }
        console.log('draggable_neucleotide - mouseup - dObj.moveObjArr['+id+'].animationInfo: ' + JSON.stringify(dObj.moveObjArr[id].animationInfo));
    });


    $(document).on('click', ".MsgBox_bgr", function(event) {

        if (dObj.wrongFeedbackTriggered){

            // This makes the neucleotide move again after failed attempt to drag:
            dObj.moveObjArr[dObj.idOfWronglyMovedNeucleotide].brownianMotion = true;
            brownianMotion3(dObj.idOfWronglyMovedNeucleotide, dObj.duration, dObj.length);  // UNCOMMENT 24-10-2016

            dObj.wrongFeedbackTriggered = false;
        }
    });

    $(document).on('click', "#UserMsgBox", function(event) {
        if (dObj.wrongFeedbackTriggered){

            // This makes the neucleotide move again after failed attempt to drag:
            dObj.moveObjArr[dObj.idOfWronglyMovedNeucleotide].brownianMotion = true;
            brownianMotion3(dObj.idOfWronglyMovedNeucleotide, dObj.duration, dObj.length);  // UNCOMMENT 24-10-2016

            dObj.wrongFeedbackTriggered = false;
        }
    });
}


function complementaryDnaBase(base){
    var compBase = {"A":"T", "T":"A", "G":"C", "C":"G" };
    return compBase[base];
}


function returnDnaBasePair(n){
    console.log('returnDnaBasePair - n: ' + n + ', dnaArr['+n+']' + dObj.dnaArr[n] + ', bioObj.dna[dObj.dnaArr['+n+']].name: ' + bioObj.dna[dObj.dnaArr[n]].name + ', dna[complementaryDnaBase(dObj.dnaArr['+n+'])].name: ' + bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].name);
    return '<div class="basePairWrap"><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'"><img class="img-responsive" src="img/'+bioObj.dna[dObj.dnaArr[n]].src.codingStrand+'"></div>  <div class="templateStrandWrap"><div class="neucleotide templateStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'"><img class="img-responsive" src="img/'+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].src.templateStrand+'"></div></div></div>';    
}


function initTransription(){

    // dObj.dnaArr = dna.split('');  
    dObj.dnaArr = jsonData.codingStrand.split('');
    console.log('initTransription - dnaArr: ' + dObj.dnaArr);

    

    var HTML = '';
    HTML += '<div class="fadeOut fadeOut_left"></div>';
    HTML += '<div id="dropZone"></div>';
    // for (var n in dObj.dnaArr){
    for (var n = 0; n < 20; n++) {
        // HTML += '<div class="neucleotideWrap"><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'">'+dObj.dnaArr[n]+'</div></div>';
        // HTML += '<div class="basePairWrap"><div class="neucleotide complementaryStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'">'+complementaryDnaBase(dObj.dnaArr[n])+'</div><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'">'+dObj.dnaArr[n]+'</div></div>';
        // HTML += '<div class="basePairWrap"><div class="neucleotide templateStrand '+bioObj.dna[dObj.dnaArr[n]].class+'">'+dObj.dnaArr[n]+'</div><div class="neucleotide codingStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'">'+complementaryDnaBase(dObj.dnaArr[n])+'</div></div>'; 
        // HTML += '<div class="basePairWrap"><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'"><img class="img-responsive" src="img/'+bioObj.dna[dObj.dnaArr[n]].src.codingStrand+'"></div><div class="neucleotide templateStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'"><img class="img-responsive" src="img/'+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].src.templateStrand+'"></div></div>';    
        
        // HTML += '<div class="basePairWrap"><div class="neucleotide codingStrand '+bioObj.dna[dObj.dnaArr[n]].class+'"><img class="img-responsive" src="img/'+bioObj.dna[dObj.dnaArr[n]].src.codingStrand+'"></div>  <div class="templateStrandWrap"><div class="neucleotide templateStrand '+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].class+'"><img class="img-responsive" src="img/'+bioObj.dna[complementaryDnaBase(dObj.dnaArr[n])].src.templateStrand+'"></div></div></div>';    
        HTML += returnDnaBasePair(n);

        dObj.currentNucleotide = n;
    }
    HTML += '<div class="fadeOut fadeOut_right"></div>';
    // HTML += '<div class="Clear"></div>';
    return HTML;
}


function correctmRnaNucleotide(){
    // $('#dropZone').css({position: 'absolute', left: '50%'});  // <----- NOTE: not needed since this is set in CSS, but is added here for clarity...

    // var startNeucleotideNo = Math.round(20 * 50/100); // <---- 20 neucleotide in the x-direction times 50% = 50/100, because this is the position of the dropZone i the x-direction.
    var startNeucleotideNo = dObj.currentNucleotide-9;  // <--- IPORTANT NOTE: "dObj.currentNucleotide" is always the right-most visible nucleotide (seen relative to the "dnaArr"), whereas startNeucleotideNo is almost in the center for the frame - therefore the "-9" ajustment is needed!
    var neucleotideInDna = complementaryDnaBase(dObj.dnaArr[startNeucleotideNo]);
    console.log('correctmRnaNucleotide - neucleotideInDna: ' + neucleotideInDna);

    var compBase = {"A":"U", "T":"A", "G":"C", "C":"G" };

    return compBase[neucleotideInDna];
}


function shuffelArray(ItemArray) {
    var NumOfItems = ItemArray.length;
    var NewArray = ItemArray.slice(); // Copy the array...
    var Item2;
    var TempItem1;
    var TempItem2;
    for (var Item1 = 0; Item1 < NumOfItems; Item1++) {
        Item2 = Math.floor(Math.random() * NumOfItems);
        TempItem1 = NewArray[Item1];
        TempItem2 = NewArray[Item2];
        NewArray[Item2] = TempItem1;
        NewArray[Item1] = TempItem2;
    }
    return NewArray;
}


function randomlySpacedVec(){

    // This is what this function is trying to acchive (in array-form):
    // var x = Math.round(Math.random()*90 + 5);
    // var y = Math.round(Math.random()*10 + 5);

    if ((typeof(dObj.vecObj)==='undefined') || ((typeof(dObj.moveObjArr)!=='undefined') && (dObj.moveObjArr.length == 0))) {
        var xArr = [];
        var yArr = [];

        for (var i = 1; 5*i < 90; i++) { xArr.push(5*i+5); }
        for (var i = 1; i < 10; i++) { yArr.push(i+5); }

        dObj.vecObj = {xArr: shuffelArray(xArr), yArr: shuffelArray(yArr), x: null, y: null};
    }

    dObj.vecObj.x = dObj.vecObj.xArr.splice(0, 1)[0];

    dObj.vecObj.y = dObj.vecObj.yArr.splice(0, 1)[0];

    console.log('randomlySpacedVec - vecObj: ' + JSON.stringify(dObj.vecObj));
    // console.log('randomlySpacedVec - yArr: ' + dObj.vecObj.yArr);
    
    return {x:dObj.vecObj.x, y:dObj.vecObj.y};
}
console.log('randomlySpacedVec 1: ' + randomlySpacedVec());
console.log('randomlySpacedVec 2: ' + randomlySpacedVec());
console.log('randomlySpacedVec 3: ' + randomlySpacedVec());



function addDraggableNeucleotides(){
    $('.draggable_neucleotide').remove(); // Remove previous neucleotides...

    var count = 0;
    var HTML = '';
    for (var n in bioObj.mRNA){
        console.log('addDraggableNeucleotides - n: ' + n);
        // HTML += '<div id="draggable_neucleotide_'+count+'" class="neucleotide draggable_neucleotide '+((n==correctmRnaNucleotide())?'correct_mRNA':'')+' '+bioObj.mRNA[n].class+'">'+n+'</div>';
        HTML += '<div id="draggable_neucleotide_'+count+'" class="neucleotide draggable_neucleotide '+((n==correctmRnaNucleotide())?'correct_mRNA':'')+' '+bioObj.mRNA[n].class+'"><img class="img-responsive" src="img/'+bioObj.mRNA[n].src+'"></div>';
        ++count;
    }
    $('#transcriptionContainer').append(HTML);

    console.log('addDraggableNeucleotides - count: ' + count);

    dObj.moveObjArr = [];
    for (var i = 0; i < count; i++) {
        // var x = Math.round(Math.random()*90 + 5);
        // var y = Math.round(Math.random()*15);

        // var x = Math.round(Math.random()*90 + 5);  // <----- OK! 28-10-2016
        // var y = Math.round(Math.random()*10 + 5);  // <----- OK! 28-10-2016

        var Tvec = randomlySpacedVec();
        var x = Tvec.x;
        var y = Tvec.y;
        if (Math.random() <= 0.5){
            $('#draggable_neucleotide_'+i).css({position: 'absolute',top: String(y)+'%', left: String(x)+'%'});
        } else {
            y = y + 70;
            $('#draggable_neucleotide_'+i).css({position: 'absolute',top: String(y)+'%', left: String(x)+'%'});
        }
    
        // var width = $('#draggable_neucleotide_'+i).width();
        // var height = $('#draggable_neucleotide_'+i).height();

        // dObj.moveObjArr.push({neucleotideNo:i, x:x, y:y, angle:0, brownianMotion:true});
        dObj.moveObjArr.push({neucleotideNo:i, x:x, y:y, width:'5%', height:'10%', brownianMotion:true, animationInfo: {x:x, y:y, angel:null, duration:null}});


        dObj.moveObjArr[i].animationInfo.angel += 45*(Math.random()-0.5);

        $('#draggable_neucleotide_'+i).css({                                         // <---- Virker godt med animate i x og y, men er ser ud som det hakker
                '-moz-transform': 'rotate('+dObj.moveObjArr[i].animationInfo.angel+'deg)',
                '-webkit-transform': 'rotate('+dObj.moveObjArr[i].animationInfo.angel+'deg)',
                'transform': 'rotate('+dObj.moveObjArr[i].animationInfo.angel+'deg)' 
        });
    };

    console.log('addDraggableNeucleotides - dObj.moveObjArr: ' + JSON.stringify(dObj.moveObjArr));
}


function addDraggableNeucleotides2(){

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

    getHeightOfDnaNucleotides();
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

    getHeightOfDnaNucleotides();

    brownianMotionInit();
    
});

