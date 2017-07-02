define([ 'vue', 'html!views/task/startFormModal.html', 'apis/taskService' ],
    function(Vue, html, taskService) {

    var startFormModal = Vue.extend({
        template : html,
        data () {
            return {
                localShowModal: false,
                processDefinitionId: '',
                startFormModel: {}
            }
        },
        methods: {
            getStartForm (processDefinitionId) {
                taskService.getStartForm(processDefinitionId).then((response) => {
                    this.startFormModel = new Vue({
                        el: '#startFormContent',
                        template: '<div><template>' + response.data + '</template></div>',
                        data() {
                            return {
                                model: {}
                            }
                        }
                    })

                }).catch((error) => {
                    console.log(error)
                })
            },
            show (showModal, processDefinitionId) {
                this.localShowModal = showModal
                this.processDefinitionId = processDefinitionId

                this.getStartForm(processDefinitionId)
            },
            start () {
                var startFormModelContent = this.startFormModel.$data.model;

                var params = ''
                for(var key in startFormModelContent) {

                    var value = startFormModelContent[key]

                    if(value instanceof Date) {
                        value = Vue.filter('localDateString')(value)
                    }
                    params += key + "=" + value + "&"
                }

                taskService.startProcessInstance(this.processDefinitionId, params).then((response) => {

                    var result = response.data
                    if('success' === result.state) {

                        this.$Message.success({
                            content: result.msg,
                            duration: 5
                        });

                        this.$emit('refresh')
                        this.localShowModal = false
                    }
                    else {
                        this.$emit('refresh')
                        this.$Message.error(result.msg)
                    }

                }).catch((error) => {
                    console.log(error)
                    this.$emit('refresh')
                    this.$Message.error('流程启动失败!')
                })
            },
            cancel () {
                this.$emit('refresh')
                this.localShowModal = false
            }
        }
    })

    Vue.component('start-from-modal-component', startFormModal)
})
