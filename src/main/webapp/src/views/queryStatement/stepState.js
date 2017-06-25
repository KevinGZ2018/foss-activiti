define(['vue', 'html!views/queryStatement/stepState.html'], function(Vue, html) {

    var stepState = Vue.extend({
        template : html,
        props: ['currentState']
    });

    Vue.component('step-state-component', stepState);
})