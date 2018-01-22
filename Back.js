/**
 * Created by admin on 2017/11/23.
 */
/*bgApp*/
(function () {
    'use strict';

    angular
        .module('bgApp',['ui.router','ngFileUpload']);
})();

/*bgCtrl*/
(function(){
    angular
        .module('bgApp')
        .controller('bgCtrl',['$rootScope','$http',bg]);
    function bg($rootScope,$http) {
        $rootScope.userData={};
        $rootScope.artlistData={};
        $rootScope.addData = {
            id: '',
            status: '',
            img: ''
        };
        $rootScope.paginationconf={
            totalpage:[],
            curpage:1
        };
        $rootScope.total=0;
        $rootScope.isEmpty=true;
        $rootScope.isUpload=false;
        $rootScope.isUpStatus=false;
        $rootScope.progressPercentage=0;
        $rootScope.postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (data) {
                return $.param(data);
            }
        };

        $rootScope.logout= function () {
            $http.post('/carrots-admin-ajax/a/logout')
                .success(function (data) {
                    if (data.code == 0) {
                        localStorage.clear();
                        window.location.href = "/";
                    }else {
                        alert(data.message);
                    }
                }).error(function () {
                    alert("服务器错误");
                })
        };

        $rootScope.userData.id=localStorage.getItem('id');
        $rootScope.userData.name=localStorage.getItem('name');
    }
})();

/*jobListCtrl*/
(function(){
    angular
        .module('bgApp')
        .controller('jobListCtrl',['$scope','$http',jl]);
    function jl($scope,$http){
        $http.get('/carrots-admin-ajax/a/profession/search')
            .success(function (data) {
                if (data.code == 0) {
                    $scope.joblistData=data.data;
                }
            }).error(function () {
                alert("服务器错误");
            });
    }
})();

/*comListCtrl*/
(function(){
    angular
        .module('bgApp')
        .controller('comListCtrl',['$scope','$http',cl]);
    function cl($scope,$http){
        $http.get('/carrots-admin-ajax/a/company/search')
            .success(function (data) {
                if (data.code == 0) {
                    $scope.comlistData=data.data;
                }
            }).error(function () {
                alert("服务器错误");
            });
    }
})();

/*artListCtrl*/
(function(){
    angular
        .module('bgApp')
        .controller('artListCtrl',['$scope','$rootScope','$http','getPageService',al]);

    function al($scope,$rootScope,$http,getPageService) {
        $scope.seaData={};
        $http.get('/carrots-admin-ajax/a/article/search?page=1&size=10')
            .success(function (data) {
                if (data.code == 0) {
                    $rootScope.artlistData=data.data.articleList;
                    getPageService.getPage(data.data);
                }
            }).error(function () {
                alert("服务器错误");
            });

        $scope.sea= function () {
            $rootScope.paginationconf.curpage=1;
            var url='/carrots-admin-ajax/a/article/search?size=10';

            $scope.turnPage($rootScope.paginationconf.curpage,url);
        };

        $scope.cle= function () {
            $scope.seaData={};
        };

        $scope.turnPre= function () {
            if($rootScope.paginationconf.curpage>1){
                $rootScope.paginationconf.curpage-=1;
                $scope.turnPage($rootScope.paginationconf.curpage,'/carrots-admin-ajax/a/article/search?size=10');
            }
        };

        $scope.turnNext= function () {
            if($rootScope.paginationconf.curpage<$rootScope.paginationconf.totalpage.length){
                $rootScope.paginationconf.curpage+=1;
                $scope.turnPage($rootScope.paginationconf.curpage,'/carrots-admin-ajax/a/article/search?size=10');
            }
        };

        $scope.turnPage= function (num,url) {
            if(num==undefined||num=='')return;

            if($scope.seaData.hasOwnProperty){
                if($scope.seaData.type!=undefined&&$scope.seaData.type!='')
                    url+='&type='+$scope.seaData.type;
                if($scope.seaData.status!=undefined&&$scope.seaData.status!='')
                    url+='&status='+$scope.seaData.status;
                if($scope.seaData.startAt!=undefined&&$scope.seaData.startAt!='')
                    url+='&startAt='+Date.parse($scope.seaData.startAt);
                if($scope.seaData.endAt!=undefined&&$scope.seaData.endAt!='')
                    url+='&endAt='+Date.parse($scope.seaData.endAt);
            }
            url+='&page=';
            $http.get(url+num)
                .success(function (data) {
                    if (data.code == 0) {
                        $rootScope.artlistData=data.data.articleList;
                        getPageService.getPage(data.data);
                    }
                }).error(function () {
                    alert("服务器错误");
                });
        };
    }
})();

/*addCtrl*/
(function() {
    angular
        .module('bgApp')
        .controller('addCtrl', ['$scope', '$http','$rootScope','$location', add]);

    function add($scope, $http, $rootScope,$location) {
        $rootScope.isUpload=false;
        $rootScope.isEmpty=true;
        $rootScope.progressPercentage=0;
        $scope.addSub = function (status) {
            $rootScope.addData.status =status;
            $http.post('/carrots-admin-ajax/a/u/article', $rootScope.addData, $rootScope.postCfg)
                .success(function (data) {
                    if (data.code == 0) {
                        $location.path('/ArticleList');
                    } else {
                        alert(data.message);
                    }
                }).error(function () {
                    alert("服务器错误");
                });
        };
    }
})();

/*getPageService*/
(function() {
    angular
            .module('bgApp')
            .service('getPageService', function ($rootScope) {
                var self=this;
                this.getPage= function (data) {
                    $rootScope.paginationconf.totalpage=[];
                    for(var i=0;i<Math.ceil(data.total/10);i++){
                        $rootScope.paginationconf.totalpage.push(i+1);
                    }
                    $rootScope.paginationconf.curpage=data.page;
                }
            })
})();

/*directive*/
(function() {
    angular
        .module('bgApp')
        .directive('ngUpload', ['$http','$rootScope',function($http,$rootScope) {
            return {
                restrict: 'EA',
                link: function (scope, el, attrs) {
                    scope.init = function () {
                        if (scope.files == null) {
                            scope.files = [];
                        }
                    };

                    scope.pushFile = function (file) {
                        scope.init();

                        scope.files.push(file);
                        $rootScope.isEmpty=false;
                    };

                    scope.removeFile = function () {
                        if (scope.files != null && scope.files.length > 0) {
                            scope.files.splice(0, 1);
                            $rootScope.isEmpty=true;
                            $rootScope.isUpload = false;
                            $rootScope.progressPercentage=0;
                        }
                    };

                    scope.uploadFiles = function () {
                        var fd = new FormData();
                        fd.append("file", this.files[0]);
                        $http({
                            method:'POST',
                            url: '/carrots-admin-ajax/a/u/img/task',
                            data: fd,
                            withCredentials: true,
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity,
                            uploadEventHandlers: {
                                progress: function(e) {
                                    if (e.lengthComputable) {
                                        $rootScope.isUpStatus=true;
                                        $rootScope.progressPercentage = e.loaded / e.total * 100;
                                    }
                                }
                            }
                        }).success(function (data) {
                            $rootScope.addData.img = data.data.url;
                            $rootScope.isUpload = true;
                            $rootScope.isUpStatus=false;
                        }).error(function () {
                            $rootScope.isUpload = false;
                            $rootScope.isUpStatus=false;
                            alert("服务器错误");
                        })
                    };

                    el.bind('change', function () {
                        var files = this.files;

                        scope.pushFile(files[0]);
                        scope.$apply();
                    });
                }
            }
        }]);
})();

/*config*/
(function(){
    angular
        .module('bgApp')
        .config(function($stateProvider,$urlRouterProvider) {
            $urlRouterProvider.when('','/Welcome');
            $stateProvider.state('ArticleList',{
                url:'/ArticleList',
                templateUrl: 'ArticleList.html'
            }).state('JobList',{
                url:'/JobList',
                templateUrl: 'JobList.html'
            }).state('CompanyList',{
                url:'/CompanyList',
                templateUrl: 'CompanyList.html'
            }).state('addArticle',{
                url:'/addArticle',
                templateUrl: 'addArticle.html'
            }).state('Welcome',{
                url:'/Welcome',
                templateUrl: 'Welcome.html'
            }).state('accMag',{
                url:'/accMag',
                templateUrl: 'Welcome.html'
            }).state('chaMag',{
                url:'/chaMag',
                templateUrl: 'Welcome.html'
            }).state('ediPwd',{
                url:'/ediPwd',
                templateUrl: 'Welcome.html'
            }).state('modMag',{
                url:'/modMag',
                templateUrl: 'Welcome.html'
            });
        })
})();

/*filter*/
(function () {
    'use strict';

    angular
        .module('bgApp')
        .filter('exc', function () {
            return function (input) {
                var out = [];
                if (input != undefined) {
                    for (var i = 0; i < input.length; i++) {
                        out[i] = input[i];
                        out[i].id = i + 1;
                        switch (out[i].type) {
                            case 0:
                                out[i].type = '首页banner';
                                break;
                            case 1:
                                out[i].type = '找职位banner';
                                break;
                            case 2:
                                out[i].type = '找精英banner';
                                break;
                            case 3:
                                out[i].type = '行业大图';
                                break;
                        }
                        switch (out[i].status) {
                            case 1:
                                out[i].status = '草稿';
                                break;
                            case 2:
                                out[i].status = '上线';
                                break;
                        }
                    }
                    return out;
                }
            }
        })
        /*.filter('group', function () {
            return function (items, groupSize) {
                var groups = [],
                    inner;
                for (var i = 0; i < items.length; i++) {
                    if (i % groupSize === 0) {
                        inner = [];
                        groups.push(inner);
                    }
                    inner.push(items[i]);
                }
                return groups;
            };
        });*/
})();

/*箭头动画*/
$(function(){
    $('#infoMa').click(function() {
        if ($(this).find('span').hasClass("glyphicon glyphicon-menu-left")) {
            $('#infoMa_list1').css('display','block');
            $('#infoMa_list2').css('display','block');
            $(this).find('div').css('display','block');
            $(this).find('span.glyphicon.glyphicon-menu-left').addClass(" glyphicon-menu-down");
            $(this).find('span.glyphicon.glyphicon-menu-left.glyphicon-menu-down').removeClass(" glyphicon-menu-left");
        }
        else {
            $('#infoMa_list1').css('display','none');
            $('#infoMa_list2').css('display','none');
            $(this).find('div').css('display','none');
            $(this).find('span.glyphicon.glyphicon-menu-down').addClass(" glyphicon-menu-left");
            $(this).find('span.glyphicon.glyphicon-menu-down.glyphicon-menu-left').removeClass(" glyphicon-menu-down");
        }
    });
});
$(function(){
    $('#artMa').click(function() {
        if ($(this).find('span').hasClass("glyphicon glyphicon-menu-left")) {
            $('#artMa_list1').css('display','block');
            $(this).find('div').css('display','block');
            $(this).find('span.glyphicon.glyphicon-menu-left').addClass(" glyphicon-menu-down");
            $(this).find('span.glyphicon.glyphicon-menu-left.glyphicon-menu-down').removeClass(" glyphicon-menu-left");
        }
        else {
            $('#artMa_list1').css('display','none');
            $(this).find('div').css('display','none');
            $(this).find('span.glyphicon.glyphicon-menu-down').addClass(" glyphicon-menu-left");
            $(this).find('span.glyphicon.glyphicon-menu-down.glyphicon-menu-left').removeClass(" glyphicon-menu-down");
        }
    });
});
$(function(){
    $('#bgMa').click(function() {
        if ($(this).find('span').hasClass("glyphicon glyphicon-menu-left")) {
            $('#bgMa_list1').css('display','block');
            $('#bgMa_list2').css('display','block');
            $('#bgMa_list3').css('display','block');
            $('#bgMa_list4').css('display','block');
            $(this).find('div').css('display','block');
            $(this).find('span.glyphicon.glyphicon-menu-left').addClass(" glyphicon-menu-down");
            $(this).find('span.glyphicon.glyphicon-menu-left.glyphicon-menu-down').removeClass(" glyphicon-menu-left");
        }
        else {
            $('#bgMa_list1').css('display','none');
            $('#bgMa_list2').css('display','none');
            $('#bgMa_list3').css('display','none');
            $('#bgMa_list4').css('display','none');
            $(this).find('div').css('display','none');
            $(this).find('span.glyphicon.glyphicon-menu-down').addClass(" glyphicon-menu-left");
            $(this).find('span.glyphicon.glyphicon-menu-down.glyphicon-menu-left').removeClass(" glyphicon-menu-down");
        }
    });
});
