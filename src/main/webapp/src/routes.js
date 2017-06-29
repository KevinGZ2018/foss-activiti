define([], function() {

    const routes = [
        {
            path: '/index',
            component : function(resolve) {
                require([ "views/index" ], resolve)
            }
        },
        {
            path: '/model_list',
            component: (resolve) => require(['views/model/listModel'], resolve)
        },
        {
            path: '/model_add',
            component: (resolve) => require(['views/model/addModel'], resolve)
        },
        {
            path: '/process_list',
            component: (resolve) => require(['views/process/listProcess'], resolve)
        },
        {
            path: '/processinstance_running_list',
            component: (resolve) => require(['views/processInstance/listRunningProcessInstance'], resolve)
        },
        {
            path: '/processinstance_finished_list',
            component: (resolve) => require(['views/processInstance/listFinishedProcessInstance'], resolve)
        },
        {
            path: '/task_process_list/:currentUser',
            component: (resolve) => require(['views/task/listTaskProcess'], resolve)
        },
        {
            path: '/task_history_process_list/:currentUser',
            component: (resolve) => require(['views/task/listTaskHistoryProcess'], resolve)
        },
        {
            path: '/todo_task_list/:currentUser/:currentGroup',
            component: (resolve) => require(['views/task/listTodoTask'], resolve)
        },


        {
            path: '/data_source_view/:id',
            component: (resolve) => require(['views/dataSource/viewDataSource'], resolve)
        },
        {
            path: '/query_statement_list',
            component: (resolve) => require(['views/queryStatement/listQueryStatement'], resolve)
        },
        {
            path: '/query_statement_edit/:id',
            component: (resolve) => require(['views/queryStatement/editQueryStatement'], resolve)
        },
        {
            path: '/query_statement_view/:id',
            component: (resolve) => require(['views/queryStatement/viewQueryStatement'], resolve)
        },
        {
            path: '/step_config_data_source',
            component: (resolve) => require(['views/queryStatement/stepConfigDataSource'], resolve)
        },
        {
            path: '/step_config_table',
            component: (resolve) => require(['views/queryStatement/stepConfigTable'], resolve)
        },
        {
            path: '/step_config_query_statement',
            component: (resolve) => require(['views/queryStatement/stepConfigQueryStatement'], resolve)
        },
        {
            path: '/list_query_view',
            component: (resolve) => require(['views/queryView/listQueryView'], resolve)
        },
        {
            path: '/customize_list_query_view',
            component: (resolve) => require(['views/queryView/customizeListQueryView'], resolve)
        },
        {
            path: '/list_data_source_and_query_statement',
            component: (resolve) => require(['views/queryView/listDataSourceAndQueryStatement'], resolve)
        }
    ];
    return routes;

})
