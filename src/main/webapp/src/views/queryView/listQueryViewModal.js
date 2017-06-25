define([ 'vue', 'html!views/queryView/listQueryViewModal.html', 'queryView' ],
    function(Vue, html) {

        var listQueryViewModal = Vue.extend({
            template : html,
            data () {
                return {
                    localShowModal: false
                }
            },
            methods: {
                show (showModal, dataSourceName, queryStatementName) {
                    this.localShowModal = showModal
                    this.$refs.child.init(dataSourceName, queryStatementName)
                }
            }
        });

        Vue.component('list-query-view-modal-component', listQueryViewModal);
})