//首页信息显示动画
$('.nav-move').animate({'opacity': '1', 'margin-top': '0'}, 1000, function () {
    move('.nav-con h2').duration(200)
        .scale(1.5).end().then(function () {
        move('.nav-con h2').scale(1).end()
    })
})


//首页模块滑动
$('.slide-warp').on('mousemove', function (e) {
    var len = (e.pageX / $(this).width()) * (1980 - $(window).width());
    $(".slide").css("transform", "translateX(-" + len + "px)");
})


window.onscroll = function () {
    if ($(window).scrollTop() > 1050) {
        move('.explain .pull-right').duration(1000).set('left', '0').end();
    }

}







