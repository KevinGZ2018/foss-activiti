define([ 'vue', 'html!views/index.html' ], function(Vue, html) {
    return {
        template : html,
        data : function() {
            return {
                show: true
            }
        },
        methods: {
            handleStart () {
                this.$Modal.info({
                    title: 'Bravo',
                    content: 'Now, enjoy the convenience of iView.'
                });
            }
        }
    }
})