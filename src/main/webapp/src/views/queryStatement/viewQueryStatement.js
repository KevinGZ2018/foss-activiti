define([ 'vue', 'html!views/queryStatement/viewQueryStatement.html', 'globalConst', 'apis/queryStatementService' ],
    function(Vue, html, globalConst, queryStatementService) {

    const MODULE = globalConst.QUERY_STATEMENT

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

                queryStatementService.getQueryStatement(this.$route.params.id).then((response) => {

                    var resultData = response.data
                    this.$set(this.$data, 'model', resultData)

                }).catch((error) => {
                    console.log(error)
                });
            },
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
})