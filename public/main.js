var app = new Vue({
  el: "#app",
  data: {

    url: "https://www.json-generator.com/api/json/get/bUmvTIaLpK?indent=2",
    league: [],
    games: [],
    teams: [],
    players: [],
    team: {},
    //v-model value for dates
    dateOptions: "October 6",
    //non repeated game dates
    gameDates: [],
    page: "schedulePage",
    // teamRankingContainer: true,
    // playersRanking: false 
    subpage: "teamRankingContainer",
    navbarTop: true,
    loginButton: true,
    logoutButton: false,
    beforeLoginMsg: true

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
          app.getAllPlayers();
          app.collectGameDates();

        })
    },

    //*********** SCHEDULE PAGE *********** */
    collectGameDates: function () {
      for (var i = 0; i < this.games.length; i++) {
        if (this.gameDates.indexOf(this.games[i]["date"]) == -1) {
          this.gameDates.push(this.games[i]["date"]);
        }
      }
    },

    getGamesByDate: function () {
      var scheduledGames = [];
      for (var i = 0; i < this.games.length; i++) {
        if (this.games[i]["date"] == this.dateOptions) {
          scheduledGames.push(this.games[i]);
        } else {
          if (this.games[i]["isCurrent"] && this.dateOptions == "Select date") {
            scheduledGames.push(this.games[i]);
          }
        }
      }
      return scheduledGames;
    },

    //********** STANDINGS **************/
    sortTeamsByPoints: function () {
      var sortedTeams = this.teams.slice().sort(function (a, b) {
        return b.pts - a.pts;
      });
      return sortedTeams;
    },

    getAllPlayers: function () {
      for (var i = 0; i < this.teams.length; i++) {
        for (var j = 0; j < this.teams[i]["players"].length; j++) {
          this.players.push(this.teams[i]["players"][j]);
        }
      }
    },

    sortPlayersByKey: function (key) {
      var sortedPlayers = this.players.slice().sort(function (a, b) {
        return b[key] - a[key];
      });
      return sortedPlayers.slice(0, 5);
    },

    findLogoForPlayer: function (player) {
      for (var i = 0; i < this.teams.length; i++) {
        for (var j = 0; j < this.teams[i]["players"].length; j++) {
          if (this.teams[i]["players"][j]["name"] == player) {
            return this.teams[i]["logo"];
          }
        }
      }
    },

    // TEAMS
    getTeam: function (team) {
      this.team = team;
    },

    displayRankingPages: function (id) {
      this.subpage = id;
    },

    showPage: function (pagename) {
      if (pagename == "individualTeamPage") {
        this.page = pagename;
        this.hideNav();
      } else {
        this.page = pagename;
        this.navbarTop = true;
      }
    },

    hideNav: function () {
      this.navbarTop = false;
    },

    login: function () {
      // Provider
      var provider = new firebase.auth.GoogleAuthProvider();
      // How to Log In           
      firebase.auth().signInWithPopup(provider).then(function () {
        console.log("logged in-> login()");
      });
    },

    logout: function () {
      firebase.auth().signOut().then(function () {
        console.log("logged out -> logout()")
      }, function (error) {
        // An error happened.
      });
    },

    changeButtonAndMsgOnAuthState: function () {
      console.log("in change auth");
      var user = firebase.auth().currentUser;
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          app.loginButton = false;
          app.logoutButton = true;
          var name = user.displayName;
          document.getElementById("beforeLoginMsg").innerHTML = `Welcome, ${name}`;
          document.getElementById("lock").classList.value="fas fa-lock-open fa-2x";
        } else {
          app.logoutButton = false;
          app.loginButton = true;
          document.getElementById("beforeLoginMsg").innerHTML = "Please Login below to see full content";
          document.getElementById("lock").classList.value="fas fa-lock fa-2x";
        }
      })
    },

    writeNewPost: function () {
      //get text value that user is about to send
      var text = document.getElementById("textInput").value;
      var user = firebase.auth().currentUser;
      var userName = user.displayName;
      // A post entry that wont send a message if no text there
      if (text != "" && text != " ") {
        var message = {
          messageText: text,
          name: userName,
          profileImg: user.photoURL
        }
        console.log(message);
        //delete input after sending a msg
        document.getElementById("textInput").value = "";
        // Get a key for a new Post.
        firebase.database().ref('myChat').push(message);
        //Write data
        console.log("write");
      }
    },

    getPosts: function () {
      firebase.database().ref('myChat').on('value', function (data) {
        var posts = document.getElementById("posts");
        posts.innerHTML = "";
        var messages = data.val();
        for (var key in messages) {
          // div that will contain photo, text and user's name
          var messageContainer = document.createElement("div");
          messageContainer.classList.add("messageContainer");

          var userName = document.createElement("p");
          userName.append(messages[key].name);
          userName.classList.add("userName");

          var photoAndTextContainer = document.createElement("div");
          photoAndTextContainer.classList.add("photoAndTextContainer");

          var messageText = document.createElement("p");
          messageText.append(messages[key].messageText);
          messageText.classList.add("messageText");

          var photo = document.createElement("img");
          photo.setAttribute("src", messages[key].profileImg);
          photo.classList.add("userPhoto");

          //add photo and text to their container
          photoAndTextContainer.append(photo, messageText);
          //add user name and photoAndTextContainer to messageContainer
          messageContainer.append(userName, photoAndTextContainer);
          //add everything to posts
          posts.append(messageContainer);
        }
        //scroll down to the bottom after each message
        app.scrollDown();
      })
      console.log("getting posts");
    },

    scrollDown: function () {
      document.getElementById('posts').scrollTop = document.getElementById('posts').scrollHeight
    },

    gotoPageIfSignedIn: function (page) {
      var user = firebase.auth().currentUser;
      if (user) {
          this.showPage(page);
      } else {
          // No user is signed in.
          alert("Please go to Account Page and Login to see this content!")
      }
    },

    makeLinkActive: function(linkId, activeClass){
      //when clicking on burgerMenu links need to remove active class from the bottom nav
      if(linkId == "aboutLi" || linkId =="contactLi" || linkId == "locationsLi" || linkId == "chatLi"){
        this.removeActiveClassFromLinks("scheduleLink", "standingsLink", "teamsLink", "accountLink", "bottomNavActiveLink");
        this.removeActiveClassFromLinks("aboutLi", "contactLi", "locationsLi", "chatLi", "active");
      }//when we click on the bottomNav link clear active class from the burger menu links
      else if(linkId =="scheduleLink" || linkId == "standingsLink" || linkId == "teamsLink" || linkId == "accountLink"){
        this.removeActiveClassFromLinks("aboutLi", "contactLi", "locationsLi", "chatLi", "active");
        this.removeActiveClassFromLinks("scheduleLink", "standingsLink", "teamsLink", "accountLink", "bottomNavActiveLink");
      }//when clicking on standings links remove its active class 
      else if(linkId == "standingsTeamLink" || linkId == "standingsIndividualLink"){
        document.getElementById("standingsTeamLink").classList.remove("standingsLinkTeam");
        document.getElementById("standingsIndividualLink").classList.remove("standingsLinkTeam");
      }//when clicking on indTeam page links clear the active class when switching from one link to another
      else if(linkId == "indTeamOverviewLink" || linkId == "indTeamStatsLink" || linkId == "indTeamPlayersLink"){
        document.getElementById("indTeamOverviewLink").classList.remove("individualTeamLinkActive");
        document.getElementById("indTeamStatsLink").classList.remove("individualTeamLinkActive");
        document.getElementById("indTeamPlayersLink").classList.remove("individualTeamLinkActive");
      }
      document.getElementById(linkId).classList.add(activeClass);
    },

    removeActiveClassFromLinks(linkId1,linkId2,linkId3, linkId4, activeClass){
      document.getElementById(linkId1).classList.remove(activeClass);
      document.getElementById(linkId2).classList.remove(activeClass);
      document.getElementById(linkId3).classList.remove(activeClass);
      document.getElementById(linkId4).classList.remove(activeClass);
    },    

  },

  updated() {
    app.getGamesByDate();
    app.scrollDown();
  },

  created() {
    this.getData();
    this.changeButtonAndMsgOnAuthState();
    this.getPosts();
    document.getElementById("scheduleLink").classList.add("bottomNavActiveLink");
    document.getElementById("standingsTeamLink").classList.add("standingsLinkTeam");
    document.getElementById("indTeamOverviewLink").classList.add("individualTeamLinkActive");
   
  },

  computed: {

  }

});

