$(document).ready(function() {
    $tagger_container = $("#tagger-container");
    $point_width = 5;
    $point_height = 5;

	function init() {
        getTags(function(tags) {
            for (var i = 0; i < tags.length; i++) {
                renderPoint(tags[i]);
            };

            startTooltip();
        });
	}

    function startTooltip() {
        $(".point-item").tipTip({defaultPosition: "top"});
    }

    function renderPoint(tag) {
        $('<img/>', 
        {
            id: 'point-' + tag.id,
            src: 'images/point.png',
            title: tag.text,
            class: 'point-item'
        })
        .css({
            top: (tag.top - $point_height), 
            left: (tag.left - $point_width), 
            position: "absolute",
            height: "10px",
            width: "10px",
            'z-index': (tag.id + 1)
        })
        .data({
            'pos-x': tag.left,
            'pos-y': tag.top,
            'point-id': tag.id
        })
        .appendTo($tagger_container);
    }


    /********************* AJAX CALL TO DYNAMIC PAGE TO ADD AND REMOVE TAGS IN PERSISTANT STORAGE *********************/
    function getTags(callback) {
        if (localStorage.tags == null || localStorage.tags == "null" || localStorage.tags == undefined || localStorage.tags == "undefined") {
            localStorage.tags = "[]";
        }

        callback(JSON.parse(localStorage.tags));
    }
    /****************************************************************************/

    init();
});