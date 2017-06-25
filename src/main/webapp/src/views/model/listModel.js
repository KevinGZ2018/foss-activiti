define([ 'vue', 'html!views/model/listModel.html', 'globalConst', 'apis/modelService', 'remove' ],
    function(Vue, html, globalConst, modelService) {

    const MODULE = globalConst.MODEL
    const PAGE = globalConst.PAGE

    return {
        template : html,
        data () {
            return {
                columns: [
/*                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },*/
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: 'KEY',
                        key: 'key',
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '版本',
                        key: 'version',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.createTime))
                            ]);
                        }
                    },
                    {
                        title: '最后更新时间',
                        key: 'lastUpdateTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.createTime))
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 350,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deploy(params.row.id)
                                        }
                                    }
                                }, '部署'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.export(params.row.id, "bpmn")
                                        }
                                    }
                                }, '导出BPMN'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.export(params.row.id, "json")
                                        }
                                    }
                                }, '导出JSON'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
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
            edit (id) {
                modelService.editModel(id)
            },
            deploy (id) {

                modelService.deployModel(id).then((response) => {
                    this.$Message.success({
                        content: response.data,
                        duration: 5
                    });
                }).catch((error) => {
                    this.$Message.error(error)
                })
            },
            export (id, exportType) {
                modelService.exportModel(id, exportType)
            },
            remove (id) {
                this.$refs.removechild.remove(MODULE.URL.REMOVE + "/" + id)
            },
            initListData () {
                this.selectedIds = []
                this.currentPage = PAGE.INIT_CURRENT_PAGE
                this.pageSize = PAGE.INIT_PAGE_SIZE
                this.getDataPage()
            },
            refreshCurrentPageData () {
                this.selectedIds = []
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

                modelService.findModels(this.currentPage, this.pageSize).then((response) => {

                    var resultData = response.data
                    this.$set(this.$data, 'rows', resultData.result)
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