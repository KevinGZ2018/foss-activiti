define([ 'vue', 'html!views/dataSource/editDataSource.html', 'globalConst', 'apis/dataSourceService' ],
    function(Vue, html, globalConst, dataSourceService) {

    const MODULE = globalConst.DATA_SOURCE

    return {
        template : html,
        data () {
            return {
                model: {},
                ruleValidate: {
                    driver: [
                        {required: true, message: 'JDBC Driver不能为空', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: 'JDBC URL不能为空', trigger: 'blur'}
                    ],
                    user: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    validationQuery: [
                        {required: true, message: '校验查询语句不能为空', trigger: 'blur'}
                    ],
                    initConnection: [
                        {required: true, message: '初始化连接数不能为空', trigger: 'blur'}
                    ],
                    maxConnection: [
                        {required: true, message: '最大连接数不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted () {
            this.getModelData()
        },
        methods: {
            getModelData () {
                dataSourceService.getDataSource(this.$route.params.id).then((response) => {

                    var resultData = response.data
                    this.$set(this.$data, 'model', resultData)

                }).catch((error) => {
                    console.log(error)
                })
            },
            update (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        var params = encodeURIComponent(JSON.stringify(this.model))

                        dataSourceService.updateDataSource(params).then((response) => {

                            this.goback()
                            this.$Message.success('修改成功!')

                        }).catch((error) => {
                            console.log(error)
                            this.$Message.error('修改失败!')
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            goback () {
                this.$router.replace(MODULE.ROUTER.LIST)
            }
        }
    }
})