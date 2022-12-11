function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
class WXP_DOM {
    checkObj(JSObject) {
        if (typeof JSObject === 'object' && !Array.isArray(JSObject) && JSObject !== null) {
            return true;
        } else {
            return false;
        }
    }
    render(insertHTML, objParent, options = {}) {
        if (!options.animate) {
            __render(objParent, insertHTML);
        }
        if (options.complete) {
            options.complete();
        }
        if (options.animate) {
            var animate_opt = options.animate,
                operations = '__secure-' + this.makeid(20),
                querySelector = `[wxptmp="${operations}"]`;
            if (this.checkObj(animate_opt)) {
                if (!animate_opt.height) {
                    animate_opt.height = 'auto';
                }
                if (!animate_opt.interval) {
                    animate_opt.interval = 200;
                }
                if (!animate_opt.settings) {
                    console.error('Render API is looking for a valid animate settings. Make sure you provide animate.settings key!')
                    return { error: { reason: 'Render API is looking for a valid animate settings. Make sure you provide animate.settings key!' } };
                }
                if (!animate_opt.speed) {
                    animate_opt.speed = "fast";
                }
                if (animate_opt.settings == "fade") {
                    if ($(objParent).html() == "") {
                        var temp_elm = 'wxp-nonce-' + this.makeid(5);
                        $(objParent).html(`<${temp_elm} style="opacity: 0%;" />`);
                        __render(temp_elm, insertHTML);
                        var orgParent = objParent;
                        var objParent = temp_elm;
                        $(objParent).attr('wxptmp', operations);
                        showAndRender();
                        // var html = $(objParent).html();
                    } else {
                        $(objParent).attr('wxptmp', operations);
                        hideAndRender();
                    }
                    function hideAndRender() {
                        $(querySelector).animate({
                            opacity: '0%'
                        }, animate_opt.interval, showAndRender)
                    }
                    function showAndRender() {
                        __render(objParent, insertHTML);;
                        $(querySelector).animate({
                            opacity: '100%'
                        }, animate_opt.interval, () => {
                            $(querySelector).removeAttr('wxptmp')
                                .removeAttr('style');
                            if (animate_opt.complete) {
                                animate_opt.complete();
                            }
                        })
                    }

                } else if (animate_opt.settings == "slide") {
                    if (!animate_opt.slideUp) {
                        animate_opt.slideUp = 'slow';
                    }
                    if (!animate_opt.slideDown) {
                        animate_opt.slideDown = 'fast';
                    }
                    if (animate_opt.speed) {
                        animate_opt.slideUp = animate_opt.slideDown = animate_opt.speed;
                    }
                    if ($(objParent).html() == "") {
                        var temp_elm = 'wxp-nonce-' + this.makeid(5);
                        $(objParent).html(`<${temp_elm} style="display: none;" />`);
                        __render(temp_elm, insertHTML);
                        var orgParent = objParent;
                        var objParent = temp_elm;
                        $(objParent).attr('wxptmp', operations);
                        showAndRender();
                    } else {
                        hideAndRender();
                    }
                    function hideAndRender() {
                        $(objParent).slideUp(animate_opt.slideUp, () => {
                            showAndRender();
                        })
                    }
                    function showAndRender() {
                        __render(objParent, insertHTML);;
                        $(objParent).slideDown(animate_opt.slideDown);
                        $(objParent).removeAttr('wxptmp');
                        if (animate_opt.complete) {
                            animate_opt.complete();
                        }
                    }
                } else {
                    console.error('Render API is looking for a valid animate settings!' + ` You've provided animate settings as '${animate_opt.settings}' which is Invalid! Please read our Render API documentation before use.`)
                    return { error: { reason: 'Render API is looking for a valid animate settings!' + ` You've provided animate settings as '${animate_opt.settings}' which is Invalid! Please read our Render API documentation before use.` } };
                }
            } else {
                console.error('Render API is looking for a valid animate options! Make sure the options.animate is an object.');
            }
        }
        function __render(objParent, insertHTML) {
            $(objParent).html(insertHTML);
            return true;
        }
    }
    append(insertHTML, objParent) {
        $(objParent).append(insertHTML);
    }
    prepend(insertHTML, objParent) {
        $(objParent).prepend(insertHTML);
    }
    blockUI(options) {
        let o = options;
        var action = '',
            target = '',
            clear = "",
            text = 'Loading...',
            done = (() => {
                return null
            });
        if (o.action) {
            action = o.action;
        }
        if (o.target) {
            target = o.target;
        }
        if (o.text) {
            text = o.text
        }
        if (o.done) {
            done = o.done
        }
        if (o.clear) {
            clear = o.clear
        }
        if (text != '') {
            if (action === 'block') {
                if (clear != "") {
                    var ___a = new WXP_DOM;
                    ___a.blockUI({
                        target: clear,
                        action: 'release'
                    })
                }
                $(target).addClass('blockui')
                    .attr('style', 'position: relative; overflow: hidden;')
                    .append(`<div class="blockui-overlay " style="z-index: 1;"><div class="blockui-message"><span class="spinner-border text-primary"></span> ${text}</div></div>`);
                done();
                return true;
            } else if (action === 'release') {
                $(target).removeClass('blockui');
                $('.blockui-overlay').remove();
                done();
                return true;
            } else {
                console.error('Unknown action provided! Please refer Webxspark\'s BlockUI documentation!');
            }
        } else {
            console.error('Referrence target must not be null!');
        }
    }
    render_template(template = '', root = 'body', onClickEvent = (() => {
        return null;
    })) {
        main_process_bar('hide', 500);
        if (template != '') {
            if (template === 404 || template === '404') {
                var __htmlTemplate = `<div class="d-flex flex-column flex-root">
                <!--begin::Authentication - 404 Page-->
                <div class="d-flex flex-column flex-center flex-column-fluid p-10">
                    <!--begin::Illustration-->
                    <img src="/admin-assets/media/illustrations/unitedpalms-1/18.png" alt="" class="mw-100 mb-10 h-lg-450px">
                    <!--end::Illustration-->
                    <!--begin::Message-->
                    <h1 class="fw-bold mb-10" style="color: #A3A3C7">Seems there is nothing here</h1>
                    <!--end::Message-->
                    <!--begin::Link-->
                    <wxp-button-renderer wxpClid="templateButtonActionOnClick" class="btn btn-primary">
                    <wxp-icon-renderer class="fa fa-arrow-left"></wxp-icon-renderer> Back
                    </wxp-button-renderer>
                    <!--end::Link-->
                </div>
                <!--end::Authentication - 404 Page-->
            </div>`;
                this.render(__htmlTemplate, root);
                $('[wxpClid="templateButtonActionOnClick"]').click(() => {
                    onClickEvent();
                })
            }
        } else {
            console.error('Render template must be specifed! Please refer Webxspark\'s RenderTemplate documentation!')
        }
    }
    linkify(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" rel="noopener noreferrer nofollow">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" rel="noopener noreferrer nofollow">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    }
    remove(objParent, delay = 0, transition = false) {
        if (transition === false) {
            setTimeout(() => {
                remove_conf(objParent)
            }, delay)
        } else if (transition === true) {
            $(objParent).delay(delay - 500).fadeOut();
            setTimeout(() => {
                remove_conf(objParent)
                $(objParent).fadeIn('slow');
            }, delay)
        } else {
            console.error('WXP_DOM ERR: Invalid animation parameter was entered!');
        }

        function remove_conf(objParent) {
            $(objParent).remove()
        }
    }
    newElm(tag, attr_array = null, objParent) {
        $(objParent).append($(`<${tag}/>`, {
            attr_array
        }));
    }
    /**
     * @param {innerHTML} html - HTML to be insterted
     * @param {tagName} tag - A html tag identifier {eg: h1,iframe,p,etc,..}
     * @param {appendTo} append - A parent tag where the new element must be inserted
     * @param {success} function - Function to be executed after element created
     */
    createElement(innerHTML, tagName, appendTo, success = (() => {
        return null
    })) {
        var wxpnonce = makeid(20);
        $(appendTo).append($(`<${tagName}/>`, {
            wxpnonce: wxpnonce
        }));
        $(`[wxpnonce="${wxpnonce}"]`).html(innerHTML)
            .removeAttr('wxpnonce');
        success(wxpnonce);
        return wxpnonce;
    }
    checkElm(objParent) {
        if ($(objParent).length) {
            return true
        } else {
            return false
        }
    }
    ajax(options) {
        if (!options.url) {
            console.error('Request URL Missing! You cannot send ajax request without knowing the URL!')
            return false;
        }
        if (!options.method) {
            options.method = 'GET';
        }
        if (!options.data) {
            options.data = '';
        }
        if (!options.dataType) {
            console.error('You must assign a dataType value before sending ajax request!');
            return false;
        }
        if (!options.complete) {
            options.complete = (() => {
                return null
            });
        }
        if (!options.success) {
            options.success = ((data) => { });
        }
        if (options.pageRoute) {
            if (!options.pageRoute.history) {
                options.pageRoute.history = false;
            }
            if (!options.pageRoute.hash) {
                options.pageRoute.hash = '';
            }
            var path = options.pageRoute.path;
            var history = options.pageRoute.history;
            var hash = options.pageRoute.hash;
            if (history === true || history === 1 || history === 'push' || history === '1') {
                var pageNonce = makeid(15);
                window.history.pushState(pageNonce, pageNonce, path + hash);
            }
        }
        $.ajax({
            url: options.url,
            method: options.method,
            data: options.data,
            dataType: options.dataType,
            success: ((data) => {
                options.success(data);
            }),
            complete: (() => {
                options.complete();
            }),
            error: function (jqXHR, exception) {
                var error_msg = '';
                if (jqXHR.status === 0) {
                    error_msg += render_bs_alert('Connection Lost', "You're offline. Check your connection and server status.", 'info');
                } else if (jqXHR.status == 404) {
                    error_msg += render_bs_alert("API Request Error", "<b>Error:</b> The API request returns code 404 [File Not Found]", 'primary');
                } else if (jqXHR.status == 500) {
                    error_msg += render_bs_alert("Internal Server Error", "<b>Error:</b> The API request returns code 500 [Internal Server Error]", 'danger');
                } else if (exception === 'parsererror') {
                    error_msg += render_bs_alert("Parse Error", "Requested JSON parse failed!", 'danger');
                } else if (exception === 'timeout') {
                    error_msg += render_bs_alert("Secure Connection Failed", "Connection <b>Time out</b>. Please check your connection and server status!", 'danger');
                } else if (exception === 'abort') {
                    error_msg += render_bs_alert("Request Aborted", "AJAX Request aborted! Please try again later!", 'primary');
                } else {
                    error_msg += render_bs_alert("Uncaught Error", jqXHR.responseText, 'danger');
                }
                duDialogAlert('', error_msg);
            }
        })
    }
    style(style, objParent) {
        $(objParent).css(style);
    }
    scroll(querySelector) {
        $('html, body').animate({
            'scrollTop': $(querySelector).position().top
        });
    }
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    progressBar(percentage = "0%", querySelector, options = {}) {
        var operations = '_secure-' + this.makeid(10),
            loaderQuerySelector = `[wxploader="${operations}"]`,
            inlineTEXT = '';
        if (!options.background) {
            options.background = '#0070db';
        }
        if (!options.height) {
            options.height = "4px";
        }
        if (!options.render) {
            options.render = "innerHTML"
        }
        if (!options.color) {
            options.color = '#fff';
        }
        if (options.text) {
            if (options.text == true) {
                inlineTEXT = percentage;
            }
        }
        var loader = `<div wxploader="${operations}" style="color:${options.color};height: ${options.height}; width:${percentage}; background: ${options.background}; display: inline-flex;align-items: center;justify-content: center;">${inlineTEXT}</div>`;
        if (options.render == "innerHTML") {
            $(querySelector).html(loader);
        } else if (options.render == "append") {
            $(querySelector).append(loader);
        } else if (options.render == "prepend") {
            $(querySelector).prepend(loader);
        } else {
            $(querySelector).html(loader);
        }
        return {
            info: {
                querySelector: loaderQuerySelector,
                value: options.width
            },
            update: (percentage, text = '') => {
                $(loaderQuerySelector).animate({
                    width: percentage
                }, 200)
                if ($(loaderQuerySelector).text() != '') {
                    if (text == '') {
                        $(loaderQuerySelector).text(percentage);
                    } else {
                        $(loaderQuerySelector).text(text);
                    }
                }

            },
            height: (value) => {
                $(loaderQuerySelector).animate({
                    height: value
                }, 200)
            },
            dismiss: () => {
                $(loaderQuerySelector).animate({
                    width: "100%"
                }, 100)
                $(loaderQuerySelector).animate({
                    opacity: '0%'
                }, 200, () => {
                    $(loaderQuerySelector).remove();
                })
            }
        }
    }
    showWarning(querySelector, options = {}) {
        var operations = '_secure-' + makeid(10);
        var flickersDone = 0;
        if (!options.scrollView) {
            options.scrollView = false;
        }
        if (!options.flicker) {
            options.flicker = 3;
        }
        if (!options.interval) {
            options.interval = 1000;
        }
        if (!options.color) {
            options.color = '#f1416c';
        }
        if (options.scrollView == true) {
            $(querySelector).attr('id', operations);

        }
        if (options.scrollView == true) {
            $(querySelector).attr('wxptmp', operations);
            this.scroll(`[wxptmp="${operations}"]`);
            setTimeout(() => {
                $(querySelector).removeAttr('wxptmp');
            }, 200);
        }
        doFlicker();
        function doFlicker() {
            /*Recursive function*/
            flicker().then(() => {
                if (flickersDone == options.flicker) {
                    //do nothing
                } else {
                    $(querySelector).removeAttr('style');
                    setTimeout(() => {
                        doFlicker();
                    }, 700);
                }
            })
            function flicker() {
                return new Promise((resolve, reject) => {
                    $(querySelector).attr('style', `box-shadow: 0px 0px 1px 4px ${options.color};`);
                    setTimeout(() => {
                        flickersDone += 1;
                        $(querySelector).removeAttr('style');
                        resolve('DOM updated!');
                    }, options.interval);
                })
            }
        }

        return true;
    }
    file_blob(DOM_File) {
        var file = DOM_File,
            reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                const fileToBlob = async (file) => new Blob([new Uint8Array(await file.arrayBuffer())], {
                    type: file.type
                });
                fileToBlob(file).then(blob => {
                    var url = URL.createObjectURL(blob)
                    resolve(url);
                })
            }
            reader.readAsBinaryString(file);
        })
    }
}
let Wxp_DOM = new WXP_DOM;