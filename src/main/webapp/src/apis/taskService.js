define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        findTaskProcesses: function (data1, data2) {
            return axios.get(globalConst.TASK.URL.TASK_PROCESS_LIST +  "/" + data1 + "/" + data2)
        },
        findTodoTasks: function (data1, data2) {
            var currentUser = localStorage.getItem('currentUser');
            var currentGroup = localStorage.getItem('currentGroup');
            var data = "currentUser=" + currentUser + "&currentGroup=" + currentGroup;
            return axios.post(globalConst.TASK.URL.TODO_TASK_LIST +  "/" + data1 + "/" + data2, data)
        },
        getStartForm: function (data) {
            return axios.get(globalConst.TASK.URL.GET_START_FORM + "/" + data)
        },
        startProcessInstance: function (processId, data) {
            var currentUser = localStorage.getItem('currentUser');
            data = data + "currentUser=" + currentUser;
            return axios.post(globalConst.TASK.URL.START_PROCESS_INSTANCE + "/" + processId, data)
        },
        getTaskForm: function (data) {
            return axios.get(globalConst.TASK.URL.GET_TASK_FORM + "/" + data)
        },
        getHistoryTaskForm: function (data) {
            return axios.get(globalConst.TASK.URL.GET_HISTORY_TASK_FORM + "/" + data)
        },
        completeTask: function (taskId, data) {
            var currentUser = localStorage.getItem('currentUser');
            data = data + "currentUser=" + currentUser;
            return axios.post(globalConst.TASK.URL.COMPLETE + "/" + taskId, data)
        },
        claimTask: function (taskId) {
            var currentUser = localStorage.getItem('currentUser');
            var data = "currentUser=" + currentUser;
            return axios.post(globalConst.TASK.URL.CLAIM + "/" + taskId, data)
        },
        findTaskHistoryProcesses: function (data1, data2) {
            return axios.get(globalConst.TASK.URL.TASK_HISTORY_PROCESS_LIST +  "/" + data1 + "/" + data2)
        },
    }
})