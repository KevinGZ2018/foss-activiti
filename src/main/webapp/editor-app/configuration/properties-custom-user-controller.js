
var KisBpmAssignmentCustomerUserPopupCtrl = [ '$scope', '$http', function($scope, $http) {

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

    $scope.initializeController = function () {

        $http({method: 'GET', url: 'user/list?currentPage=' + $scope.currentPageNum + '&pageSize=' + $scope.pageSize})

            .success(function (data) {
                $scope.content = data.content;
                $scope.totalElements = data.totalElements;

                $scope.calculatePageSize();
                $scope.renderPageBar();
            })

            .error(function (data) {
                console.log('Something went wrong when fetching stencil items:' + JSON.stringify(data));
            });
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

    $scope.calculatePageSize = function () {
        if($scope.totalElements % $scope.pageSize == 0) {
            $scope.totalPages = $scope.totalElements / $scope.pageSize;
        }
        else {
            $scope.totalPages = Math.ceil($scope.totalElements / $scope.pageSize);
        }
    };

    $scope.renderPageBar = function () {
        var showStartPageNum = 0;
        var showLastPageNum = 0;
        if($scope.currentPageNum < $scope.showPagesCount) {
            showLastPageNum = Math.min($scope.showPagesCount, $scope.totalPages);
            showStartPageNum = 1;
        }
        else {
            showLastPageNum = Math.min($scope.currentPageNum + $scope.showPagesCount - 1, $scope.totalPages);
            showStartPageNum = showLastPageNum - $scope.showPagesCount + 1;
        }

        for(var i=showStartPageNum; i<=showLastPageNum; i++) {
            $scope.showPages.push(i);
        }
    };

    $scope.pageChanged = function (pageChangedNum) {
        if(pageChangedNum < 1 || pageChangedNum > $scope.totalPages) {
            return;
        }

        $scope.currentPageNum = pageChangedNum;
        $scope.showPages = [];

        $scope.initializeController()
        //$scope.renderPageBar();
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

    $scope.singleChk = function (content) {
        $scope.choseArr = [];
        $scope.choseArr.push($scope.rebuildData(content));
        console.log(JSON.stringify($scope.choseArr))
    };

    $scope.rebuildData = function(content) {
        return 'u_' + content.id + '_' + content.name;
    };
}];
