define(['vue', 'html!views/queryStatement/stepPreview.html'], function(Vue, html) {

    var stepPreview = Vue.extend({
        template : html,
        data () {
            return {
                localShowModal: false,
                saveModel: {}
            }
        },
        methods: {
            show (showModal, saveModel) {
                this.localShowModal = showModal
                this.saveModel = saveModel
            },
            cancel () {
                this.localShowModal = false
            }
        }
    });

    Vue.component('step-preview-component', stepPreview);
})