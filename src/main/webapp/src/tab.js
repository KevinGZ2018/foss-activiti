define(['vue', 'iview', 'html!tab.html', 'css!libs/iview.css' ],
    function(Vue, iView, html) {

        var tab = Vue.extend({
            template : html,
            data () {
                return {
                    tabs: [{label: '首页', show: true, body: '首页内容'}]
                }
            },
            methods: {
                handleTabRemove (name) {
                    this['tab' + name] = false;
                }
            }
        });

        Vue.component('tab-bar', tab);
})
