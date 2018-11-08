var app = new Vue({
    el: "#app",
    data: {
        week: "",
        info: info.league_schedule,
        teams: info.teams,
        getTeamRanking: function () {
            var sortedTeams = Array.from(this.teams);
            sortedTeams.sort(function (a, b) {
                return (a["pts"] < b["pts"]) ? 1 : ((b["pts"] < a["pts"]) ? -1 : 0);
            });
            return sortedTeams;
        }
    },
    computed: {

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
