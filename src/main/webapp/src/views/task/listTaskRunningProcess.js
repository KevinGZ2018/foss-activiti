define([ 'vue', 'html!views/task/listTaskRunningProcess.html', 'globalConst', 'apis/taskService', 'apis/processInstanceService' ],
    function(Vue, html, globalConst, taskService, processInstanceService) {

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
                    }
                ],
                rows: [],
                currentPage: PAGE.INIT_CURRENT_PAGE,
                pageSize: PAGE.INIT_PAGE_SIZE,
                totalCount: 0
            }
        },
        watch: {
            /**
             * 当使用路由参数时，例如从 /user/foo 导航到 user/bar，
             * 原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，
             * 复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。
             * 需要通过key来阻止组件“复用”
             */
            '$route': 'initListData'
        },
        mounted () {
            this.initListData()
        },
        methods: {
            showDiagramViewer (processDefinitionId, processInstanceId) {
                processInstanceService.showDiagramViewer(processDefinitionId, processInstanceId)
            },
            initListData () {

                localStorage.setItem('currentUser', this.$route.params.currentUser);

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

                taskService.findTaskRunningProcesses(this.currentPage, this.pageSize).then((response) => {

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