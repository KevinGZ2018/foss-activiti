define([ 'vue', 'html!views/task/historyTaskFormModal.html', 'apis/taskService' ],
    function(Vue, html, taskService) {

    var historyTaskFormModal = Vue.extend({
        template : html,
        data () {
            return {
                localShowModal: false,
                taskBos: [],
                startFormBos: []
            }
        },
        methods: {
            getHistoryTaskForm (processInstanceId) {
                taskService.getHistoryTaskForm(processInstanceId).then((response) => {

                    var result = response.data
                    this.taskBos = result.taskBos
                    this.startFormBos = result.startFormBos

                }).catch((error) => {
                    console.log(error)
                })
            },
            show (showModal, processInstanceId) {
                this.localShowModal = showModal
                this.getHistoryTaskForm(processInstanceId)
            },
            cancel () {
                this.$emit('refresh')
                this.localShowModal = false
            }
        }
    })

    Vue.component('history-task-form-modal-component', historyTaskFormModal)
})
