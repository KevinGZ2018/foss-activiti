define([ 'vue', 'html!views/task/listTaskHistoryProcess.html', 'globalConst', 'apis/taskService', 'remove', 'historyTaskFormModal' ],
    function(Vue, html, globalConst, taskService) {

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
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
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
                                            this.view(params.row.id)
                                        }
                                    }
                                }, '查看详情')
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
        computed: {
            /**
             * key是用来阻止“复用”的。
             * Vue 为你提供了一种方式来声明“这两个元素是完全独立的——不要复用它们”。
             * 只需添加一个具有唯一值的 key 属性即可(Vue文档原话)*/
            key() {
                localStorage.setItem('currentUser', this.$route.params.currentUser);
                //return this.$route.path !== undefined ? this.$route.path : this.$route
                return this.$route.params.currentUser
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
        mounted() {
            this.initListData()
        },
        methods: {
            view (id) {
                this.$refs.historytaskformchild.show(true, id)
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

                taskService.findTaskHistoryProcesses(this.currentPage, this.pageSize).then((response) => {

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