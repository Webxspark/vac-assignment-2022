/**
 * This source code was submitted by B.Alan Christofer (RA2211003020264) from CSE - E
 * Copyright (C) 2022 webxspark.com - All Rights Reserved
 * Distribution of this source code without permission is illegal
 * To claim a valid licence, please contact copyright@webxspark.com for more info
 */

/*Functions*/
function duDialogAlert(title, html, success = (() => {
    return null;
}), okClick = (() => {
    return null;
})) {
    new duDialog(title, `${html}`, {
        okText: 'Ok',
        callbacks: {
            okClick: function () {
                okClick();
                this.hide(); // hides the dialog
            }
        }
    });
    success();
    return true;
}

var form = {
    init() {
        this.eventListeners();
    },
    eventListeners() {
        $('[wxp-tnc]').click(() => {
            duDialogAlert('Terms and Conditions', `1. All students must be enrolled in an accredited university program in order to participate in the registration
            process. <br><br>
            
            2. All registration forms must be completed in full and submitted with the appropriate payment prior to the registration
            deadline. <br><br>
            
            3. No registration will be accepted after the deadline. <br><br>
            
            4. All students must agree to abide by the university's policies and regulations. <br><br>
            
            5. All students must submit a signed waiver of liability prior to participating in any activities associated with the
            registration process. <br><br>
            
            6. All registration fees are non-refundable and non-transferable. <br><br>
            
            7. The university reserves the right to refuse or cancel any registration at its discretion. <br><br>
            
            8. It is the responsibility of the student to provide accurate information on the registration form. <br><br>
            
            9. The student is responsible for any fees associated with their registration. <br><br>
            
            10. All students must adhere to the university's code of conduct while participating in the registration process. <br><br>`);
        });
        $('#regForm').submit((e) => {
            form.handleFormSubmission();
            return false; //form submit default prevented
        })
    },
    handleFormSubmission() {
        //getting data from form
        var fname = $('[name="fname"]').val(),
            lname = $('[name="lname"]').val(),
            email = $('[name="email"]').val(),
            gender = $('[name="gender"]').val(),
            regno = $('[name="regno"]').val(),
            classInfo = $('[name="classInfo"]').val(),
            dob = $('[name="dob"]').val(),
            address = $('[name="address"]').val(),
            isTermsAccepted = $('[name="invalidCheck"]:checked').val(),
            errors = '',
            btnHtml = $('[type="submit"]').html();
        //validating data
        if (fname != '' && lname != '' && email != '' && gender != '' && regno != '' && classInfo != '' && dob != '' && address != '') {
            if (isTermsAccepted && isTermsAccepted == "accepted") {
                var data = {
                    name: {
                        given_name: fname,
                        family_name: lname
                    },
                    email: email,
                    gender: gender,
                    regno: regno,
                    classInfo: classInfo,
                    dob: dob,
                    address: address,
                    terms_and_conditions: isTermsAccepted,
                    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
                };
                $('[type="submit"]').html('Please wait...')
                    .prop('disabled', true);
                this.pushData(data).then(response => {
                    if (response.error) {
                        duDialogAlert('', response.error);
                    } else {
                        if (response.status) {
                            //updating page components
                            var root_height = $('[wxp-root="form"]').height();
                            $('[wxp-root="form"]').attr('style', `height: ${root_height}px !important`);
                            var thankyou = `<div class="row h-100 justify-content-center align-items-center"> 
                            <img style="width: 150px !important" src="./assets/img/photos/bonbon-line-check-mark.png" /><h3 style="position: absolute; top:${root_height - 213}px;">Thank you!</h3>
                            </div>`;
                            Wxp_DOM.render(thankyou, 'wxp-form', {animate: {settings: 'slide'}});
                        }
                    }
                    $('[type="submit"]').html(btnHtml)
                        .removeAttr('disabled');
                })
            } else {
                duDialogAlert('', '<div class="alert alert-info">Please accept our University\'s terms & conditions to register!</div>')
            }
        } else {
            errors = true;
        }
        if (errors == true) {
            duDialogAlert('', 'Please fill all required details!');
        }
    },
    pushData(data) {
        return $.ajax({
            url: 'https://apis.webxspark.com/SHARED_APIS/AlanChristofer/vac/',
            method: 'POST',
            data: {
                data: JSON.stringify(data)
            },
            dataType: 'JSON',
            error: () => { duDialogAlert('', '<div class="alert alert-danger">Something went wrong while registering! Please try again later!</div>') }
        })
    }
}
form.init();