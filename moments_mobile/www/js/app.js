var moments_raw;

// bootstrap here
$(function () {

    var momentsview = new MomentsView({
        data: moments_raw,
        el: $('#moments_body_container')[0],
        $header: $('#header')
    });
    momentsview.render();

    var composeView = new CompositionView({
        el: $('#new_moment_container')[0],
        show_modal: function () {
            $('body').addClass('show_modal');
            momentsview.scrollView.lock();
        },
        hide_modal: function () {
            $('body').removeClass('show_modal');
            momentsview.scrollView.unlock();
        },
    });

    var $footer = $('#footer');
    $footer.find('.publish').on('tap', function () {
        event.preventDefault(); event.stopPropagation();
        composeView.show();
    });
});

function init_cordova_stub () {
    window.cordova = window.cordova || { plugins: { Keyboard: 
        { disableScroll: _.noop, hideKeyboardAccessoryBar: _.noop }}};
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
