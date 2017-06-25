define([ 'vue', 'html!views/dataSource/viewDataSource.html', 'globalConst', 'apis/dataSourceService' ],
    function(Vue, html, globalConst, dataSourceService) {

    const MODULE = globalConst.DATA_SOURCE

    return {
        template : html,
        data () {
            return {
                model: {}
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
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
})