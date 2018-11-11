var app = new Vue({
    el: "#app",
    data: {

        teams: info.teams,

    },

    methods: {
        getTeamRanking: function () {
            var sortedTeams = Array.from(this.teams);
            sortedTeams.sort(function (a, b) {
                return (a["pts"] < b["pts"]) ? 1 : ((b["pts"] < a["pts"]) ? -1 : 0);
            });
            return sortedTeams;
        },

        getLogo: function (team) {
            if (team.logo.match(/blue_devils_logo/g)) {
                return "/styles/images/blue_devils_logo.png";
            } else if (team.logo.match(/golden_eagles_logo/g)) {
                return "styles/images/golden_eagles_logo.png";
            } else if (team.logo.match(/green_snakes_logo/g)) {
                return "styles/images/green_snakes_logo.png";
            } else if (team.logo.match(/horned_frogs_logo/g)) {
                return "styles/images/horned_frogs_logo.png";
            } else if (team.logo.match(/northside_jaguars_logo/g)) {
                return "styles/images/northside_jaguars_logo.png";
            } else {
                return "/styles/images/red_raiders_logo.png";
            }
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
