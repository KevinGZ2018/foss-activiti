define([ 'vue', 'html!views/processInstance/listRunningProcessInstance.html', 'globalConst', 'apis/processInstanceService' ],
    function(Vue, html, globalConst, processInstanceService) {

    const PAGE = globalConst.PAGE

    return {
        template : html,
        data () {
            return {
                columns: [
                    {
                        title: '流程实例ID',
                        key: 'id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '流程定义ID',
                        key: 'processDefinitionId',
                        align: 'center'
                    },
                    {
                        title: '当前节点',
                        key: 'currentTaskName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDiagramViewer(params.row.processDefinitionId, params.row.id)
                                        }
                                    }
                                }, params.row.currentTaskName)
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
                                }, params.row.suspended ? '激活' : '挂起')
                            ]);
                        }
                    }
                ],
                rows: [],
                currentPage: PAGE.INIT_CURRENT_PAGE,
                pageSize: PAGE.INIT_PAGE_SIZE,
                totalCount: 0
            }
        },
        mounted () {
            this.initListData()
        },
        methods: {
            showDiagramViewer (processDefinitionId, processInstanceId) {
                processInstanceService.showDiagramViewer(processDefinitionId, processInstanceId)
            },
            active (id) {
                processInstanceService.activeProcessInstance(id).then((response) => {

                    this.$Message.info(response.data)
                    this.refreshCurrentPageData()

                }).catch((error) => {
                    console.log(error)
                })
            },
            suspend (id) {
                processInstanceService.suspendProcessInstance(id).then((response) => {

                    this.$Message.info(response.data)
                    this.refreshCurrentPageData()

                }).catch((error) => {
                    console.log(error)
                })
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
            refreshCurrentPageData () {
                this.getDataPage()
            },
            getDataPage () {

                processInstanceService.findRunningProcessInstances(this.currentPage, this.pageSize).then((response) => {

                    var resultData = response.data
                    this.$set(this.$data, 'rows', resultData.result)
                    this.$set(this.$data, 'totalCount', resultData.totalCount)

                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }
})