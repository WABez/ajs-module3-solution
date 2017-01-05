(function() {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com/")
	.directive('foundItems', foundItemsDirective);


	function foundItemsDirective() {
		var ddo = {
			templateUrl: 'foundItems.html',
			scope: {
				foundItem: '<',
				onRemove: '&'
			},
			controller: NarrowItDownDirectiveController,
		    controllerAs: 'NIDCtrlrDir',
		    bindToController: true
		};

		return ddo;
	}


	function NarrowItDownDirectiveController() {
		var NIDCtrlrDir = this;
	}


	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {
		var NIDCtrlr = this;

		NIDCtrlr.MenuItems = function() {
			if ((NIDCtrlr.searchTerm == undefined) || (NIDCtrlr.searchTerm === '')) {
				NIDCtrlr.foundItems = [];
				NIDCtrlr.message = "Nothing Found";
			} else {
				var promise = MenuSearchService.getMatchedMenuItems(NIDCtrlr.searchTerm);
				promise.then(function(response) {
					NIDCtrlr.foundItems = response;
					if (NIDCtrlr.foundItems.length === 0) {
						NIDCtrlr.foundItems = [];
						NIDCtrlr.message = "Nothing Found";
					} else {
						NIDCtrlr.message = "Found";
					}
				})
				.catch(function(error) {
					console.log('An error occured');
				});
			};
		};

		NIDCtrlr.removeFoundItems = function(itemIndex) {
			NIDCtrlr.foundItems.splice(itemIndex, 1);
		};
	}


	MenuSearchService.$inject = ['$http', 'ApiBasePath'];
	function MenuSearchService($http, ApiBasePath) {
		var service = this;

		service.getMatchedMenuItems = function(searchTerm) {
			var foundItems = [];

			return $http({
				method: "GET",
				url: (ApiBasePath + "menu_items.json")
			})
			.then(function(result) {
				for (var i = 0; i < result.data.menu_items.length; i++) {
					var description = result.data.menu_items[i].description;
					if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
						foundItems.push(result.data.menu_items[i]);
					}
				}

				return foundItems;
			});
		};
	}

})();