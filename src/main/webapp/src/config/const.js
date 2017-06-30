define([], function() {
    return {
        PAGE: {
            INIT_CURRENT_PAGE: 1,
            INIT_PAGE_SIZE: 10
        },
        MODEL: {
            URL: {
                LIST: '/workflow/model/list',
                ADD: '/workflow/model/add',
                REMOVE: '/workflow/model/remove',
                DEPLOY: '/workflow/model/deploy',
                EXPORT: '/workflow/model/export'
            },
            ROUTER: {
                LIST: '/model_list',
                ADD: '/model_add'
            }
        },
        PROCESS: {
            URL: {
                LIST: '/workflow/process/list',
                REMOVE: '/workflow/process/remove',
                READ_PROCESS_RESOURCE: '/workflow/process/resource/read',
                ACTIVE_PROCESS: '/workflow/process/update/active',
                SUSPEND_PROCESS: '/workflow/process/update/suspend',
                CONVERT_TO_MODEL: '/workflow/process/convert-to-model'
            },
            ROUTER: {
                LIST: '/process_list'
            }
        },
        PROCESS_INSTANCE: {
            URL: {
                RUNNING_LIST: '/workflow/processinstance/running/list',
                FINISHED_LIST: '/workflow/processinstance/finished/list',
                ACTIVE_PROCESS: '/workflow/processinstance/update/active',
                SUSPEND_PROCESS: '/workflow/processinstance/update/suspend',
                CONVERT_TO_MODEL: '/workflow/processinstance/convert-to-model',
                DIAGRAM_VIEWER: '/diagram-viewer/index.html'
            },
            ROUTER: {
                RUNNING_LIST: '/processinstance_running_list',
                FINISHED_LIST: '/processinstance_finished_list'
            }
        },
        TASK: {
            URL: {
                TASK_PROCESS_LIST: '/workflow/task/process/list',
                TASK_HISTORY_PROCESS_LIST: '/workflow/task/history-process/list',
                TASK_RUNNING_PROCESS_LIST: '/workflow/task/running-process/list',
                TODO_TASK_LIST: '/workflow/task/todo-task/list',
                GET_START_FORM: '/workflow/task/get-form/start',
                START_PROCESS_INSTANCE: '/workflow/task/start-processinstance',
                GET_TASK_FORM: '/workflow/task/get-form/task',
                GET_HISTORY_TASK_FORM: '/workflow/task/get-form/history-task',
                COMPLETE: '/workflow/task/complete-task',
                CLAIM: '/workflow/task/claim-task'
            },
            ROUTER: {
                TASK_PROCESS_LIST: '/task_process_list',
                TODO_TASK_LIST: '/todo_task_list'
            }
        }
    }
})