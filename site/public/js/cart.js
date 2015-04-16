$(".add-to-cart").click(function() {
    var item = $(this).closest('.item')[0];
    var image = $(item).find('img')[0];

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({item: item.dataset.item, image: image.src});

    localStorage.setItem("cart", JSON.stringify(cart));
});
