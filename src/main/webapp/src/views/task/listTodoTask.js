define([ 'vue', 'html!views/task/listTodoTask.html', 'globalConst', 'apis/taskService', 'taskFormModal' ],
    function(Vue, html, globalConst, taskService) {

    const PAGE = globalConst.PAGE

    return {
        template : html,
        data () {
            return {
                columns: [
                    {
                        title: '任务ID',
                        key: 'id',
                        width: 100,
                        align: 'center'
                    },
/*                    {
                        title: '任务Key',
                        key: 'taskDefinitionKey',
                        align: 'center'
                    },*/
                    {
                        title: '当前任务节点',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '流程定义ID',
                        key: 'processDefinitionId',
                        align: 'center'
                    },
                    {
                        title: '流程定义名称',
                        key: 'processDefinitionName',
                        align: 'center'
                    },
                    {
                        title: '流程实例ID',
                        key: 'processInstanceId',
                        align: 'center'
                    },
                    {
                        title: '优先级',
                        key: 'priority',
                        align: 'center'
                    },
                    {
                        title: '任务创建日期',
                        key: 'createTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.createTime))
                            ]);
                        }
                    },
/*                    {
                        title: '任务逾期日',
                        key: 'dueDate',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, Vue.filter('localDateString')(params.row.dueDate))
                            ]);
                        }
                    },*/
/*                    {
                        title: '任务描述',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '任务所属人',
                        key: 'owner',
                        align: 'center'
                    },*/
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: params.row.assignee ? 'primary' : 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            if(params.row.assignee) {
                                                this.handle(params.row.id)
                                            }
                                            else {
                                                this.claim(params.row.id)
                                            }
                                        }
                                    }
                                }, params.row.assignee ? '办理' : '签收')
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
                localStorage.setItem('currentGroup', this.$route.params.currentGroup);
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
            handle (id) {
                this.$refs.taskformchild.show(true, id)
            },
            claim (id) {
                taskService.claimTask(id).then((response) => {

                    var result = response.data
                    if('success' === result.state) {

                        this.$Message.success({
                            content: result.msg,
                            duration: 5
                        });

                        this.refreshCurrentPageData()
                    }
                    else {
                        this.$Message.error(result.msg)
                    }

                }).catch((error) => {
                    console.log(error)
                })
            },
            initListData () {

                localStorage.setItem('currentUser', this.$route.params.currentUser);
                localStorage.setItem('currentGroup', this.$route.params.currentGroup);

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

                taskService.findTodoTasks(this.currentPage, this.pageSize).then((response) => {

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