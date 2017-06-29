define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        findRunningProcessInstances: function (data1, data2) {
            return axios.get(globalConst.PROCESS_INSTANCE.URL.RUNNING_LIST +  "/" + data1 + "/" + data2)
        },
        findFinishedProcessInstances: function (data1, data2) {
            return axios.get(globalConst.PROCESS_INSTANCE.URL.FINISHED_LIST +  "/" + data1 + "/" + data2)
        },
        activeProcessInstance: function (data) {
            return axios.get(globalConst.PROCESS_INSTANCE.URL.ACTIVE_PROCESS +  "/" + data)
        },
        suspendProcessInstance: function (data) {
            return axios.get(globalConst.PROCESS_INSTANCE.URL.SUSPEND_PROCESS +  "/" + data)
        },
        getProcessInstanceTaskForm: function (data) {
            return axios.get(globalConst.PROCESS_INSTANCE.URL.GET_TASK_FORM + "/" + data)
        },
        completeProcessInstanceTask: function (processInstanceId, data) {
            return axios.post(globalConst.PROCESS_INSTANCE.URL.COMPLETE + "/" + processInstanceId, data)
        },
        showDiagramViewer: function (processDefinitionId, processInstanceId) {
            window.open(globalConst.PROCESS_INSTANCE.URL.DIAGRAM_VIEWER + "?processDefinitionId=" + processDefinitionId + "&processInstanceId=" + processInstanceId)
        }
    }
})