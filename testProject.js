var app = angular.module('testProject', ['components', 'ngRoute'])
 
.controller('MainCtrl', function($scope, facebookService) {
    const user_id = '5550296508'; //https://www.facebook.com/cnn
    facebookService.getAlbums(user_id)
    .then(function (response) {
           $scope.albums = response.data.data;
        }, function (error) {
            console.log(error);
        }
    );
})
.controller('AlbumCtrl', function($scope, $routeParams, facebookService) {
    $scope.album_id = $routeParams.album_id;
    facebookService.getPhotos($scope.album_id)
    .then(function (response) {
           $scope.photos = response.data.data;
        }, function (error) {
            console.log(error);
        }
    );
})
.controller('PhotoCtrl', function($scope, $routeParams, facebookService) {

    $scope.album_id = $routeParams.album_id;
    $scope.photo_id = $routeParams.photo_id;

    facebookService.getPhoto($scope.photo_id)
    .then(function (response) {
           $scope.photo = response.data;
        }, function (error) {
            console.log(error);
        }
    );
})
.config(function($routeProvider) {
$routeProvider
    .when('/', {
      templateUrl:'listAlbums.html'
    })
    .when('/albums/:album_id', {
      controller:'AlbumCtrl',
      templateUrl:'listPhotos.html'
    })
    .when('/albums/:album_id/photo/:photo_id', {
      controller:'PhotoCtrl',
      templateUrl:'detail.html'
    })
    .when('/new', {
      controller:'NewCtrl',
      templateUrl:'detail.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})
.factory('facebookService', function($q, $http) {

    // Этот сервис должен быть построен на Javascript SDK Facebook API.

    // Фесбук сильно усложнил создание приложений с доступом к данным юзеров.
    // К приложению предъявляется много требований + происходит проверка в течении 5 рабочих дней
    // код с использованием Javascript SDK :

    // Инициализация:
    //  window.fbAsyncInit = function() {
    //     FB.init({
    //       appId            : 'your-app-id',
    //       autoLogAppEvents : true,
    //       xfbml            : true,
    //       version          : 'v2.9'
    //     });
    //     FB.AppEvents.logPageView();
    //   };

    // (function(d, s, id){
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) {return;}
    //     js = d.createElement(s); js.id = id;
    //     js.src = "//connect.facebook.net/en_US/sdk.js";
    //     fjs.parentNode.insertBefore(js, fjs);
    // }(document, 'script', 'facebook-jssdk'));

    // Пример метода, которые используются ниже:
    // getAlbums: function() {
    //     var deferred = $q.defer();
    //     FB.api('/'+ user_id +'/albums', { fields: 'name,count,picture,created_time' }, function(response) {
    //         if (!response || response.error) {
    //             deferred.reject('Error occured');
    //         } else {
    //             deferred.resolve(response);
    //         }
    //     });
    //     return deferred.promise;
    // }

    // Для решеня использовался сервис $http с токеном доступа
    // Токен устаревает через несколько часов.
    // Для работы приложения запросите новый токен.

    const access_token = 'EAACEdEose0cBAEEnQQce7j8kQQDDZA4rlWRWggWhphWO23ML3ZA9JuakJICEf2JQNtgbf0pHgbjOHx0vvbfgeK5NqkOyIcqBhLhhZCZCtEPJq9RrD2A8i34Wi7QnuwvlS5k8gJwtwAlWlyf2BDO80UAthSH3eheHH40EhgHtuqfG6ZB1G3XfE5pzZCh8JRJZCwZD';
    return {
        getAlbums: function(user_id) {
            var fields = 'name,count,picture,created_time';
            var deferred = $q.defer();
            $http.get( 'https://graph.facebook.com/v2.9/'+ user_id +'/albums?access_token='+ access_token +'&fields='+ fields +'&method=get'
            ).then(function successCallback(response) {
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    deferred.reject(response);
            });
            return deferred.promise;
        },
        getPhotos: function(album_id) {
            var fields = 'name,count,description,created_time,images';
            var deferred = $q.defer();
            $http.get( 'https://graph.facebook.com/v2.9/'+ album_id +'/photos?access_token='+ access_token +'&fields='+ fields +'&method=get'
            ).then(function successCallback(response) {
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    deferred.reject(response);
            });
            return deferred.promise;
        },
        getPhoto: function(id) {
            var fields = 'name,created_time,images';
            var deferred = $q.defer();
            $http.get( 'https://graph.facebook.com/v2.9/'+ id +'?access_token='+ access_token +'&fields='+ fields +'&method=get'
            ).then(function successCallback(response) {
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    deferred.reject(response);
            });
            return deferred.promise;
        },
    }
});
