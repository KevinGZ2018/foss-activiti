define([ 'vue', 'html!views/model/addModel.html', 'globalConst', 'apis/modelService' ],
    function(Vue, html, globalConst, modelService) {

    const MODULE = globalConst.MODEL

    return {
        template : html,
        data () {
            return {
                model: {},
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    key: [
                        {required: true, message: 'KEY不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            add (name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {

                        var p = "name=" + this.model.name + "&key=" + this.model.key
                        //var params = encodeURIComponent(p)

                        modelService.addModel(p).then((response) => {

                            // this.goback()
                            // this.$Message.success('添加成功!')

                            this.goback()
                            window.open("/modeler.html?modelId=" + response.data)

                        }).catch((error) => {
                            this.$Message.error(error)
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
})