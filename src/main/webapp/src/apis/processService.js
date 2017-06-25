define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        findProcesses: function (data1, data2) {
            return axios.get(globalConst.PROCESS.URL.LIST +  "/" + data1 + "/" + data2)
        },
        showResourceFile: function (processId, resourceType) {
            window.open(globalConst.PROCESS.URL.READ_PROCESS_RESOURCE + "?processDefinitionId=" + processId + "&resourceType=" + resourceType)
        },
        activeProcess: function (data) {
            return axios.get(globalConst.PROCESS.URL.ACTIVE_PROCESS +  "/" + data)
        },
        suspendProcess: function (data) {
            return axios.get(globalConst.PROCESS.URL.SUSPEND_PROCESS +  "/" + data)
        },
        convertToModel: function (data) {
            return axios.get(globalConst.PROCESS.URL.CONVERT_TO_MODEL +  "/" + data)
        },
        getProcessStartForm: function (data) {
            return axios.get(globalConst.PROCESS.URL.GET_START_FORM + "/" + data)
        },
        startProcess: function (processId, data) {
            return axios.post(globalConst.PROCESS.URL.START_PROCESS + "/" + processId, data)
        }
    }
})