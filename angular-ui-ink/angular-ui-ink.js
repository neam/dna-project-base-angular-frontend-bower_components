'use strict';

var toQueryString = function toQueryString(obj, prefix) {
  var str = [];
  for (var p in obj) {
    var k = prefix ? prefix + '[' + p + ']' : p,
      v = obj[p];
    str.push(typeof v === 'object' ?
      toQueryString(v, k) :
      encodeURIComponent(k) + '=' + encodeURIComponent(v));
  }
  return str.join('&');
};

angular.module('ui.ink', [])
  .service('angularFilepicker', function($window) {
    return $window.filepicker;
  })
  .directive('input', function(angularFilepicker) {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function(scope, element, attrs, ctrl) {
        if ((attrs.type === 'filepicker' || attrs.type === 'filepicker-dragdrop') && ctrl) {
          angularFilepicker.constructWidget(element[0]);
          // Our ng-model is an array of filepicker handle urls
          ctrl.$parsers.push(function(value) {
            if (angular.isString(value)) {
              // split value into separate urls, making sure to handle convert-parameters
              // example input value: https://www.filepicker.io/api/file/BHco4pXgiYtN9KFjZTyS/convert?crop=0,46,666,671,https://www.filepicker.io/api/file/kvnTESiCGDkxGFRpE3HR,https://www.filepicker.io/api/file/uNDKXZsyzVpDGtwQEX0w,https://www.filepicker.io/api/file/dLz6EVr7e6ZDORCm0rZO/convert?crop=0,0,501,370
              var urls = value.split(',http');
              for (var i = 1; i < urls.length; i++) {
                urls[i] = "http" + urls[i];
              }
              return urls;
            }
            return value;
          });
        }
      }
    };
  })
  .directive('filemanager', function(angularFilepicker) {
    return {
      restrict: 'E',
      scope: {
        picks: '=ngModel',
        inkOptions: '=',
      },
      require: 'ngModel',
      link: function($scope, element, attrs, ctrl) {
        if ($scope.inkOptions.apiKey) {
          angularFilepicker.setKey($scope.inkOptions.apiKey);
        }
        $scope.$watch('picks', function(value) {
          $scope.picks = value;
        });
        // our ctrl is an array of entities
        ctrl.$isEmpty = function(value) {
          return _.isUndefined(value) || value === '' || value === null || value !== value || value.length === 0;
        };
        // function imageMime(mime){
        //   return mime.indexOf('image/') === 0;
        // }
        // ctrl.$formatters.push(function(value){
        //   // Check the mime type of every image returned
        //   // some google results can give us html
        //   $q.all(_.map(value, function(v){
        //     var d = $q.defer();
        //     filepicker.stat(v, d.resolve, d.reject);
        //     return d.promise;
        //   })).then(function(results){
        //     var validity = _.every(_.pluck(results, 'mimetype'), imageMime);
        //     console.log(validity);
        //     console.log(results);
        //     ctrl.$setValidity('image', validity);
        //     return validity ? value : undefined;
        //   });
        //   return value;
        // });
      },
      controller: function($scope) {
        $scope.picks = $scope.picks || [];
        this.addPicks = function(picks) {
          $scope.picks = $scope.picks.concat(picks);
        };
        this.removePick = function(index) {
          $scope.picks.splice(index, 1);
        };
        this.inkOptions = $scope.inkOptions;
      }
    };
  })
  .directive('picker', function(angularFilepicker) {
    return {
      require: '^filemanager',
      link: function(scope, element, attrs, fileManager) {
        element.on('click', function() {
          angularFilepicker.pickAndStore(fileManager.inkOptions, {}, function(picks) {
            scope.$apply(function() {
              fileManager.addPicks(_.pluck(picks, 'url'));
            });
          });
          return false;
        });
      }
    };
  })
  .directive('removePick', function() {
    return {
      require: '^filemanager',
      link: function(scope, element, attrs, fileManager) {
        var pickIndex = scope.$eval(attrs.removePick);
        element.on('click', function() {
          scope.$apply(function() {
            fileManager.removePick(pickIndex);
          });
          return false;
        });
      }
    };
  })
  .filter('thumbnail', function() {
    return function(input, width, height, fit) {
      if (!input) {
        return;
      }
      var options = {
        'w': width,
        'h': height,
        'fit': fit,
        'rotate': 'exif'
      };
      return input + '/convert?' + toQueryString(options);
    };
  });