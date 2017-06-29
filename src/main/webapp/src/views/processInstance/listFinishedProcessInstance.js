define([ 'vue', 'html!views/processInstance/listFinishedProcessInstance.html', 'globalConst', 'apis/processInstanceService' ],
    function(Vue, html, globalConst, processInstanceService) {

    const MODULE = globalConst.PROCESS_INSTANCE
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
                        title: '流程开始时间',
                        key: 'startTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.startTime))
                            ]);
                        }
                    },
                    {
                        title: '流程结束时间',
                        key: 'endTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.endTime))
                            ]);
                        }
                    },
                    {
                        title: '流程结束原因',
                        key: 'completedReason',
                        align: 'center'
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

                processInstanceService.findFinishedProcessInstances(this.currentPage, this.pageSize).then((response) => {

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