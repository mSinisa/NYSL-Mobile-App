var app = new Vue({
    el: "#app",
    data: {
        teams: info.teams,
    },

    methods: {
        
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
