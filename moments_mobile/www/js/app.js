var moments_raw;

// bootstrap here
$(function () {
    init_collapsable_header();


    $('#moments_body_container').html('<div style="height: 1500px;"><div style="background-color:navy;height:300px"></div><div style="background-color:lightblue;height:300px"></div></div>');

    var scrollView = new IScroll('#scrollable_body',  { preventDefault: false });
    var momentsview = new MomentsView({
        data: moments_raw,
        el: $('#moments_body_container')[0],
        scrollView: scrollView
    });
    momentsview.render();
});

// http://iscrolljs.com/
IScroll.prototype.lock = function () {
    $(this.wrapper).css({'overflow': 'hidden'});
    this.disable()
};
IScroll.prototype.unlock = function () {
    $(this.wrapper).css({'overflow': ''});
    this.enable();
};

function init_collapsable_header () {
    var $header = $('.header');
    $('#scrollable_body').on('scroll', _.debounce(function (event) {
        var scrollTop = $(event.currentTarget).scrollTop();
        if (scrollTop > 80) {
            $header.addClass('collapsed');
        } else {
            $header.removeClass('collapsed');
        }
    }, 100));
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
