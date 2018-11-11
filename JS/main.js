var app = new Vue({
    el: "#app",
    data: {
        dates:info.dates,
        games: info.games,
    
    },
    computed: {
        getWeek: function() {
            console.log(this.week)
        }
    }

});
$('.slidingMenu').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    variableWidth: true,
    touchMove: true,
    swipeToSlide: false,

    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
            }
    },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
    }
  ]
});
