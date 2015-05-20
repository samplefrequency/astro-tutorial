// Remove an item from the cart
$('body').on('click', '.js-remove', function() {
    var $product = $(this).closest('.js-product');
    $product.addClass('c--removed');

    var $products = $('.js-product');
    var index = $products.index($product);

    setTimeout(function() {
        $product.remove();
        removeCartItem(index);
        updateCartTotal();
    }, 500);

    return false;
});

var removeCartItem = function(index) {
    var cart = JSON.parse(localStorage.getItem("cart") || []);

    cart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(cart));
}

var updateCartItems = function() {
    updateCartTotal();

    var cart = JSON.parse(localStorage.getItem("cart")) || [];

    var item;
    var $cartItems = $('.c-product-list');
    $cartItems.empty();
    var cartLength = cart.length;

    for (var i = 0; i < cartLength; i++) {
        item = cart[i];

        $cartItems.append(
            '<article class="c-product js-product">' +
                '<div class="c-product__wrapper js-product-wrapper">' +
                    '<a href="/' + item.link + '/" class="c-product__link">' +
                        '<div class="c-product__details">' +
                            '<h1 class="c-heading c--h4 c-product__title">' + item.item + '</h1>' +
                            '<p class="c-product__price">$' + item.price + '</p>' +
                        '</div>' +
                        '<img src="' + item.image + '" alt="' + item.item + '" class="c-product__image">' +
                    '</a>' +
                    '<button class="c-button c--more js-toggle-actions"><span class="u-hidden">More</span></button>' +
                '</div>' +
                '<div class="c-product__actions">' +
                    '<button class="c-button c--action c--remove js-remove">Remove</button>' +
                '</div>' +
            '</article>'
        );
    }
};

var updateCartTotal = function() {
    var item;
    var totalPrice = 0.00;
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var cartLength = cart.length;

    $('body').toggleClass('c--empty', cartLength === 0);

    for (var i = 0; i < cartLength; i++) {
        item = cart[i];
        totalPrice += parseFloat(item.price);
    }

    $('.js-cart-total').text("$" + totalPrice.toFixed(2));
};

window.addEventListener('storage', updateCartItems);

updateCartItems();
