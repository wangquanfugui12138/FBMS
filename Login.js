/**
 * Created by admin on 2017/11/20.
 */
(function () {
    'use strict';

    angular
        .module('loginApp',[]);
})();

(function(){
    angular
        .module('loginApp')
        .controller('loginCtrl',['$scope','$http',log]);
    function log($scope,$http){
        $scope.userdata={};

        $scope.sb= function () {
            var postCfg ={
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (data) {
                    return $.param(data);
                }
            };

            if(this.userdata.name!=undefined&&this.userdata.pwd!=undefined) {
                $http.post('/carrots-admin-ajax/a/login', this.userdata, postCfg)
                    .success(function (data) {
                    if (data.code == 0) {
                        localStorage.setItem("id", data.data.manager.id);
                        localStorage.setItem("name", data.data.manager.name);
                        window.location.href = "Back.html";
                        /*$location.path('/Back');*/
                    }else {
                        alert(data.message);
                    }
                }).error(function () {
                    alert("服务器错误");
                })
            }
        }
    }
})();

var opt,tp;
window.onload = function () {
    opt = {
        container:'panoramaConianer',//容器
        url:'Image/p5.jpg',
        /*width: '2000px',//指定宽度，高度自适应*/
        //lables:[
        //    {position:{lon:-163.44,lat:-7.92},logoUrl:'',text:'鲤鱼群'},
        //    {position:{lon:114.12,lat:69.48},logoUrl:'',text:'云'},
        //    {position:{lon:-94.32,lat:-4.24},logoUrl:'',text:'芦苇'}
        //],
        widthSegments: 60,//水平切段数
        heightSegments: 40,//垂直切段数（值小粗糙速度快，值大精细速度慢）
        pRadius: 1000,//全景球的半径，推荐使用默认值
        minFocalLength: 6,//镜头最a小拉近距离
        maxFocalLength: 6,//镜头最大拉近距离
        showlable: 'show' // show,click
    };
    tp = new tpanorama(opt);
    tp.init();
};