define([ 'vue', 'html!views/queryView/listQueryView.html', 'queryView' ],
    function(Vue, html) {
        return {
            template: html,
            mounted () {
                this.$refs.child.init("soc_monitor", "monitormenu")
            }
        }
})