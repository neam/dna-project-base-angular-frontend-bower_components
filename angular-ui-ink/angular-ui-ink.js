'use strict';

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
          // Our ng-model is an array of images
          ctrl.$parsers.push(function(value) {
            if (angular.isString(value)) {
              return value.split(',');
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
          angularFilepicker.pickMultiple(fileManager.inkOptions, function(picks) {
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
      return input + '/convert?' + _.toQueryString(options);
    };
  });