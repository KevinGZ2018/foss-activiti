define([ 'vue', 'html!views/queryStatement/stepConfigTable.html', 'globalConst', 'apis/queryStatementService', 'stepState' ],
    function(Vue, html, globalConst, queryStatementService) {

        const MODULE = globalConst.QUERY_STATEMENT
        const STORE = globalConst.QUERY_STATEMENT_CREATE_STORE

        return {
            template: html,
            data () {
                return {
                    currentState: 1,
                    panelActiveKey: '1',
                    panelName: '收起',
                    tablesWithColumns: {},
                    readyTables: [],
                    selectedTables: [],
                    listStyle: {
                        width: '250px',
                        height: '400px'
                    },
                    model: {
                        tables: STORE.tables
                    }
                }
            },
            mounted () {
                this.loadReadyTables()

                if(this.model.tables.length == 0) {
                    this.panelActiveKey = '1'
                    this.panelName = '收起'
                }
                else {
                    this.panelActiveKey = ''
                    this.panelName = '展开'
                }
            },
            methods: {
                previous () {
                    STORE.tables = this.model.tables
                    this.$router.push(MODULE.ROUTER.STEP_CONFIG_DATA_SOURCE)
                },
                next (name) {
                    this.$refs[name].validate((valid) => {
                        if (valid && this.model.tables.length > 0) {
                            var clearDuplicateTable = [this.model.tables[0]]
                            for(var j in this.model.tables) {
                                var table = this.model.tables[j]
                                if(clearDuplicateTable.indexOf(table) == -1) {
                                    if(table.type != 'PRIMARY' && table.onConditions == undefined) {
                                        table.onConditions = [{onColumn: "", refTable: "", refColumn: ""}]
                                    }
                                    clearDuplicateTable.push(table)
                                }
                            }
                            STORE.tables = clearDuplicateTable
                            this.$router.push(MODULE.ROUTER.STEP_CONFIG_QUERY_STATEMENT)
                        }
                    })
                },
                handleChange (newSelectedTables) {
                    for(var i in newSelectedTables) {
                        var selectedTableName = newSelectedTables[i]
                        if(this.selectedTables.indexOf(selectedTableName) == -1) {
                            this.model.tables.push({
                                type: (this.selectedTables.length == 0 && i == 0)? 'PRIMARY' : 'LEFT JOIN',
                                name: selectedTableName,
                                alias: '',
                                columns: this.tablesWithColumns[selectedTableName].columns
                            })
                        }
                    }
                    this.selectedTables = newSelectedTables;
                },
                render (item) {
                    return item.label;
                },
                loadReadyTables () {

                    queryStatementService.findTables(STORE.dataSourceId).then((response) => {

                        this.tablesWithColumns = response.data
                        for(var tableKey in this.tablesWithColumns) {
                            this.readyTables.push({
                                key: tableKey,
                                label: '表名: ' + tableKey,
                                disabled: false
                            });
                        }

                        this.model.tables = STORE.tables
                        this.selectedTables = []
                        if(this.model.tables.length > 0) {
                            for(var i in this.model.tables) {
                                var table = this.model.tables[i]
                                if(this.selectedTables.indexOf(table.name) == -1) {
                                    this.selectedTables.push(table.name)
                                }
                            }
                        }

                    }).catch(function(error) {
                        console.log(error)
                    })
                },
                changePanel (object) {
                    if(object.length == 0) {
                        this.panelName = '展开'
                    }
                    else {
                        this.panelName = '收起'
                    }
                },
                copy (table) {
                    this.model.tables.push({
                        type: 'LEFT JOIN',
                        name: table.name,
                        alias: '',
                        columns: table.columns
                    })
                },
                remove (table) {
                    //this.model.tables.$remove(table)
                    this.arrayRemove(this.model.tables, table)
                },
                arrayRemove (array, item) {
                    if(array != null && array != undefined) {
                        let index = array.indexOf(item)
                        if(index > -1) {
                            array.splice(index, 1)
                        }
                    }
                }
            }
        }
})
