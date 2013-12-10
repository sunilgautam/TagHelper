$(document).ready(function() {
	$input_box = $("#input-box");
	$delete_box = $("#delete-box");
    $tagger_container = $("#tagger-container");
    $tagger_new_point = $("#tagger-new-point");
    $input_box_content = $("#input-box-content");
    $conteiner_threshhold = $tagger_container.offset();
    $conteiner_threshhold.right = $conteiner_threshhold.left + $tagger_container.width();
    $conteiner_threshhold.bottom = $conteiner_threshhold.top + $tagger_container.height();
    $point_width = 5;
    $point_height = 5;

	function init() {
        getTags(function(tags) {
            for (var i = 0; i < tags.length; i++) {
                renderPoint(tags[i]);
            };

            startTooltip();
        });

        $tagger_container.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;

            showInputPoint(x, y);
            showInputBox(x, y);
        });

        $tagger_container.on("click", ".point-item", function(e) {
            e.preventDefault();
            e.stopPropagation();

            var x = $(this).data('pos-x');
            var y = $(this).data('pos-y');
            var id = $(this).data('point-id');
            showDeleteBox(x, y, id);
        });

        $("#input-box-save").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            if($input_box_content.val().replace(/\s/g,"") == "") {
                alert("Please enter something");
            } else {
                addTag
                (
                    $input_box_content.data('pos-x'), 
                    $input_box_content.data('pos-y'), 
                    $input_box_content.val(),
                    function(tag) {
                        hideInputPoint();
                        hideInputBox();
                        renderPoint(tag);
                        startTooltip();
                    }
                );
            }
        });

        $("#input-box-cancel").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideInputPoint();
            hideInputBox();
        });

        $("#delete-box-delete").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            removeTag
            (
                $delete_box.data('point-id'),
                function(id) {
                    hideDeleteBox();
                    removePoint(id);
                }
            );
        });

        $("#delete-box-cancel").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideDeleteBox();
        });

        $input_box.on("click", function(e) {
            e.stopPropagation();
        });

        $delete_box.on("click", function(e) {
            e.stopPropagation();
        });

        $(document).on("click", "html", function(e) {
            e.stopPropagation();
            hideInputPoint();
            hideInputBox();
            hideDeleteBox();
        });
	}

    function startTooltip() {
        $(".point-item").tipTip({defaultPosition: "top"});
    }

    function showInputPoint(x, y) {
        $tagger_new_point.css({'top': (y - $point_height), 'left': (x - $point_width)});
        $tagger_new_point.show();
    }

    function hideInputPoint() {
        $tagger_new_point.hide();
    }

	function showInputBox(x, y) {
        var top  = (y - $input_box.height()) - 10;
        var left  = (x - ($input_box.width() / 2));
        var right = left + $input_box.width();
        var bottom = top + $input_box.height();

        if (left < $conteiner_threshhold.left) {
            left = left + ($conteiner_threshhold.left - left);
        } else if (right > $conteiner_threshhold.right) {
            left = (right - (right - $conteiner_threshhold.right)) - $input_box.width() - 10;
        }

        if (top < $conteiner_threshhold.top) {
            top = y + 10;
        }

		$input_box.css({'top': top, 'left': left});
        $input_box_content.data('pos-x', x);
        $input_box_content.data('pos-y', y);
        $input_box.show();
	}

    function hideInputBox() {
        $input_box_content.val('');
        $input_box.hide();
    }

    function showDeleteBox(x, y, id) {
        var top  = (y - $delete_box.height()) - 10;
        var left  = (x - ($delete_box.width() / 2));
        var right = left + $delete_box.width();
        var bottom = top + $delete_box.height();

        if (left < $conteiner_threshhold.left) {
            left = left + ($conteiner_threshhold.left - left);
        } else if (right > $conteiner_threshhold.right) {
            left = (right - (right - $conteiner_threshhold.right)) - $delete_box.width() - 10;
        }

        if (top < $conteiner_threshhold.top) {
            top = y + 10;
        }

        $delete_box
        .css({'top': top, 'left': left})
        .data({'point-id': id})
        .show();
    }

    function hideDeleteBox() {
        $delete_box.hide();
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

    function removePoint(id) {
        $('#point-' + id).remove();
    }


    /********************* AJAX CALL TO DYNAMIC PAGE TO ADD AND REMOVE TAGS IN PERSISTANT STORAGE *********************/
    function getTags(callback) {
        if (localStorage.tags == null || localStorage.tags == "null" || localStorage.tags == undefined || localStorage.tags == "undefined") {
            localStorage.tags = "[]";
        }

        callback(JSON.parse(localStorage.tags));
    }

    function addTag(x, y, content, callback) {
        var len, list, oldobj, new_id;
        if (localStorage.tags === void 0) {
            localStorage.tags = "[]";
        }
        oldobj = JSON.parse(localStorage.tags);
        len = Object.keys(oldobj).length;

        if (len < 1) {
            new_id = 1;
        } else {
            new_id = oldobj[len - 1].id + 1;
        }

        list = {id: new_id, top: y, left: x, text: content};
        oldobj[len] = list;
        localStorage.tags = JSON.stringify(oldobj);

        callback(list);
    }

    function removeTag(id, callback) {
        console.log(id);
    	var len, list, oldobj, index = -1;
        if (localStorage.tags === void 0) {
            localStorage.tags = "[]";
        }
        oldobj = JSON.parse(localStorage.tags);

        for (var i = 0; i < oldobj.length; i++) {
            if (oldobj[i].id == id) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            oldobj.splice(index, 1);
        }
        localStorage.tags = JSON.stringify(oldobj);
        callback(id);
    }
    /****************************************************************************/

    init();
});