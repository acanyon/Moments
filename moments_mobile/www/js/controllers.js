angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.moments = [
    { username: 'leannagrand', description: 'Summer fun as a raft guide. ::emoji::',
        posted_on: '2hrs', view_count: 12, comment_count: 5,
        photos: [
            { loves: 2, src: 'img/moments/leannagrand_1.jpg',
              comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
                         { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
            { loves: 8, src: 'img/moments/leannagrand_2.jpg',
              comments: [] },
            { loves: 0, src: 'img/moments/leannagrand_3.jpg',
              comments: [] },
        ]
    }
  ];

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
