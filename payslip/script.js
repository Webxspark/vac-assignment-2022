/*Functions*/
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
var page = {
    _init_() {
        this.init_event_listeners();
        this.load_data();
        var dateObj = new Date();
        var year = dateObj.getUTCFullYear();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        month = monthNames[dateObj.getMonth()];
        Wxp_DOM.render(`${month} ${year}`,'[key="month-year"]');
    },
    load_data() {
        return new Promise((resolve, reject) => {
            var emp_code = rand(11111, 99999),
                pf_no = rand(111111111111, 999999999999),
                esi_no = rand(111111111111111111, 999999999999999999),
                ac_no = `*******${rand(1111, 9999)}`;
            this.fetch_rname().then(response => {
                var name = response.name;
                page.render_data(emp_code, '[key="emp-code"]');
                page.render_data(pf_no, '[key="pf-no"]');
                page.render_data(esi_no, '[key="esi-no"]');
                page.render_data(ac_no, '[key="ac-no"]');
                page.render_data(name, '[key="emp-name"]');
                resolve('done');
            })
        })
    },
    render_data(data, root) {
        Wxp_DOM.render(data, root, { animate: { settings: 'fade' } })
    },
    init_event_listeners() {
        $('[wxp-module="hot-reload"]').click(() => {
            $('[wxp-module="hot-reload"]').attr('disabled', 'true');
            page.load_data().then(status => {
                Wxp_DOM.scroll('html')
                if (status == 'done') {
                    $('[wxp-module="hot-reload"]').removeAttr('disabled');
                } else {
                    window.location.reload();
                }
            })
        })
    },
    fetch_rname() {
        return $.ajax({
            url: 'https://apis.webxspark.com/v2.0/utilities/generators/random-name',
            method: "POST",
            dataType: 'JSON',
            error: () => { alert("Something went wrong while fetching user info!") }
        })
    }
}
page._init_()