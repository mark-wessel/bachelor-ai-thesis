# bachelor-ai-thesis
This repository hosts the experiment used in the following bachelor theses, please cite whichever best fits your use:
````
@mastersthesis{ai_webcam_2021, 
    type={Bachelor's Thesis},
    title={Exploration of webcam-based eye tracking by comparing gaze behaviour of signers of Sign Language of the Netherlands during interpretation of sign in video}, 
    author={Wessel, M.}, 
    year={2021},
    month=7,
    school = {Utrecht University},
}

@mastersthesis{psych_ngt_2021, 
    type={Bachelor's Thesis},
    title={Novice and expert gaze behavior in users of sign language}, 
    author={Richters, M. and Rutten, P.A.W. and van Vliet, B.Y.A.}, 
    year={2021},
    month=7,
    school = {Utrecht University},
}
````

This code was written for the Gorilla.sc online experiment host environment using their api, therefore if you wish to run it yourself you will have to wrap it accordingly.
The code makes use of the jsPsych and SVG libraries, aswell as some bootstrap. All of these have been included. This version of SVG has custom changes to work with this version of jsPsych, so keep that in mind if you wish to update any library.

The folders have been named after the folders in the gorilla environment.

1. **code:** contains the main javascript file for the experiment and the style file containing custom styling besides the default gorilla styling.
2. **head:** contains a file with references to all the libraries and plugins using the gorilla api.
3. **resources:** contains all images and plugins used in the experiment, as well as external pages such as the written consent page.
