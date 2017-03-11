/* global angular */
'use strict'

angular.module('public._common').directive('addToCart', addToCartDirective)
addToCartController.$inject = ['CartService', '$scope', '$state', '$rootScope']

/*  eslint camelcase: "off" */

function addToCartDirective() {
    return {
        restrict: 'A',
        replace: 'true',
        link: addToCartLink,
        controller: addToCartController,
        controllerAs: 'vm',
        scope: {
            addToCart: '=',
            quantity: '=?'
        }
    }
}

function addToCartLink(scope, elem, attrs, vm) {
    elem.on('click', addToCart)
    function addToCart(campaign) {
        scope.$apply(vm.addToCart(scope.addToCart, scope.quantity))
    }
}

function addToCartController(CartService, $scope, $state, $rootScope) {
    var vm = this
    vm.userId = $rootScope.user.id
    vm.addToCart = _addToCart
    vm.isDisabled = false
    if (!$rootScope.user === 0) {
        vm.userId = $rootScope.user.id
    }

    function _addToCart(campaign, quantity) {
        var item = {
            shopping_cart: {
                campaign: campaign._id,
                quantity: campaign.quantity,
                price: campaign.price,
                name: campaign.name,
                options: {
                    paper_type: campaign.options.paper_type,
                    size: campaign.options.size
                }
            }
        }

        CartService.addItemToCart(vm.userId, item, onAddSuccess, onError)
    }

    function onAddSuccess(id, data) {
        $rootScope.$broadcast('shoppingCartUpdate', vm.shoppingCart)
        console.log(vm.campaign)
    }

    function onError(err) {
        console.log(err)
    }
}
