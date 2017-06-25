define([ 'vue', 'html!views/processInstance/listRunningProcessInstance.html', 'globalConst', 'apis/processService', 'remove' ],
    function(Vue, html, globalConst, processService) {

    const MODULE = globalConst.PROCESS
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
                        title: '流程定义ID',
                        key: 'id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '流程部署ID',
                        key: 'deploymentId',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: 'KEY',
                        key: 'key',
                        align: 'center'
                    },
                    {
                        title: '版本',
                        key: 'version',
                        width: 55,
                        align: 'center'
                    },
                    {
                        title: 'XML',
                        key: 'resourceName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showResourceFile(params.row.id, 'xml')
                                        }
                                    }
                                }, params.row.resourceName)
                            ]);
                        }
                    },
                    {
                        title: '图片',
                        key: 'diagramResourceName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showResourceFile(params.row.id, 'image')
                                        }
                                    }
                                }, params.row.diagramResourceName)
                            ]);
                        }
                    },
                    {
                        title: '部署时间',
                        key: 'deploymentTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.deploymentTime))
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: params.row.suspended ? 'primary' : 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            if(params.row.suspended) {
                                                this.active(params.row.id)
                                            }
                                            else {
                                                this.suspend(params.row.id)
                                            }
                                        }
                                    }
                                }, params.row.suspended ? '激活' : '挂起'),
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
                                            this.convertToModel(params.row.id)
                                        }
                                    }
                                }, '转成模型'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.deploymentId)
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
            showResourceFile (id, type) {
                processService.showResourceFile(id, type)
            },
            remove (deploymentId) {
                this.$refs.removechild.remove(MODULE.URL.REMOVE + "?deploymentId=" + deploymentId)
            },
            active (id) {
                processService.activeProcess(id).then((response) => {

                    this.$Message.info(response.data)
                    this.refreshCurrentPageData()

                }).catch((error) => {
                    console.log(error)
                })
            },
            suspend (id) {
                processService.suspendProcess(id).then((response) => {

                    this.$Message.info(response.data)
                    this.refreshCurrentPageData()

                }).catch((error) => {
                    console.log(error)
                })
            },
            convertToModel (id) {
                processService.convertToModel(id).then((response) => {

                    if(response.data === 'success') {
                        this.$Message.info('操作成功!')
                        this.refreshCurrentPageData()
                    }
                    else {
                        this.$Message.error('操作失败!')
                    }

                }).catch((error) => {
                    console.log(error)
                })
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
            refreshCurrentPageData () {
                this.selectedIds = []
                this.getDataPage()
            },
            getDataPage () {

                processService.findProcesses(this.currentPage, this.pageSize).then((response) => {

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