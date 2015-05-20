// Show extra actions
$('body').on('click', '.js-toggle-actions', function() {
    $('.js-product').removeClass('c--actions-visible');
    $(this).closest('.js-product').addClass('c--actions-visible');
    return false;
});

// Close all visible actions
$('body').on('click', function() {
    var $visibleActions = $('.js-product.c--actions-visible');
    $visibleActions.removeClass('c--actions-visible');
    if ($visibleActions.length > 0) {
        return false;
    }
});