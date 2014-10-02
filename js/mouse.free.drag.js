if (document.getElementById) {
        (function() {
            // contador do z-index
            var n = 500;
            var dragClass = "free-drag"
            var dragok = false; // fl
            var y, x, d, dy, dx;

            function move(e) {
                if (!e)
                    e = window.event;
                if (dragok) {
                    d.style.left = dx + e.clientX - x + "px";
                    d.style.top = dy + e.clientY - y + "px";
                    return false;
                }
            }

            function down(e) {
                if (!e)
                    e = window.event;
                var temp = (typeof e.target != "undefined") ? e.target
                        : e.srcElement;
                if (temp.tagName != "HTML" | "BODY"
                        && temp.className != dragClass) {
                    temp = (typeof temp.parentNode != "undefined") ? temp.parentNode
                            : temp.parentElement;
                }
                if (temp.className == dragClass) {

                    dragok = true;
                    temp.style.zIndex = n++;
                    d = temp;
                    dx = parseInt(temp.style.left + 0);
                    dy = parseInt(temp.style.top + 0);
                    x = e.clientX;
                    y = e.clientY;
                    document.onmousemove = move;
                    return false;
                }
            }

            function up() {
                dragok = false;
                document.onmousemove = null;
            }

            document.onmousedown = down;
            document.onmouseup = up;

        })();
    }