var moments_raw;

// bootstrap here
$(function () {
    var scrollView = new ScrollView('#scrollable_body');
    init_collapsable_header(scrollView);

    var momentsview = new MomentsView({
        data: moments_raw,
        el: $('#moments_body_container')[0],
        scrollView: scrollView
    });
    momentsview.render();

});

function init_collapsable_header (scrollView) {
    var _should_track_scroll = false;
    var _timeout = undefined;
    var adjust_collapsable_header = function () {
        var $header = $('.header');
        if (scrollView.y < -80) {
            $header.addClass('collapsed');
        } else {
            $header.removeClass('collapsed');
        }
        if (_should_track_scroll) {
            _timeout = setTimeout(adjust_collapsable_header, 100);
        }
    };

    scrollView.on('scrollStart', function () {
        _should_track_scroll = true;
        clearTimeout(_timeout);
        adjust_collapsable_header(scrollView);

    });
    scrollView.on('scrollEnd', function () { _should_track_scroll = false; });
    scrollView.on('scrollCancel', function () { _should_track_scroll = false; });
}

moments_raw = [{ 
    id: 109,
    username: 'leannagrand', members: ['gracetherope', 'karlinthehouse'], description: 'Summer fun as a raft guide. ::emoji::',
    posted_on: '2hrs', view_count: 12, comment_count: 5,
    photos: [
        { snaps: 2, src: 'img/moments/leannagrand_1.jpg',
          comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
                     { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
        { snaps: 8, src: 'img/moments/leannagrand_2.jpg',
          comments: [] },
        { snaps: 0, src: 'img/moments/leannagrand_3.jpg',
          comments: [] },
    ]

}, {
    id: 90,
    username: 'leannagrand', members: ['gracetherope', 'karlinthehouse'], description: 'Summer fun as a raft guide. ::emoji::',
    posted_on: '2hrs', view_count: 12, comment_count: 5,
    photos: [
        { snaps: 2, src: 'img/moments/leannagrand_1.jpg',
          comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
                     { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
        { snaps: 8, src: 'img/moments/leannagrand_2.jpg',
          comments: [] },
        { snaps: 0, src: 'img/moments/leannagrand_3.jpg',
          comments: [] },
    ]

}, {
    id: 89,
    username: 'leannagrand', members: ['gracetherope', 'karlinthehouse'], description: 'Summer fun as a raft guide. ::emoji::',
    posted_on: '2hrs', view_count: 12, comment_count: 5,
    photos: [
        { snaps: 2, src: 'img/moments/leannagrand_1.jpg',
          comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
                     { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
        { snaps: 8, src: 'img/moments/leannagrand_2.jpg',
          comments: [] },
        { snaps: 0, src: 'img/moments/leannagrand_3.jpg',
          comments: [] },
    ]

}, {
    id: 88,
    username: 'leannagrand', members: ['gracetherope', 'karlinthehouse'], description: 'Summer fun as a raft guide. ::emoji::',
    posted_on: '2hrs', view_count: 12, comment_count: 5,
    photos: [
        { snaps: 2, src: 'img/moments/leannagrand_1.jpg',
          comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
                     { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
        { snaps: 8, src: 'img/moments/leannagrand_2.jpg',
          comments: [] },
        { snaps: 0, src: 'img/moments/leannagrand_3.jpg',
          comments: [] },
    ]
}];
