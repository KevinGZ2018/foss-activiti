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
            path: '/task_running_process_list/:currentUser',
            component: (resolve) => require(['views/task/listTaskRunningProcess'], resolve)
        }
    ];
    return routes;

})
