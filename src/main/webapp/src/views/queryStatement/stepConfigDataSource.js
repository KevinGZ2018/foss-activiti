define([ 'vue', 'html!views/queryStatement/stepConfigDataSource.html', 'globalConst', 'apis/dataSourceService', 'stepState' ],

    function(Vue, html, globalConst, dataSourceService) {

        const MODULE = globalConst.QUERY_STATEMENT
        const PAGE = globalConst.PAGE
        const DATA_SOURCE = globalConst.DATA_SOURCE
        const STORE = globalConst.QUERY_STATEMENT_CREATE_STORE

        return {
            template: html,
            data () {
                return {
                    currentState: 0,
                    columns: [
                        {
                            type: 'index',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: '名称',
                            key: 'name'
                        },
                        {
                            title: 'JDBC Driver',
                            key: 'driver'
                        },
                        {
                            title: '用户名',
                            key: 'user'
                        },
                        {
                            title: '密码',
                            key: 'password'
                        },
                        {
                            title: '初始化连接数',
                            key: 'initConnection'
                        },
                        {
                            title: '最大连接数',
                            key: 'maxConnection'
                        },
                        {
                            title: '修改时间',
                            key: 'updateTime'
                        }
                    ],
                    rows: [],
                    currentPage: PAGE.INIT_CURRENT_PAGE,
                    pageSize: PAGE.INIT_PAGE_SIZE,
                    totalCount: 0,
                    selectedId: ''
                }
            },
            mounted () {
                this.initListData()
            },
            methods: {
                previous () {
                    STORE.clear()
                    this.$router.push(MODULE.ROUTER.LIST)
                },
                next () {
                    if(this.selectedId != "") {
                        STORE.dataSourceId = this.selectedId
                        this.$router.push(MODULE.ROUTER.STEP_CONFIG_TABLE)
                    }
                    else {
                        this.$Message.info('请选择记录!')
                    }
                },
                initListData () {
                    this.currentPage = PAGE.INIT_CURRENT_PAGE
                    this.pageSize = PAGE.INIT_PAGE_SIZE
                    this.getDataPage()
                },
                changePage (current) {
                    this.currentPage = current
                    this.getDataPage()
                },
                changePageSize (pageSize) {
                    this.pageSize = pageSize
                    this.getDataPage()
                },
                getDataPage () {

                    dataSourceService.findDataSources(this.currentPage, this.pageSize).then((response) => {

                        this.selectedId = ""
                        var resultData = response.data.rows
                        for(var i in resultData) {
                            if(resultData[i].id == STORE.dataSourceId) {
                                resultData[i]._highlight = true
                                this.selectedId = resultData[i].id
                            }
                        }
                        this.$set(this.$data, 'rows', resultData)
                        this.$set(this.$data, 'totalCount', resultData.totalCount)

                    }).catch((error) => {
                        console.log(error)
                    })

                },
                changeSelectedRow (currentRow) {
                    this.selectedId = currentRow.id
                }
            }
        }
})