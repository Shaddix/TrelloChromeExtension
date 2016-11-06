function RefreshCards() {
    $('.list-card').each(function (i) {
        var label = $(this).find('.card-label-blue');
        if (label.length > 0) {
            $(this).addClass("card-subtitle");
        } else {
            $(this).removeClass("card-subtitle");
        }
    });
}
RefreshCards();

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    RefreshCards();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: false
});