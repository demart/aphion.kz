(function ($) {
    $(document).ready(function () {
            $(document).on('click', '.controls a', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            // Dimensions of the whole book
            var BOOK_WIDTH = 1225;
            var BOOK_HEIGHT = 340;

            // Dimensions of one page in the book
            var PAGE_WIDTH = 574;
            var PAGE_HEIGHT = 312;
            // Vertical spacing between the top edge of the book and the papers
            var PAGE_Y = ( BOOK_HEIGHT - PAGE_HEIGHT ) / 4;

            // The canvas size equals to the book dimensions + this padding
            var CANVAS_PADDING = 0;

            var page = 0;

            var canvas = document.getElementById("pageflip-canvas");
            
            if(canvas == null) {
                return false;
            }
            var context = canvas.getContext("2d");

            var input = { x:0, y:0};
            var flips = [];

            var book = document.getElementById("book");

            // List of all the page elements in the DOM
            var pages = book.getElementsByTagName("section");

            var isAnimationR = false, isAnimationL = false, down_next = false;
            var btn_right = $('#right'), btn_left = $('#left');

            var offsetX = $(book).offset().left;
            var offsetY = $(book).offset().top - $(document).scrollTop();


            // Offset the canvas so that it's padding is evenly spread around the book
            canvas.style.top = -CANVAS_PADDING + "px";
            canvas.style.left = -CANVAS_PADDING + "px";

            // Organize the depth of our pages and create the flip definitions
            for (var i = 0, len = pages.length; i < len; i++) {
                pages[i].style.zIndex = len - i;

                flips.push({
                    // Current progress of the flip (left -1 to right +1)
                    progress:1,
                    // The target value towards which progress is always moving
                    target:1,
                    // The page DOM element related to this flip
                    page:pages[i],
                    // True while the page is being dragged
                    dragging:false
                });
            }

            $(window).resize(function () {
                if (page == 0) {
                    offsetX = $(book).offset().left;
                }
                else {
                    offsetX = $(pages).offset().left + 20;
                }
            });

            $(window).scroll(function () {
                if (page == 0) {
                    offsetY = $(book).offset().top - $(document).scrollTop();
                }
                else {
                    offsetY = $(pages).offset().top - $(document).scrollTop() + 20;
                }
            });
            // Render the page flip 60 times a second
            setInterval(render, 1000 / 60);

            document.addEventListener("mousemove", mouseMoveHandler, false);
            document.addEventListener("mousedown", mouseDownHandler, false);
            document.addEventListener("mouseup", mouseUpHandler, false);
            document.addEventListener("touchmove", touchMoveHandler, false);
            document.addEventListener("touchstart", touchDownHandler, false);
            document.addEventListener("touchend", touchUpHandler, false);


            function mouseMoveHandler(e) {
                updateInput(e.clientX, e.clientY);
            }

            function mouseDownHandler(e) {
                if (e.which == 1) {
                    updateInput(e.clientX, e.clientY);
                    processDown(e);
                }
            }

            function mouseUpHandler(e) {
                updateInput(e.clientX, e.clientY);
                endDrag(input.x < 0);
            }


            var isTouch = false;

            function touchMoveHandler(event) {
                isTouch = true;
                updateInput(event.touches[0].pageX, event.touches[0].pageY);
            }

            function touchDownHandler(event) {
                isTouch = true;
                updateInput(event.touches[0].pageX, event.touches[0].pageY);
                processDown(event);
            }

            function touchUpHandler(event) {
                isTouch = true;
                updateInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
                endDrag(input.x < 0);
            }


            initCover();

            function updateCanvas() {
                // Resize the canvas to match the book size
                canvas.width = BOOK_WIDTH + ( CANVAS_PADDING * 2 );
                canvas.height = BOOK_HEIGHT + ( CANVAS_PADDING * 2 );
            }

            function initCover() {
                //TODO: init page size for cover, hide navigation elements
                PAGE_WIDTH = 607;
                PAGE_HEIGHT = 340;
                PAGE_Y = ( BOOK_HEIGHT - PAGE_HEIGHT ) / 4;

                offsetX = $(book).offset().left;
                offsetY = $(book).offset().top - $(document).scrollTop();

                $('.book-left').hide();
                $('#left').hide();
                $('.control').removeClass('active');

                updateCanvas();
            }

            function initPage() {
                //TODO: init page size for pages, show navigation elements
                PAGE_WIDTH = 574;
                PAGE_HEIGHT = 312;
                PAGE_Y = ( BOOK_HEIGHT - PAGE_HEIGHT + 20) / 4;

                offsetX = $(pages).offset().left + 20;
                offsetY = $(pages).offset().top - $(document).scrollTop() + 20;

                $('.book-left').show();
                $('#left').show();

                updateCanvas();
            }


            function updateInput(x, y) {
                input.x = x - offsetX;
                input.y = y - offsetY;
            }

            function tryDragPrev() {
                if (page - 1 >= 0) {
                    flips[page - 1].dragging = true;
                    flips[page - 1].target = -1;
                }
                if(page -1 == 0)
                {
                    $('.book-left').hide();
                }
            }

            function tryDragNext() {
                if (page + 1 < flips.length) {
                    flips[page].dragging = true;
                    flips[page].target = 1;
                }
            }

            function endDrag(up_next) {

                if (!isAnimationR && !isAnimationL) {
                    for (var i = 0; i < flips.length; i++) {
                        // If this flip was being dragged, animate to its destination
                        if (flips[i].dragging) {
                            // Figure out which page we should navigate to
                            if (up_next && down_next) {
                            //  next_page
                                flips[i].target = -1;
                                page = Math.min(page + 1, flips.length);
                            }
                            else if (!up_next && down_next) {
                                flips[i].target = 1;
                            }
                            else if (up_next && !down_next) {
                                flips[i].target = -1;
                            }
                            else if (!up_next && !down_next) {
                                {
                                 //  prev_page
                                    flips[i].target = 1;
                                    page = Math.max(page - 1, 0);
                                }
                            }
                        }
                        flips[i].dragging = false;
                    }
                    if (page == 0) {
                        initCover();
                    }
                    else if (page == 1 && up_next) {
                        initPage();
                    }

                    if (page + 1 == pages.length) {
                        $(btn_right).hide();
                    }
                    else if (!$(btn_right).is(':visible')) {
                        $(btn_right).show();
                    }

                    if (up_next || page >= 0) {
                        $('.control').siblings().removeClass('active');
                        $('.controls .control.c' + [page]).addClass('active');
                    }
                }
            }


            function processDown(event) {
                // if right button is pressed
                if (event.clientX > parseInt(btn_right.offset().left) && event.clientX < parseInt(btn_right.offset().left + btn_right.width()) && event.clientY > parseInt(btn_right.offset().top - $(document).scrollTop()) && event.clientY < parseInt(btn_right.offset().top - $(document).scrollTop() + btn_right.height())) {
                    if (!isAnimationR) {
                        isAnimationR = true;
                        tryDragNext();
                        setTimeout(function () {
                            down_next = true;
                            isAnimationR = false;
                            endDrag(true);
                        }, 400);
                    }
                }
                // if left button is pressed

                else if (event.clientX > parseInt(btn_left.offset().left) && event.clientX < parseInt(btn_left.offset().left + btn_left.width()) && event.clientY > parseInt(btn_left.offset().top - $(document).scrollTop()) && event.clientY < parseInt(btn_left.offset().top - $(document).scrollTop() + btn_left.height())) {
                    if (!isAnimationL) {
                        isAnimationL = true;
                        tryDragPrev();
                        setTimeout(function () {
                            down_next = false;
                            isAnimationL = false;
                            endDrag(false);
                        }, 400);
                    }
                }
                else {
                    // Make sure the input pointer is inside of the book
                    if (input.y > 0 && input.y < PAGE_HEIGHT) {
                        if (Math.abs(input.x) < PAGE_WIDTH) {
                            if (input.x < 0) {
                                // We are on the left side, drag the previous page
                                down_next = false;
                                tryDragPrev();
                            }
                            else if (input.x > 0) {
                                // We are on the right side, drag the current page
                                down_next = true;
                                tryDragNext();
                            }
                        }
                    }
                }
                // Prevents the text selection
                event.preventDefault;
            }


            function render() {
                // Reset all pixels in the canvas
                context.clearRect(0, 0, canvas.width, canvas.height);

                for (var i = 0, len = flips.length; i < len; i++) {
                    var flip = flips[i];

                    if (flip.dragging) {
                        if (isAnimationR) {
                            flip.target -= 0.08;
                        }
                        else if (isAnimationL) {
                            flip.target += 0.08;
                        }
                        else if (isTouch) {
                            flip.target = Math.max(Math.min(input.x / PAGE_WIDTH, 1), -1);
                        }
                        else {
                            flip.target = Math.max(Math.min(input.x / PAGE_WIDTH, 1), -1);
                        }
                    }

                    // Ease progress towards the target value
                    flip.progress += ( flip.target - flip.progress ) * 0.2;

                    //console.log("flip.progress="+flip.progress+" flip.target="+flip.target );

                    // If the flip is being dragged or is somewhere in the middle of the book, render it
                    if (flip.dragging || Math.abs(flip.progress) < 0.997) {
                        drawFlip(flip);
                    }

                }

            }

            function drawFlip(flip) {
                // Strength of the fold is strongest in the middle of the book
                var strength = 1 - Math.abs(flip.progress);
                if (strength > 0.00004) {

                    // Width of the folded paper
                    var foldWidth = ( PAGE_WIDTH * 0.5 ) * ( 1 - flip.progress );

                    // X position of the folded paper
                    var foldX = PAGE_WIDTH * flip.progress + foldWidth;

                    // How far the page should outdent vertically due to perspective
                    var verticalOutdent = 20 * strength;

                    // The maximum width of the left and right side shadows
                    var paperShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max(Math.min(1 - flip.progress, 0.5), 0);
                    var rightShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max(Math.min(strength, 0.5), 0);
                    var leftShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max(Math.min(strength, 0.5), 0);


                    // Change page element width to match the x position of the fold
                    flip.page.style.width = Math.max(foldX, 0) + "px";

                    context.save();
                    context.translate(CANVAS_PADDING + ( BOOK_WIDTH / 2 ), PAGE_Y + CANVAS_PADDING);


                    // Draw a sharp shadow on the left side of the page
                    context.strokeStyle = 'rgba(0,0,0,' + (0.05 * strength) + ')';
                    context.lineWidth = 30 * strength;
                    context.beginPath();
                    context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
                    context.lineTo(foldX - foldWidth, PAGE_HEIGHT + (verticalOutdent * 0.5));
                    context.stroke();


                    // Right side drop shadow
                    var rightShadowGradient = context.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
                    rightShadowGradient.addColorStop(0, 'rgba(0,0,0,' + (strength * 0.2) + ')');
                    rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');

                    context.fillStyle = rightShadowGradient;
                    context.beginPath();
                    context.moveTo(foldX, 0);
                    context.lineTo(foldX + rightShadowWidth, 0);
                    context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
                    context.lineTo(foldX, PAGE_HEIGHT);
                    context.fill();


                    // Left side drop shadow
                    var leftShadowGradient = context.createLinearGradient(foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
                    leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
                    leftShadowGradient.addColorStop(1, 'rgba(0,0,0,' + (strength * 0.15) + ')');

                    context.fillStyle = leftShadowGradient;
                    context.beginPath();
                    context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
                    context.lineTo(foldX - foldWidth, 0);
                    context.lineTo(foldX - foldWidth, PAGE_HEIGHT);
                    context.lineTo(foldX - foldWidth - leftShadowWidth, PAGE_HEIGHT);
                    context.fill();


                    // Gradient applied to the folded paper (highlights & shadows)
                    var foldGradient = context.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
                    foldGradient.addColorStop(0.35, '#f2f2f2');
                    foldGradient.addColorStop(0.73, '#eeeeee');
                    foldGradient.addColorStop(0.9, '#fafafa');
                    foldGradient.addColorStop(1.0, '#e2e2e2');

                    context.fillStyle = foldGradient;
                    context.strokeStyle = 'rgba(0,0,0,0.06)';
                    context.lineWidth = 0.5;

                    // Draw the folded piece of paper
                    context.beginPath();
                    context.moveTo(foldX, 0);
                    context.lineTo(foldX, PAGE_HEIGHT);
                    context.quadraticCurveTo(foldX, PAGE_HEIGHT + (verticalOutdent * 2), foldX - foldWidth, PAGE_HEIGHT + verticalOutdent);
                    context.lineTo(foldX - foldWidth, -verticalOutdent);
                    context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);

                    context.fill();
                    context.stroke();

                    context.restore();
                }
            }
    }
    )
})(jQuery);