var app = new Vue({
    el: "#app",
    data: {
        url: "https://api.jsonbin.io/b/5bf2e440f508a567790346c1",
//        league: info.league,
        league:[],
//        games: info.games,
        games:[],
//        teams: info.teams,
        teams:[],
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
        },

        indexBody: true,
        standings: false,
        locations: false,
        teamsPage: false,
        induvidualTeamPage: false,
        chatPage: false,
        accountPage: false,
        team: {},
        beforeLoginMsg: true,
        loginButton: false,
        logoutButton: false,


    },

    methods: {
        
                getData: function () {
            fetch(this.url, {
                    method: "GET",
                })
                .then(function (data) {
                    return data.json();
                })
                .then(function (myData) {
                    app.league = myData.league;
                    app.games = myData.games;
                    app.teams = myData.teams;
                })
        },

        showPage: function (id1) {
            this.accountPage = false;
            this.induvidualTeamPage = false;
            this.locations = false;
            this.standings = false;
            this.indexBody = false;
            this.teamsPage = false;
            this.chatPage = false;
            this[id1] = true;
        },

        getTeam: function (team) {
            this.team = team;
        },

        login: function () {
            //    https: //firebase.google.com/docs/auth/web/google-signin 
            // Provider
            var provider = new firebase.auth.GoogleAuthProvider();
            // How to Log In
            firebase.auth().signInWithPopup(provider).then(function () {
                console.log("login");
                app.logoutButton = true;
                app.loginButton = false;
                app.getPosts();
            });

            //on log in call the function getPosts to show chat messages

            //once you log in change the buttons
            //            this.changeButtonOnAuthState('logoutButton');
        },

        logout: function () {
            firebase.auth().signOut().then(function () {
                console.log("logOut")
                app.loginButton = true;
                app.logoutButton = false;
                
                // Sign-out successful.

            }, function (error) {
                // An error happened.

            });
        },

        writeNewPost: function () {
            // https://firebase.google.com/docs/database/web/read-and-write
            // Values
            var text = document.getElementById("textInput").value;
            console.log(text);
            var userName = firebase.auth().currentUser.displayName;
            // A post entry.
            var message = {
                messageText: text,
                name: userName,
                profileImg: firebase.auth().currentUser.photoURL
            }
            console.log(message);
            //CALL SCROLLING FUNCTION
            this.scrollDown();
            // Get a key for a new Post.
            firebase.database().ref('myChat').push(message);
            //Write data
            console.log("write");
        },

        getPosts: function () {
            firebase.database().ref('myChat').on('value', function (data) {
                console.log(data.val())
                var posts = document.getElementById("posts");
                posts.innerHTML = "";
                var messages = data.val();
                for (var key in messages) {
                    var text = document.createElement("div");
                    var element = messages[key];
                    /* ADD USER PHOTO**********************/
                    var photo = document.createElement("img");
                    photo.setAttribute("src", messages[key].profileImg);
                    photo.style.height = "50px";
                    photo.style.width = "50px";
                    photo.style.borderRadius = "50%";
                    photo.style.marginRight = "10px";
                    text.append(photo);
                    /**************************************************/
                    text.append(element.messageText);
                    posts.append(text);
                }
            })
            console.log("getting posts");
        },

        gotoPageIfSignedIn: function (page) {
            var user = firebase.auth().currentUser;
            if (user) {
                // User is signed in.
                this.showPage(page);
            } else {
                // No user is signed in.
                alert("Please go to Account Page and Login to see this content!")
            }
        },

        scrollDown: function () {
            document.getElementById('posts').scrollTop = document.getElementById('posts').scrollHeight
        },

        changeButtonOnAuthState: function () {

            var user = firebase.auth().currentUser;
            firebase.auth().onAuthStateChanged(function (user) {

                if (user) {
                    console.log("In", user)
                    app.loginButton = false;
                    app.logoutButton = true;
                } else {
                    app.logoutButton = false;
                    app.loginButton = true;

                }

            })
        }



        /******** CHANGE ICON ********/
        //icon changes no matter what
        //        changeLogoIfLoggedIn: function () {
        //            var accountIcon = document.getElementById("accountIcon");
        //            var updatedIcon= accountIcon.innerHTML = "<i data-brackets-id='698' class='fas fa-unlock fa-2x'></i> <p data-brackets-id='699' class='iconText'>Account</p>";
        //            var user = firebase.auth().currentUser;
        //            if (user) {
        //                // User is signed in.
        //               return updatedIcon;
        //            } else {
        //                // No user is signed in.
        //                return accountIcon;
        //            }
        //        }
    },

    computed: {

    },

    created() {
        this.getPosts();
        this.changeButtonOnAuthState();
        this.getData();
        //        this.changeLogoIfLoggedIn()
    }


});








//$('.slidingMenu').slick({
//    centerMode: true,
//    centerPadding: '60px',
//    slidesToShow: 3,
//    variableWidth: true,
//    touchMove: true,
//    swipeToSlide: false,
//
//    responsive: [
//        {
//            breakpoint: 768,
//            settings: {
//                arrows: false,
//                centerMode: true,
//                centerPadding: '40px',
//                slidesToShow: 3
//            }
//    },
//        {
//            breakpoint: 480,
//            settings: {
//                arrows: false,
//                centerMode: true,
//                centerPadding: '40px',
//                slidesToShow: 1
//            }
//    }
//  ]
//});
