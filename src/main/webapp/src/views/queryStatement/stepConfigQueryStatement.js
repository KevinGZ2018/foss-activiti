define([ 'vue', 'html!views/queryStatement/stepConfigQueryStatement.html', 'globalConst', 'apis/queryStatementService', 'stepState', 'stepPreview', 'underscore' ],

    function(Vue, html, globalConst, queryStatementService) {

        const MODULE = globalConst.QUERY_STATEMENT
        const SEPARATOR = globalConst.SEPARATOR
        const STORE = globalConst.QUERY_STATEMENT_CREATE_STORE

        return {
            template: html,
            data () {
                return {
                    currentState: 2,
                    tables: STORE.tables,
                    model: STORE.queryStatementModel,
                    listStyle: {
                        width: '230px',
                        height: '350px'
                    },
                    saveModel: {
                        name: '',
                        description: '',
                        selectBody: '',
                        fromBody: '',
                        whereBody: ''
                    },
                    readySelectBodyColumns: [],
                    selectedSelectBodyColumns: [],
                    selectBodyPanelActiveKey: '1',
                    selectBodyPanelName: "收起",
                    readyWhereBodyColumns: [],
                    selectedWhereBodyColumns: [],
                    whereBodyPanelActiveKey: '1',
                    whereBodyPanelName: "收起",
                    ruleValidate: {
                        name: [
                            {required: true, message: '名称不能为空', trigger: 'blur'}
                        ]
                    }
                }
            },
            mounted () {
                this.loadPanel()
                this.loadPrimaryTableTableAndJoinTables()
                this.loadReadyColumns()
                this.loadSelectedSelectBodyColumns()
                this.loadSelectedWhereBodyColumns()
            },
            methods: {
                transformSaveModel () {

                    STORE.queryStatementModel = this.model

                    this.saveModel.name = this.model.name

                    this.saveModel.description = this.model.description

                    this.saveModel.selectBody = _.map(this.model.selectColumns, function (selectColumn) {
                        return selectColumn.name + SEPARATOR.SPACE_SPLIT + selectColumn.alias
                    }).join(", ")

                    var primary = this.model.primaryTable.name + SEPARATOR.SPACE_SPLIT + this.model.primaryTable.alias
                    var join = _.map(this.model.joinTables, function (joinTable) {
                        var joinHead = joinTable.type + SEPARATOR.SPACE_SPLIT + joinTable.name + SEPARATOR.SPACE_SPLIT + joinTable.alias
                        var joinBody = _.map(joinTable.onConditions, function (onCondition) {
                            return onCondition.onColumn + SEPARATOR.EQ_SPLIT + onCondition.refTable + SEPARATOR.DOT_SPLIT + onCondition.refColumn
                        }).join(SEPARATOR.AND_SPLIT)

                        return joinHead + SEPARATOR.ON_SPLIT + joinBody
                    }).join(SEPARATOR.SPACE_SPLIT)
                    this.saveModel.fromBody = primary + SEPARATOR.SPACE_SPLIT + join

                    this.saveModel.whereBody = _.map(this.model.whereConditions, function (whereCondition) {
                        return "[" +
                            whereCondition.andOr + SEPARATOR.SPACE_SPLIT +
                            whereCondition.whereColumn + SEPARATOR.SPACE_SPLIT +
                            whereCondition.meta + SEPARATOR.SPACE_SPLIT +
                            SEPARATOR.COLON_SPLIT + whereCondition.whereColumnType.toLowerCase() + SEPARATOR.UNDERLINE_SPLIT + whereCondition.queryParam +
                            "]"
                    }).join("")
                },
                previous () {
                    this.transformSaveModel()
                    this.$router.push(MODULE.ROUTER.STEP_CONFIG_TABLE)
                },
                complete (name) {
                    this.$refs[name].validate((valid) => {
                        if (valid) {

                            this.transformSaveModel()

                            queryStatementService.addQueryStatement(encodeURIComponent(JSON.stringify(this.saveModel))).then((response) => {

                                STORE.clear()
                                this.$router.push(MODULE.ROUTER.LIST)
                                this.$Message.success('添加成功!')

                            }).catch((error) => {
                                console.log(error)
                                this.$Message.error('添加失败!')
                            })
                        }
                    })
                },
                preview (name) {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.transformSaveModel()
                            this.$refs.steppreviewchild.show(true, this.saveModel)
                        }
                    })
                },
                loadPanel () {
                    if(this.model.selectColumns.length == 0) {
                        this.selectBodyPanelActiveKey = '1'
                        this.selectBodyPanelName = '收起'
                    }
                    else {
                        this.selectBodyPanelActiveKey = ''
                        this.selectBodyPanelName = '展开'
                    }

                    if(this.model.whereConditions.length == 0) {
                        this.whereBodyPanelActiveKey = '1'
                        this.whereBodyPanelName = '收起'
                    }
                    else {
                        this.whereBodyPanelActiveKey = ''
                        this.whereBodyPanelName = '展开'
                    }
                },
                loadSelectedSelectBodyColumns () {
                    var selectColumns = this.model.selectColumns
                    if(selectColumns.length > 0) {
                        for(var i in selectColumns) {
                            this.selectedSelectBodyColumns.push(selectColumns[i].name)
                        }
                    }
                },
                loadSelectedWhereBodyColumns () {
                    var whereConditions = this.model.whereConditions
                    if(whereConditions.length > 0) {
                        for(var i in whereConditions) {
                            var whereCondition = whereConditions[i]
                            var columnAndType = whereCondition.whereColumn + "#" + whereCondition.whereColumnType
                            this.selectedWhereBodyColumns.push(columnAndType)
                        }
                    }
                },
                loadPrimaryTableTableAndJoinTables () {
                    this.model.primaryTable = ""
                    this.model.joinTables = []
                    for(var i in this.tables) {
                        if(this.tables[i].type == 'PRIMARY') {
                            this.model.primaryTable = this.tables[i]
                        }
                        else {
                            this.model.joinTables.push(this.tables[i])
                        }
                    }
                },
                loadRefColumns (tableIndex, onConditionIndex) {
                    for(var i=0; i<this.tables.length; i++) {
                        if(this.model.joinTables[tableIndex].onConditions[onConditionIndex].refTable == this.tables[i].alias) {
                            var table = this.model.joinTables[tableIndex]
                            table.onConditions[onConditionIndex].refColumns = this.tables[i].columns
                            // 触发更新视图
                            this.$set(this.model.joinTables, tableIndex, table)
                            break
                        }
                    }
                },
                loadReadyColumns () {
                    for(var i=0; i<this.tables.length; i++) {
                        var columns = this.tables[i].columns
                        var tableAlias = this.tables[i].alias
                        for(var j=0; j<columns.length; j++) {
                            var columnName = columns[j].name
                            var columnType = "java.sql.Timestamp" == columns[j].type ? "date" : columns[j].type

                            this.readySelectBodyColumns.push({
                                key: tableAlias + SEPARATOR.DOT_SPLIT + columnName,
                                label: tableAlias + SEPARATOR.DOT_SPLIT + columnName,
                                disabled: false
                            });

                            this.readyWhereBodyColumns.push({
                                key: tableAlias + SEPARATOR.DOT_SPLIT + columnName + SEPARATOR.POUND_SIGN_SPLIT + columnType,
                                label: tableAlias + SEPARATOR.DOT_SPLIT + columnName,
                                disabled: false
                            });
                        }
                    }
                    this.selectedSelectBodyColumns = []
                    this.selectedWhereBodyColumns = []
                },
                handleSelectBodyChange (newSelectedSelectBodyColumns) {
                    var delColumns = []
                    for (var i in this.model.selectColumns) {
                        var column = this.model.selectColumns[i]
                        if (newSelectedSelectBodyColumns.indexOf(column.name) == -1) {
                            delColumns.push(column)
                        }
                    }
                    for (var i in delColumns) {
                        //this.model.selectColumns.remove(delColumns[i])
                        this.arrayRemove(this.model.selectColumns, delColumns[i])
                    }

                    for(var i in newSelectedSelectBodyColumns) {
                        var newSelectedSelectBodyColumn = newSelectedSelectBodyColumns[i]
                        if(this.selectedSelectBodyColumns.indexOf(newSelectedSelectBodyColumn) == -1) {
                            this.model.selectColumns.push({
                                name: newSelectedSelectBodyColumn,
                                alias: ''
                            })
                        }
                    }

                    this.selectedSelectBodyColumns = newSelectedSelectBodyColumns;
                },
                render (item) {
                    return item.label;
                },
                changeSelectBodyPanel (object) {
                    if(object.length == 0) {
                        this.selectBodyPanelName = '展开'
                    }
                    else {
                        this.selectBodyPanelName = '收起'
                    }
                },
                handleWhereBodyChange (newSelectedWhereBodyColumns) {
                    var delColumns = []
                    for (var i in this.model.whereConditions) {
                        var column = this.model.whereConditions[i]
                        var columnAndType = column.whereColumn + "#" + column.whereColumnType
                        if (newSelectedWhereBodyColumns.indexOf(columnAndType) == -1) {
                            delColumns.push(column)
                        }
                    }
                    for (var i in delColumns) {
                        //this.model.whereConditions.remove(delColumns[i])
                        this.arrayRemove(this.model.whereConditions, delColumns[i])
                    }

                    for(var i in newSelectedWhereBodyColumns) {
                        var newSelectedWhereBodyColumn = newSelectedWhereBodyColumns[i]
                        if(this.selectedWhereBodyColumns.indexOf(newSelectedWhereBodyColumn) == -1) {
                            var columnAndType = newSelectedWhereBodyColumn.split(SEPARATOR.POUND_SIGN_SPLIT)
                            this.model.whereConditions.push({
                                andOr: 'AND',
                                whereColumn: columnAndType[0],
                                whereColumnType: columnAndType[1],
                                meta: '=',
                                queryParam: ''
                            })
                        }
                    }

                    this.selectedWhereBodyColumns = newSelectedWhereBodyColumns;
                },
                changeWhereBodyPanel (object) {
                    if(object.length == 0) {
                        this.whereBodyPanelName = '展开'
                    }
                    else {
                        this.whereBodyPanelName = '收起'
                    }
                },
                add (tableIndex) {
                    var table = this.model.joinTables[tableIndex]
                    table.onConditions.push({onColumn: '', refTable: '', refColumn: ''})
                    // 触发更新视图
                    this.$set(this.model.joinTables, tableIndex, table)
                },
                remove (tableIndex, condition) {
                    var table = this.model.joinTables[tableIndex]

                    //table.onConditions.remove(condition)
                    this.arrayRemove(table.onConditions, condition)

                    // 触发更新视图
                    this.$set(this.model.joinTables, tableIndex, table)
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