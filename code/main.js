import gorilla = require("gorilla/gorilla");

// Make sure to upload the jsPsych files you need to the resources tab.
// This should include the main jsPsych.js, jsPsych.css and likely at least one plugin. 
// In this case, we use the jspsych-html-keyboard-response.js plugin file.
let jsPsych = window['jsPsych'];



gorilla.ready(function(){
    let feedback_text = "";
    
    // Method to check if the participant agreed to the terms of the informed consent
    let check_consent = function(elem){
        if (document.getElementById('consent_checkbox').checked && document.getElementById('age_checkbox').checked){
            return true;
        }
        Swal.mixin({
            title: "Error",
            text: "Als u wenst deel te nemen aan het onderzoek dient u akkoord te gaan met de informed consent.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        }).fire();
        return false;
    }
    
    // Method to save the feedback from the textfield to the property so that it can be saved to the data by the jsPsych plugin
    let check_feedback = function(elem){
        feedback_text = document.getElementById('feedback').value;
        return true;
    }
    
    
    // Debug variables to disable parts of the experiment for quicker testing
    let informatie_enabled = true;
    let kalibratie_enabled = true;
    let oefentrial_enabled = true;
    let trials_enabled = true;
    
    // Debug variable to enable/disable the contextmenu on the videos
    // When true you can right click on videos and enable controls for quicker testing
    let manualvideocontrols = false;
    if (!manualvideocontrols) {
        document.addEventListener('contextmenu', e => {
          e.preventDefault();
        });
    }

    // Initialize timeline
	let timeline = []; 
	
    // Preload all stimuli (not included in this repo)
    let preload = {
        type: 'preload',
        message: `
            <p>De video's worden nu geladen.</p>
            <p>Dit kan enkele minuten duren.</p>
        `,
        show_progress_bar: true,
        continue_after_error: true,
        video: [
            gorilla.stimuliURL("Introductie.mp4"),
            gorilla.stimuliURL("niveau1_cakebakken.mp4"),
            gorilla.stimuliURL("niveau1_dierentuin.mp4"),
            gorilla.stimuliURL("niveau1_mijnfamilie.mp4"),
            gorilla.stimuliURL("niveau2_brandmelding.mp4"),
            gorilla.stimuliURL("niveau2_opheffeest.mp4"),
            gorilla.stimuliURL("niveau2_weerbericht.mp4"),
            gorilla.stimuliURL("niveau3_ambassades.mp4"),
            gorilla.stimuliURL("niveau3_brexit.mp4"),
            gorilla.stimuliURL("niveau3_socialmedia.mp4"),
        ],
    };
	
/*
Information for participants
Contains: letter of information, informed consent, questionnaire
*/
    // Letter with general information about the experiment
    let informatiebrief = {
        type: 'html-button-response',
        stimulus: `
            <div style="max-width: 80%; text-align: left; margin: auto;">
            <h1>Informatiebrief</h1>
            <p>Beste deelnemer,
            <br/>
            <p>Bedankt voor uw deelname aan dit onderzoek.
            <br/>
            <br/>In dit onderzoek krijgt u video’s te zien waarin een moedertaalspreker van de Nederlandse Gebarentaal iets vertelt over verschillende onderwerpen. Na elke video krijgt u twee vragen over wat er in de video verteld is. De bedoeling is om het antwoord te kiezen dat volgens u juist is. 
            <br/>
            <br/>Tijdens dit onderzoek staat de webcam aan zodat wij kunnen meten waar u naar kijkt. U wordt niet gefilmd, de webcam wordt alleen gebruikt om de oogbewegingen te kunnen meten. Verder is het onderzoek volledig anoniem. Wanneer u het onderzoek start moet deze in één keer worden afgemaakt.
            <br/>
            <br/>LET OP! Sluit programma’s af die ook uw webcam gebruiken. Als het onderzoek niet werkt start het dan opnieuw op door de pagina te vernieuwen.
            <br/>
            <br/>Het onderzoek duurt ongeveer 20 minuten. Onder de deelnemers zullen willekeurig drie cadeaukaarten worden verloot. Aan het einde krijgt u de optie om eventueel opmerkingen te maken.</p>
            </br>
            <p>Bij vragen met betrekking tot dit onderzoek kunt u contact opnemen met onze projectleider Jessica Heeman via het volgende e-mailadres (J.heeman@uu.nl).</p>
            </br>
            <p>Met vriendelijke groet,
            </br>Mick Richters, Puck Rutten, Björn van Vliet & Mark Wessel</p>
            </div>
        `,
        choices: ["Doorgaan"],
        data: {
            task: "informatie-informatiebrief",
            stimulus: "NVT"
        }
    }
    
    // Informed consent
    let consentform = {
        type: 'external-html',
        url: gorilla.resourceURL('consent.html'),
        cont_btn: "start",
        check_fn: check_consent,
        data: {
            task: "informatie-consentform"
        }
    }
    
    // Feedback form at the end of the experiment
    let feedback = {
        type: 'external-html',
        url: gorilla.resourceURL('feedback.html'),
        cont_btn: "end",
        css_classes: ['no_scaling'],
        check_fn: check_feedback,
        data: {
            task: "einde-feedback"
        },
        on_finish: function(data) {
            data.feedback = feedback_text;
        }
        
    }
    
    // Giftcard lottery entree form
    let cadeaubon = {
        type: 'external-html',
        url: gorilla.resourceURL('cadeaubon.html'),
        cont_btn: "end",
        css_classes: ['no_scaling'],
        data: {
            task: "einde-feedback"
        }
        
    }
    
    // Questionnaire for demographic purposes
    let vragenlijst = {
        type: 'survey-html-form',
        preamble: "Gelieve deze vragenlijst in te vullen alvorens aan het experiment deel te nemen.",
        html: `
            <div class='uu-form-container'>
                <div class='form-group row'>
                    <label class='col-6 col-form-label'>Wat is uw geslacht?</label> 
                    <div class='col-5'>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='geslacht' id='geslacht_0' type='radio' class='custom-control-input' value='man' required='required'>
                                <label for='geslacht_0' class='custom-control-label'>Man</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='geslacht' id='geslacht_1' type='radio' class='custom-control-input' value='vrouw' required='required'>
                                <label for='geslacht_1' class='custom-control-label'>Vrouw</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='geslacht' id='geslacht_2' type='radio' class='custom-control-input' value='anders' required='required'>
                                <label for='geslacht_2' class='custom-control-label'>Anders</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='form-group row'>
                    <label class='col-6 col-form-label' for='geboortejaar'>Wat is uw geboortejaar?</label> 
                    <div class='col-5'>
                        <input id='geboortejaar' name='geboortejaar' type='number' class='form-control' required='required'>
                    </div>
                </div>
                <div class='form-group row'>
                    <label class='col-6 col-form-label'>Wat is uw horendheid?</label> 
                    <div class='col-5'>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='horendheid' id='horendheid_0' type='radio' class='custom-control-input' value='horend' required='required'>
                                <label for='horendheid_0' class='custom-control-label'>Horend</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='horendheid' id='horendheid_1' type='radio' class='custom-control-input' value='doof' required='required'>
                                <label for='horendheid_1' class='custom-control-label'>Doof/slechthorend</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='form-group row'>
                    <label for='tolk' class='col-6 col-form-label'>Hoe vaak gebruikt u een tolk?</label> 
                    <div class='col-5'>
                        <input id='tolk' name='tolk' placeholder='3 keer per dag/week/maand' type='text' aria-describedby='tolkHelpBlock' class='form-control'>
                        <span id='tolkHelpBlock' class='form-text text-muted' style='font-size: 1.3rem;font-weight: lighter;'>Alleen invullen indien u doof/slechthorend bent.</span>
                     </div>
                </div>
                <div class='form-group row'>
                    <label class='col-6 col-form-label'>Wat is uw moedertaal?</label> 
                    <div class='col-5'>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='moedertaal' id='moedertaal_0' type='radio' required='required' class='custom-control-input' value='nederlands'>
                                <label for='moedertaal_0' class='custom-control-label'>Nederlands</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='moedertaal' id='moedertaal_1' type='radio' required='required' class='custom-control-input' value='ngt'>
                                <label for='moedertaal_1' class='custom-control-label'>Nederlandse Gebarentaal</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='moedertaal' id='moedertaal_2' type='radio' required='required' class='custom-control-input' value='anders'>
                                <label for='moedertaal_2' class='custom-control-label'>Anders, namelijk: <input name='anderetaal' id='anderetaal_1' type='text' class='form-control'></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='form-group row'>
                    <label class='col-6 col-form-label'>Welke term(en) is/zijn toepasbaar op uw NGT niveau?</label> 
                    <div class='col-5'>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='jaar1' type='checkbox' class='custom-control-input' value='jaar1'>
                                <label for='jaar1' class='custom-control-label'>Eerstejaars NGT student</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='jaar2' type='checkbox' class='custom-control-input' value='jaar2'>
                                <label for='jaar2' class='custom-control-label'>Tweedejaars NGT student</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='jaar3' type='checkbox' class='custom-control-input' value='jaar3'>
                                <label for='jaar3' class='custom-control-label'>Derdejaars NGT student</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='jaar4' type='checkbox' class='custom-control-input' value='jaar4'>
                                <label for='jaar4' class='custom-control-label'>Vierdejaars NGT student</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='minor' type='checkbox' class='custom-control-input' value='minor'>
                                <label for='minor' class='custom-control-label'>Minor NGT</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='tolk' type='checkbox' class='custom-control-input' value='tolk'>
                                <label for='tolk' class='custom-control-label'>Tolk</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='docent' type='checkbox' class='custom-control-input' value='docent'>
                                <label for='docent' class='custom-control-label'>Docent</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='moedertaal' type='checkbox' class='custom-control-input' value='moedertaal'>
                                <label for='moedertaal' class='custom-control-label'>Moedertaal spreker</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-checkbox'>
                                <input name='niveau' id='anderniveau' type='checkbox' class='custom-control-input' value='anderniveau'>
                                <label for='anderniveau' class='custom-control-label'>Anders, namelijk: <input name='anderniveau_1' id='anderniveau_1' type='text' class='form-control'></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='form-group row'>
                    <label class='col-6 col-form-label'>Draagt u een bril?</label> 
                    <div class='col-5'>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='bril' id='bril_0' type='radio' class='custom-control-input' value='ja' required='required'>
                                <label for='bril_0' class='custom-control-label'>Ja</label>
                            </div>
                        </div>
                        <div class='custom-controls-stacked text-start'>
                            <div class='custom-control custom-radio'>
                                <input name='bril' id='bril_1' type='radio' class='custom-control-input' value='nee' required='required'>
                                <label for='bril_1' class='custom-control-label'>Nee</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        data: {
            task: "informatie-vragenlijst"
        },
    }
/*
End information for participants
*/

/*
Calibration sequence
Contains: init-camera, virtual-chinrest, calibration, validation, html-button-response
*/
    // Instructions about camera initialization
    let init_instruction = {
        type: 'html-button-response',
        stimulus: `
            <p>Om optimale prestatie van uw webcam te bereiken gaat u nu eerst een kalibratie doorlopen.</p>
            <p>De kalibratie bestaat uit 3 stappen en u krijgt uitleg bij iedere stap. Zorg dat u een pas ter grootte van bijvoorbeeld een ov-chipkaart, bibliotheekpas, ID-kaart of iets vergelijkbaars bij de hand heeft voor stap 2.</p>
            <p>Zodra de kalibratie begint wordt uw webcam aangezet, dit kan een paar minuten duren.</p>
        `,
        choices: ["Kalibratie beginnen"],
        data: {
            task: "kalibratie-init-instructies",
            stimulus: "NVT"
        }
    }

    // First step of calibration sequence, this is also where the browser asks consent to use the camera
    let init_camera = {
        type: "webgazer-init-camera",
        instructions: `<p>Positioneer uw hoofd zo precies mogelijk in het vak op het camerabeeld.
                       <br/>U kunt verder gaan als het vak groen is.</p>`,
        button_text: "Doorgaan",
        data: {
            task: "kalibratie-hoofdpositionering"
        },
    }
    
    // Instructions for the virtual chinrest
    let chinrest_instruction = {
        type: 'html-button-response',
        stimulus: `
            <p>Om te zorgen dat de video's het goede formaat op uw scherm hebben moeten we uw schermgrootte en afstand tot het scherm bepalen.</p>
        `,
        choices: ["Doorgaan"],
        data: {
            task: "kalibratie-chinrest-instructies",
            stimulus: "NVT"
        }
    }
	
    // Second and third steps of calibration sequence, determine distance to screen and screen size
	let deg_resize = {
      type: "virtual-chinrest",
      blindspot_reps: 5,
      resize_units: "deg",
      item_path: gorilla.resourceURL("card.png"),
      pixels_per_unit: 50,
      adjustment_prompt: `
        <p>Hou een pas ter grootte van bijvoorbeeld een ov-chipkaart, bibliotheekpas, ID-kaart of iets vergelijkbaars tegen uw beeldscherm.</p>
        <p>Sleep de rechter benedenhoek van de afbeelding tot deze dezelfde grootte heeft als de pas.</p>
        <p>Als u geen pas heeft kunt u met een liniaal de afbeelding meten tot een breedte van 85.6mm.</p>
      `,
      adjustment_button_prompt: "Klik hier als de afbeelding de correcte grootte heeft",
      blindspot_prompt: `
        <p>Nu gaan we meten hoe ver u van het scherm af zit.</p>
        <ol style="text-align: left">
          <li>Leg uw <b>linker</b> hand op de <b>spatiebalk</b>.</li>
          <li>Bedek uw <b>rechter</b> oog met uw <b>rechter</b> hand.</li>
          <li>Met uw <b>linker</b> oog, focus op het <b>zwarte vierkant</b>. Houdt uw focus op het zwarte vierkant.</li>
          <li>De <span style="color: #ff0000; font-weight:bold;">rode bal</span> zal verdwijnen naarmate deze naar links beweegt. Druk op de spatiebalk zodra de bal verdwijnt.</li>
            <li>Als de <span style="color: #ff0000; font-weight:bold;">rode bal</span> niet verdwijnt moet u iets dichter bij uw scherm gaan zitten.</li>
        </ol>
        <p>We zullen deze meting 5 keer achter elkaar doen.
        <br/>Druk op de spatiebalk als u klaar bent om te beginnen.
        <br/>(Als spatiebalk niet werkt dan moet u 1 keer op het scherm klikken.)</p>
      `,
      redo_measurement_button_label: "Nee, dit klopt niet. Nogmaals proberen",
      blindspot_done_prompt: "Ja",
      blindspot_measurements_prompt: "Resterende metingen: ",
      viewing_distance_report: "Op basis van uw antwoorden schatten wij uw afstand van het scherm op <span id='distance-estimate' style='font-weight: bold;'></span>. Klopt dit ongeveer?",
      data: {
          task: "kalibratie-schermafstand"
      }
    };
    
    // Instructions about the calibration itself
    let calibration_instruction = {
        type: 'html-button-response',
        stimulus: `
            <p>De eyetracker moet nu gekalibreerd worden om het beeld van uw ogen aan een positie op uw scherm te koppelen.</p>
            <p>Om dit te doen moet u op een verzameling van punten klikken</p>
            <p>Houdt uw hoofd in dezelfde positie en klik de punten terwijl u er naar kijkt.</p>
        `,
        choices: ["Klik hier om te beginnen"],
        css_classes: ['no_scaling'],
        post_trial_gap: 1000,
        data: {
            task: "kalibratie-kalibratie-instructies",
            stimulus: "NVT"
        }
    }
    
    let calibrationpoints = [
        [10,10],
        [10,50],
        [10,90],
        [50,10],
        [50,50],
        [50,90],
        [90,10],
        [90,50],
        [90,90]
    ] // 9 points spread over screen (percentages)
    
    // Fourth step of calibration sequence
    let calibration = {
        type: "webgazer-calibrate",
        calibration_points: calibrationpoints,
        calibration_mode: "click",
        repetitions_per_point: 1,
        randomize_calibration_order: true,
        data: {
            task: "kalibratie-kalibratie"
        }
    }
    
    // Instructions for the validation step, also disables cursor at the end of this step
    let validation_instruction = {
        type: 'html-button-response',
        stimulus: `
            <p>Nu gaan we kijken hoe precies de eye tracking is.</p>
            <p>Om dit te doen moet u kijken naar een verzameling van punten.</p>
            <p>U hoeft niet te klikken. Houdt uw hoofd in dezelfde positie, en kijk naar de punten zodra ze verschijnen.</p>
            <p>Tijdens deze stap zal uw muis onzichtbaar worden.</p>
        `,
        choices: ["Klik hier om te beginnen"],
        css_classes: ['no_scaling'],
        post_trial_gap: 1000,
        data: {
            task: "kalibratie-validatie-instructies",
            stimulus: "NVT"
        },
        on_finish: function() {
            document.getElementById("gorilla").style.cursor = 'none';
        },
    }
    
    // Fifth step of calibration sequence, enabled cursor at the end of this step
    let validation = {
        type: "webgazer-validate",
        validation_points: calibrationpoints,
        validation_point_coordinates: "percent",
        roi_radius: 200,
        repetitions_per_point: 1,
        randomize_validation_order: true,
        time_to_saccade: 1000,
        validation_duration: 2000,
        point_size: 10,
        show_validation_data: false, //DEBUG_MODE
        data: {
            task: "kalibratie-validatie"
        },
        on_finish: function() {
            document.getElementById("gorilla").style.cursor = 'auto';
        }
    }
/*
End calibration sequence
*/


/*
Begin practice/introduction trial
Contains: information about practice/introduction
*/
    let oefentrial_instructie = {
        type: 'html-button-response',
        stimulus: `
            <h1>De kalibratie is voltooid</h1>
            <p>U krijgt straks 10 video's van 30-60 seconden te zien, met een pauzemoment na 5 video's. Iedere video wordt gevolgd door een aantal vragen.</p>
            <p>Probeer deze vragen zo goed mogelijk te beantwoorden. Het is niet erg als u het antwoord niet weet.</p>
            <p>Zodra u uw ingevulde antwoorden bevestigt begint de volgende video.</p>
            <p>De eerste video met vragen is een oefening, zodat u bekend bent met het experiment. Deze telt niet mee.</p>
            <p>Deze video speelt zich 1 keer automatisch af, waarna een vraag volgt.</p>
        `,
        choices: ["Beginnen met de oefenopgave"],
        css_classes: ['no_scaling'],
        data: {
            task: "practice-instructies",
            stimulus: "NVT"
        }
    }
/*
Eind oefentrial
*/

/*
Begin videotrial
Contains: instructions, fixation cross, video, questions
*/
    // Instruct participant that experiment trials will now start
    let trial_instructie = {
        type: 'html-button-response',
        stimulus: `
            <p>Het experiment gaat nu beginnen.</p>
        `,
        choices: ["Beginnen met het experiment"],
        css_classes: ['no_scaling'],
        data: {
            task: "trial-instructies",
            stimulus: "NVT"
        }
    }
    
    // Instructions after break that the last 5 trials will begin
    let postpauze_instructie = {
        type: 'html-button-response',
        stimulus: `
            <p>Het experiment gaat nu verder.</p>
            <p>U krijgt nu de resterende 5 video's te zien. Iedere video wordt wederom gevolgd door een vraag.</p>
            <p>Probeer deze vraag nogmaals zo goed mogelijk te beantwoorden. Het is niet erg als u het antwoord niet weet.</p>
        `,
        choices: ["Verder gaan met het experiment"],
        css_classes: ['no_scaling'],
        data: {
            task: "trial-instructies",
            stimulus: "NVT"
        }
    }
    
    // 1 second fixation cross
    let fixatie = {
        type: 'html-keyboard-response',
        stimulus: '<div style="font-size:60px;margin-bottom:8vh;">+</div>',
        choices: jsPsych.NO_KEYS,
        trial_duration: 1000,
        data: {
            task: "fixatie",
            stimulus: "fixatiekruis"
        },
        extensions: [
            {
                type: 'webgazer',
                params: {targets: ['.jspsych-content-wrapper']}
            }
        ]
    }
    
    var dataRects = [];

    // video
    // (DEPRECATED) dataRects is used to save the areas of interest for this participant
    let video = {
        type: "video-keyboard-response",
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: jsPsych.NO_KEYS,
        width: 1280,
        height: 720,
        autoplay: true,
        controls: false,
        trial_ends_after_video: true,
        extensions: [
            {
                type: 'webgazer',
                params: {targets: ['.jspsych-content-wrapper']}
            }
        ],
        css_classes: jsPsych.timelineVariable('css_classes'),
        on_load: function() {
            dataRects = [];
            var content = document.getElementById("jspsych-content");
            var bounds = content.getBoundingClientRect();
            var scale = bounds.width / content.offsetWidth;
            jsPsych.timelineVariable('areas_of_interest').forEach(function(roi){
                dataRects.push({
                    x: (roi.x + bounds.left),
                    y: (roi.y + bounds.top),
                    w: roi.w,
                    h: roi.h,
                    label: roi.label
                })
            });
        },
        on_finish: function(data) {
            data.task = jsPsych.timelineVariable('trial') + "-video";
            if (jsPsych.timelineVariable('stimulus')[0].includes("Introductie")) {
                data.stimulus = "Introductie.mp4";
            } else {
                data.stimulus = jsPsych.timelineVariable('stimulus')[0].match(/niveau[123]_[aA-zZ]+.mp4/g)[0];
            }
            data.areas_of_interest = dataRects;
        }
    }

    // First question after video
    let vraag1 = {
        type: 'survey-multi-choice',
        questions: [
            {prompt: jsPsych.timelineVariable('vraag1'), name: jsPsych.timelineVariable('vraagNaam1'), options: jsPsych.timelineVariable('antwoorden1'), required: true, horizontal: false}
        ],
        on_finish: function(data){
            data.task = jsPsych.timelineVariable('trial') + "-vraag";
            var correct_answer1 = jsPsych.timelineVariable("antwoord_correct1");
            data.correct_answer1 = correct_answer1;
            var given_answer1 = data.response[jsPsych.timelineVariable('vraagNaam1')];
            data.given_answer1 = given_answer1;
            data.correct1 = ((given_answer1 == correct_answer1) ? 'correct' : 'incorrect');
            
            
            if (jsPsych.timelineVariable('stimulus')[0].includes("Introductie")) {
                data.stimulus = "Introductie.mp4";
            } else {
                data.stimulus = jsPsych.timelineVariable('stimulus')[0].match(/niveau[123]_[aA-zZ]+.mp4/g)[0];
            }
        },
        css_classes: ['no_scaling'],
        extensions: [
            {
                type: 'webgazer',
                params: {targets: ['.jspsych-content-wrapper']}
            }
        ],
        button_label: 'Ga door naar vraag 2',
    }
    
    // Second question after video
    let vraag2 = {
        type: 'survey-multi-choice',
        questions: [
            {prompt: jsPsych.timelineVariable('vraag2'), name: jsPsych.timelineVariable('vraagNaam2'), options: jsPsych.timelineVariable('antwoorden2'), required: true, horizontal: false}
        ],
        on_finish: function(data){
            data.task = jsPsych.timelineVariable('trial') + "-vraag";
            var correct_answer2 = jsPsych.timelineVariable("antwoord_correct2");
            data.correct_answer2 = correct_answer2;
            var given_answer2 = data.response[jsPsych.timelineVariable('vraagNaam2')];
            data.given_answer2 = given_answer2;
            data.correct2 = ((given_answer2 == correct_answer2) ? 'correct' : 'incorrect');
            
            
            if (jsPsych.timelineVariable('stimulus')[0].includes("Introductie")) {
                data.stimulus = "Introductie.mp4";
            } else {
                data.stimulus = jsPsych.timelineVariable('stimulus')[0].match(/niveau[123]_[aA-zZ]+.mp4/g)[0];
            }
        },
        css_classes: ['no_scaling'],
        extensions: [
            {
                type: 'webgazer',
                params: {targets: ['.jspsych-content-wrapper']}
            }
        ],
        button_label: 'Ga door naar het volgende fragment',
    }
/*
End videotrial
*/

/*
Begin timeline
*/
    if (informatie_enabled) {
        timeline.push(informatiebrief);
        timeline.push(consentform);
        timeline.push(vragenlijst);
        timeline.push(preload);
    }
    
    let kalibratie = {
        timeline: [init_instruction, init_camera, chinrest_instruction, deg_resize, calibration_instruction, calibration, validation_instruction, validation]
    }
    
    if (kalibratie_enabled) {
        timeline.push(kalibratie);
    }
    
    if (oefentrial_enabled) {
        let oefentrial = {
            timeline: [oefentrial_instructie, fixatie, video, vraag1, vraag2],
            timeline_variables: [
                {
                    stimulus: [gorilla.stimuliURL("Introductie.mp4")], 
                    vraag1: "Hoe heet de spreker?",
                    vraag2: "Hoeveel filmpjes krijg je hierna nog te zien?",
                    vraagNaam1: "oefen_1",
                    vraagNaam2: "oefen_2",
                    antwoorden1: ["Anne", "Puck", "Mick", "Weet ik niet"],
                    antwoorden2: ["7 filmpjes", "8 filmpjes", "9 filmpjes", "Weet ik niet"],
                    antwoord_correct1: "Anne",
                    antwoord_correct2: "9 filmpjes",
                    trial: "oefening",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 426, y: 161, w: 458, h: 556, label: "handen"},
                        {x: 616, y: 67, w: 138, h: 160, label: "gezicht"},
                        {x: 653, y: 162, w: 57, h: 59, label: "mond"},
                        {x: 641, y: 112, w: 90, h: 42, label: "ogen"}
                    ],
                }
            ]
        }
        timeline.push(oefentrial);
    }
    
    if (trials_enabled) {
        let trial_timeline1 = {
            timeline: [fixatie, video, vraag1, vraag2],
            timeline_variables: [
                { // Trial 1
                    stimulus: [gorilla.stimuliURL("niveau1_cakebakken.mp4")], 
                    vraag1: "Wat gaat Anne bakken?",
                    vraag2: "Waarom wacht Anne voordat ze een stukje cake kan eten?",
                    vraagNaam1: "1_cakebakken_1",
                    vraagNaam2: "1_cakebakken_2",
                    antwoorden1: ["Taart", "Koekjes", "Cake", "Weet ik niet"],
                    antwoorden2: ["De cake moet nog afkoelen", "Ze heeft net gegeten", "De cake moet nog worden versierd", "Weet ik niet"],
                    antwoord_correct1: "Cake",
                    antwoord_correct2: "De cake moet nog afkoelen",
                    trial: "1_cakebakken",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 363, y: 156, w: 529, h: 539, label: "handen"},
                        {x: 579, y: 63, w: 131, h: 160, label: "gezicht"},
                        {x: 609, y: 154, w: 61, h: 50, label: "mond"},
                        {x: 602, y: 110, w: 83, h: 37, label: "ogen"}
                    ]
                    
                },
                { // Trial 2
                    stimulus: [gorilla.stimuliURL("niveau1_dierentuin.mp4")], 
                    vraag1: "Waar gaat Anne heen?",
                    vraag2: "Welke dieren noemt Anne?",
                    vraagNaam1: "1_dierentuin_1",
                    vraagNaam2: "1_dierentuin_2",
                    antwoorden1: ["Pretpark", "Dierentuin", "Dolfinarium", "Weet ik niet"],
                    antwoorden2: ["Olifant en leeuw", "Olifant en ijsbeer", "IJsbeer en leeuw", "Weet ik niet"],
                    antwoord_correct1: "Dierentuin",
                    antwoord_correct2: "Olifant en leeuw",
                    trial: "1_dierentuin",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 427, y: 167, w: 469, h: 551},
                        {x: 628, y: 84, w: 113, h: 152},
                        {x: 654, y: 181, w: 58, h: 37},
                        {x: 634, y: 122, w: 100, h: 39}
                    ]
                },
                { // Trial 3
                    stimulus: [gorilla.stimuliURL("niveau1_mijnfamilie.mp4")], 
                    vraag1: "Welk werk doen de ouders van Anne?",
                    vraag2: "Wat is Anne's hobby?",
                    vraagNaam1: "1_mijnfamilie_1",
                    vraagNaam2: "1_mijnfamilie_2",
                    antwoorden1: ["Bakker en politieman", "Politieman en boswachter", "Bakker en boswachter", "Weet ik niet"],
                    antwoorden2: ["Hockeyen", "Voetballen", "Basketballen", "Weet ik niet"],
                    antwoord_correct1: "Bakker en politieman",
                    antwoord_correct2: "Voetballen",
                    trial: "1_mijnfamilie",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 484, y: 188, w: 351, h: 503, label: "handen"},
                        {x: 596, y: 69, w: 118, h: 153, label: "gezicht"},
                        {x: 622, y: 170, w: 64, h: 44, label: "mond"},
                        {x: 607, y: 118, w: 95, h: 48, label: "ogen"}
                    ]
                    
                },
                { // Trial 4
                    stimulus: [gorilla.stimuliURL("niveau2_brandmelding.mp4")], 
                    vraag1: "Wat is er overgebleven na de brand?",
                    vraag2: "Hoe denkt de politie dat de brand is ontstaan?",
                    vraagNaam1: "2_brandmelding_1",
                    vraagNaam2: "2_brandmelding_2",
                    antwoorden1: ["1 gebouw", "2 gebouwen", "1 schuur", "Weet ik niet"],
                    antwoorden2: ["Blikseminslag", "Kortsluiting", "Aangestoken", "Weet ik niet"],
                    antwoord_correct1: "1 gebouw",
                    antwoord_correct2: "Aangestoken",
                    trial: "2_brandmelding",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 474, y: 209, w: 367, h: 447, label: "handen"},
                        {x: 409, y: 4, w: 497, h: 202, label: "handen boven hoofd"},
                        {x: 592, y: 103, w: 120, h: 154, label: "gezicht"},
                        {x: 619, y: 202, w: 73, h: 40, label: "mond"},
                        {x: 613, y: 154, w: 90, h: 36, label: "ogen"}
                    ]
                    
                }
            ]
        }
        
        let trial_timeline2 = {
            timeline: [fixatie, video, vraag1, vraag2],
            timeline_variables: [
                { // Trial 5
                    stimulus: [gorilla.stimuliURL("niveau2_opheffeest.mp4")], 
                    vraag1: "Welke actie is ondernomen om te proberen het feest af te blazen?",
                    vraag2: "Hoeveel mensen hebben de petitie al ondertekend?",
                    vraagNaam1: "2_opheffeest_1",
                    vraagNaam2: "2_opheffeest_2",
                    antwoorden1: ["Een demonstratie", "Een petitie", "Een klacht ingediend", "Weet ik niet"],
                    antwoorden2: ["1.000", "10.000", "100.000", "Weet ik niet"],
                    antwoord_correct1: "Een petitie",
                    antwoord_correct2: "100.000",
                    trial: "2_opheffeest",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 428, y: 192, w: 390, h: 513, label: "handen"},
                        {x: 566, y: 59, w: 119, h: 151, label: "gezicht"},
                        {x: 593, y: 156, w: 62, h: 44, label: "mond"},
                        {x: 416, y: 6, w: 149, h: 185, label: "rechter hand naast hoofd"},
                        {x: 582, y: 103, w: 87, h: 45, label: "ogen"}
                    ]
                    
                },
                { // Trial 6
                    stimulus: [gorilla.stimuliURL("niveau2_weerbericht.mp4")], 
                    vraag1: "Wat is de weervoorspelling voor morgenochtend?",
                    vraag2: "Waar valt de regen?",
                    vraagNaam1: "2_weerbericht_1",
                    vraagNaam2: "2_weerbericht_2",
                    antwoorden1: ["Nevelig", "Zonnig", "Regenachtig", "Weet ik niet"],
                    antwoorden2: ["Zuiden en noorden", "Oosten en zuiden", "Westen en noorden", "Weet ik niet"],
                    antwoord_correct1: "Nevelig",
                    antwoord_correct2: "Oosten en zuiden",
                    trial: "2_weerbericht",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 427, y: 141, w: 419, h: 515, label: "handen"},
                        {x: 582, y: 72, w: 116, h: 149, label: "gezicht"},
                        {x: 606, y: 160, w: 63, h: 40, label: "mond"},
                        {x: 593, y: 112, w: 102, h: 37, label: "ogen"}
                    ]
                    
                },
                { // Trial 7
                    stimulus: [gorilla.stimuliURL("niveau3_ambassades.mp4")], 
                    vraag1: "Wie worden er in dit fragment gequote?",
                    vraag2: "Valt de Nederlandse ambassade onder Nederlands grondgebied?",
                    vraagNaam1: "3_ambassades_1",
                    vraagNaam2: "3_ambassades_2",
                    antwoorden1: ["2 politici", "Politicus en ambtenaar", "Politicus en premier", "Weet ik niet"],
                    antwoorden2: ["Ja, het is Nederlands grondgebied", "Ja, maar er geldt een speciale regelgeving", "Nee, het is geen Nederlands grondgebied", "Weet ik niet"],
                    antwoord_correct1: "Politicus en premier",
                    antwoord_correct2: "Nee, het is geen Nederlands grondgebied",
                    trial: "3_ambassades",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 418, y: 191, w: 409, h: 481, label: "handen"},
                        {x: 563, y: 98, w: 118, h: 139, label: "gezicht"},
                        {x: 581, y: 186, w: 74, h: 42, label: "mond"},
                        {x: 573, y: 135, w: 100, h: 39, label: "ogen"}
                    ]
                    
                },
                { // Trial 8
                    stimulus: [gorilla.stimuliURL("niveau3_brexit.mp4")], 
                    vraag1: "Kun je als student nog op Erasmus uitwisseling?",
                    vraag2: "Na hoeveel jaar gaat de Brexit pas in werking?",
                    vraagNaam1: "3_brexit_1",
                    vraagNaam2: "3_brexit_2",
                    antwoorden1: ["Ja, hier verandert niets in", "Ja, maar het kost je 150 euro", "Nee, dit is niet meer mogelijk", "Weet ik niet"],
                    antwoorden2: ["4 jaar", "4,5 jaar", "5,5 jaar", "Weet ik niet"],
                    antwoord_correct1: "Nee, dit is niet meer mogelijk",
                    antwoord_correct2: "4,5 jaar",
                    trial: "3_brexit",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 445, y: 162, w: 345, h: 510, label: "handen"},
                        {x: 556, y: 73, w: 132, h: 144, label: "gezicht"},
                        {x: 587, y: 161, w: 76, h: 52, label: "mond"},
                        {x: 572, y: 112, w: 100, h: 46, label: "ogen"}
                    ]
                    
                },
                { // Trial 9
                    stimulus: [gorilla.stimuliURL("niveau3_socialmedia.mp4")], 
                    vraag1: "Wie schreef het bericht over het leven in twee verschillende werelden?",
                    vraag2: "Welke code probeert het ziekenhuispersoneel te voorkomen?",
                    vraagNaam1: "3_socialmedia_1",
                    vraagNaam2: "3_socialmedia_2",
                    antwoorden1: ["De ziekenhuisdirecteur", "Een arts die in het ziekenhuis werkt", "Een patiënt", "Weet ik niet"],
                    antwoorden2: ["Oranje", "Rood", "Zwart", "Weet ik niet"],
                    antwoord_correct1: "De ziekenhuisdirecteur",
                    antwoord_correct2: "Zwart",
                    trial: "3_socialmedia",
                    css_classes: [],
                    areas_of_interest: [
                        {x: 409, y: 190, w: 387, h: 482, label: "handen"},
                        {x: 559, y: 92, w: 108, h: 143, label: "gezicht"},
                        {x: 562, y: 122, w: 105, h: 43, label: "ogen"},
                        {x: 577, y: 178, w: 65, h: 50, label: "mond"}
                    ]
                },
            ]
        }
        
        // Break between trials 4 and 5
        let pauze = {
            type: 'html-button-response',
            stimulus: `
                <p>U kunt nu een pauze nemen, de camera neemt tijdens de pauze niet op.</p>
                <p>Na de pauze zal u opnieuw moeten kalibreren.</p>
                <p>Druk na uw pauze op de knop om verder te gaan met het experiment.</p>
            `,
            choices: ["Ik ben klaar met mijn pauze"],
            post_trial_gap: 1000,
            data: {
                task: "trial-pauze",
                stimulus: "NVT"
            },
            on_start: function() {
                jsPsych.extensions.webgazer.pause();
                document.getElementById("jspsych-content").style.transform =
                  "scale(1)";
                },
            on_finish: function() {
                jsPsych.extensions.webgazer.resume();
            }
        }
        
        // Information about the end of the experiment
        let einde = {
            type: 'html-button-response',
            stimulus: `
                <p>Dit is het einde van de pilot.</p>
                <p>Bedankt voor uw deelname.</p>
                <p>Druk op de knop om het experiment af te sluiten.</p>
            `,
            choices: ["Beëindigen"],
            css_classes: ['no_scaling'],
            post_trial_gap: 1000,
            data: {
                task: "trial-eind",
                stimulus: "NVT"
            },
        }
        
        timeline.push(trial_instructie);
        timeline.push(trial_timeline1);
        timeline.push(pauze);
        timeline.push(kalibratie);
        timeline.push(postpauze_instructie);
        timeline.push(trial_timeline2);
        timeline.push(feedback);
        timeline.push(cadeaubon);
    }
/*
Eind timeline
*/

    // Initialize jspsych with created timeline
	jsPsych.init({
		display_element: $('#gorilla')[0],
		timeline: timeline,
		extensions: [
		    {
		        type: 'webgazer',
		        params: {
		            auto_initialize: false
		        }
		    }    
		],
		on_data_update: function(data){ // save data to gorilla so that it can be converted into csv
			gorilla.metric(data); // MAKE SURE TO CREATE METRICS FOR ALL DATA VARIABLES
		},
		on_finish: function(){
			gorilla.finish();
		}
	});
})