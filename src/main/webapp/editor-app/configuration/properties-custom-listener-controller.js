
var KisBpmAssignmentCustomerListenerPopupCtrl = [ '$scope', '$http', function($scope, $http) {

    $scope.showPagesCount = 4;
    $scope.showPages = [];
    $scope.totalElements = 0;
    $scope.totalPages = 0;
    $scope.currentPageNum = 1;
    $scope.pageSize = 2;

    $scope.choseArr = [];
    $scope.allCheckFlag = '';
    $scope.master = false;
    $scope.checkStatus = false;

    $scope.content = [];

    $scope.initializeController = function () {

          $scope.content.push(
              {"name":"指派直属领导监听器", "delegateExpression": "${findSuperiorsAssigneeListener}"},
              {"name":"指派间接领导监听器", "delegateExpression": "${findSuperiorsAssigneeListener2}"}
          );
    };

    $scope.search = function () {
        $scope.initializeController();
    };

    $scope.save = function() {
        $scope.setValue($scope.choseArr);
        $scope.close();
    };

    $scope.close = function() {
        //$scope.property.mode = 'read';
        $scope.$hide();
    };

    $scope.allCheck = function (master, content) {//全选
        if($scope.master == false) { // 选中
            $scope.checkStatus = false;
            for (var i = 0; i < content.length; i++) {
                $scope.choseArr[i] = $scope.rebuildData(content);
            }
        } else { // 反选
            $scope.checkStatus = true;
            $scope.choseArr = [];
        }
    };

    $scope.chk = function (content, elementCheckStatus) {
        var str = '';
        var data = $scope.rebuildData(content);

        if($scope.choseArr.length > 0) {
            str = $scope.choseArr.join(',') + ',';
        }

        if (elementCheckStatus == false) {//选中
            if($scope.choseArr.indexOf(data) > -1) {
                return;
            }
            str = str + data + ',';
        } else {
            str = str.replace(data + ',', '');//取消选中
        }
        $scope.choseArr = (str.substr(0, str.length-1)).split(',');
        console.log(JSON.stringify($scope.choseArr))
    };

    $scope.remove = function (item) {
        if($scope.choseArr  != null && $scope.choseArr  != undefined) {
            var index = $scope.choseArr.indexOf(item)
            if(index > -1) {
                $scope.choseArr.splice(index, 1)
            }
        }
    };

    $scope.rebuildData = function(content) {
        return content.name + '_' + content.delegateExpression;
    };
}];
