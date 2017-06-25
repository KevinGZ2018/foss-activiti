define([ 'vue', 'html!views/dataSource/listDataSource.html', 'globalConst', 'apis/dataSourceService', 'remove' ],
    function(Vue, html, globalConst, dataSourceService) {

    const MODULE = globalConst.DATA_SOURCE
    const PAGE = globalConst.PAGE

    return {
        template : html,
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
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
                selectedIds: []
            }
        },
        mounted () {
            this.initListData()
        },
        methods: {
            add () {
                this.$router.push(MODULE.ROUTER.ADD)
            },
            edit () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.push(MODULE.ROUTER.EDIT + "/" +  this.selectedIds[0])
                }
            },
            view () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.push(MODULE.ROUTER.VIEW + "/" + this.selectedIds[0])
                }
            },
            remove () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$refs.removechild.remove(MODULE.URL.REMOVE + "/" +  this.selectedIds[0])
                }
            },
            initListData () {
                this.selectedIds = []
                this.currentPage = PAGE.INIT_CURRENT_PAGE
                this.pageSize = PAGE.INIT_PAGE_SIZE
                this.getDataPage()
            },
            changePage (current) {
                this.selectedIds = []
                this.currentPage = current
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.selectedIds = []
                this.pageSize = pageSize
                this.getDataPage()
            },
            getDataPage () {

                dataSourceService.findDataSources(this.currentPage, this.pageSize).then((response) => {

                    var resultData = response.data
                    this.$set(this.$data, 'rows', resultData.rows)
                    this.$set(this.$data, 'totalCount', resultData.totalCount)

                }).catch((error) => {
                    console.log(error)
                })
            },
            checkSelectedOnlyOne (selectedIds) {
                if(selectedIds.length != 1) {
                    this.$Message.info('请选择一条记录!')
                    return false
                }
                return true
            },
            changeSelectedRow (selection) {
                this.selectedIds = []
                for(var i=0; i<selection.length; i++) {
                    this.selectedIds.push(selection[i].id)
                }
            }
        }
    }
})