$(".js-add").click(function() {
    var item = $(this).closest('.js-product')[0];
    var image = $(item).find('.js-product-image')[0];

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(
        {
            item: item.dataset.item,
            price: item.dataset.price,
            image: image.src
        }
    );

    localStorage.setItem("cart", JSON.stringify(cart));
});
