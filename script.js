var _regexpHashtags = /#([\S-]+)/g;

function getHashtagsFromTitle(title) {
    var hashtags = [];
    var result = _regexpHashtags.exec(title);
    while (result != null) {
        hashtags.push(result[1]);
        result = _regexpHashtags.exec(title);
    }

    return hashtags;
}
var CardHelper = {
    titleTag: function (card) {
        var details = $(card).children('.list-card-details');
        return details.eq(0).children('.list-card-title').eq(0);
    },

    getTitle: function(card) {
        var originalTitleTag = CardHelper.titleTag(card);

        var nodeTitle = originalTitleTag.contents().filter(function () { //this method tries to cover cases when trello changes their html
            return this.nodeType == 3;
        });
        if (nodeTitle && nodeTitle.length > 0)
            title = nodeTitle[0].nodeValue;
        else {
            title = "";  //hack. some cases e.g. user moving the card while this runs, returns no node
            bResetHtmlLast = true;
        }
        return title;
    }
}
function RefreshCards() {
    $('.list-card').each(function (i) {

        var title = CardHelper.getTitle(this);
        var hashtags = getHashtagsFromTitle(title);

        /*hide original title and create cloned copy to manipulate */
        var originalTitleTag = CardHelper.titleTag(this);
        var cloneTitleTag = null;
        var originalTitleSiblings = originalTitleTag.siblings('a.list_card_title_extensioned');
        if (originalTitleSiblings.length == 0) {
            cloneTitleTag = originalTitleTag.clone();
            originalTitleTag.hide();
            //originalTitleTag.addClass('agile_hidden');
            cloneTitleTag.addClass('list_card_title_extensioned');
            originalTitleTag.after(cloneTitleTag);
        } else {
            cloneTitleTag = $(originalTitleSiblings[0]);
        }


/*manipulate cloned copy */
        var isTitle = false;
        if (hashtags.length > 0) {
            title = title.replace("#title", "");
            if (hashtags.indexOf("title") > -1) {
                isTitle = true;
            }

            cloneTitleTag.html(title);
        }

        if (isTitle) {
            $(this).addClass("card-subtitle");
        } else {
            $(this).removeClass("card-subtitle");
        }
    });
}
RefreshCards();

/*
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    RefreshCards();
});
*/
var _mainContent = $('.board-main-content');
var _lastHtml = "";
setInterval(function() {

    var currentHtml = _mainContent.html();
    if (_lastHtml != currentHtml) {
        RefreshCards();
        _lastHtml = _mainContent.html();
    }
}, 2000);
// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
    subtree: false,
    childList: true,
    attributes: false
});