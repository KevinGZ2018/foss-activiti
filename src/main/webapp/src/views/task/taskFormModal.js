define([ 'vue', 'html!views/task/taskFormModal.html', 'apis/taskService' ],
    function(Vue, html, taskService) {

    var taskFormModal = Vue.extend({
        template : html,
        data () {
            return {
                localShowModal: false,
                taskId: '',
                taskFormModel: {}
            }
        },
        methods: {
            getTaskForm (taskId) {
                taskService.getTaskForm(taskId).then((response) => {

                    var result = response.data

                    this.taskFormModel = new Vue({
                        el: '#taskFormContent',
                        template: '<div><template>' + result.taskForm + '</template></div>',
                        data() {
                            return {
                                model: {},
                                taskBos: result.taskBos,
                                startFormBos: result.startFormBos
                            }
                        }
                    })

                }).catch((error) => {
                    console.log(error)
                })
            },
            show (showModal, taskId) {
                this.localShowModal = showModal
                this.taskId = taskId

                this.getTaskForm(taskId)
            },
            handle () {
                var taskFormModelContent = this.taskFormModel.$data.model;

                var params = ''
                for(var key in taskFormModelContent) {

                    var value = taskFormModelContent[key]

                    if(value instanceof Date) {
                        value = Vue.filter('localDateString')(value)
                    }
                    params += key + "=" + value + "&"
                }

                taskService.completeTask(this.taskId, params).then((response) => {

                    var result = response.data
                    if('success' === result.state) {

                        this.$Message.success({
                            content: result.msg,
                            duration: 5
                        });

                        this.localShowModal = false
                        this.$emit('refresh')
                    }
                    else {
                        this.$Message.error(result.msg)
                    }

                }).catch((error) => {
                    console.log(error)
                    this.$Message.error('办理失败!')
                })
            },
            cancel () {
                this.localShowModal = false
            }
        }
    })

    Vue.component('task-form-modal-component', taskFormModal)
})
