define(['vue', 'iview', 'html!app.html', 'css!libs/iview.css' ],
    function(Vue, iView, html) {


    var header = Vue.extend({
        template : html
    });

    Vue.component('header-bar', header);


})
