angular.module('ng-optimizely', ['ng'])
.provider('optimizely', function() {
    var key;
    var activationEventName = '$viewContentLoaded';
    this.setKey = function(val) {
        key = val;
    };
    this.setActivationEventName = function(val) {
        activationEventName = val;
    };
    this.$get = ['$rootScope', '$window', '$timeout', '$q'
, function($rootScope, $window, $timeout, $q) {
    var service = $window.optimizely = $window.optimizely || [];

    service.loadProject = function() {
      if (document.getElementById('optimizely-js') || key == void 0) {
        return;
      }

      var deferred = $q.defer();

      script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'optimizely-js';
      script.async = true;
      script.src = 'https://cdn.optimizely.com/js/' + key + '.js';
      script.onload = script.onreadystatechange = function () {
        deferred.resolve($window.optimizely);
      };
      script.onerror = script.onreadystatechange = function (error) {
        deferred.reject(error);
      };

      first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);

      deferred.promise.then(function() {
        if (!activationEventName) {
          console.log('pushing optimizely activate');
          $window.optimizely.push(['activate']);
        } else {
          $rootScope.$on(activationEventName, function() {
            $timeout(function() {
              $window.optimizely.push(['activate']);
            });
          });
        }
      });

      return deferred.promise;
    };

    return service;
}]});
