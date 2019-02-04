$(document).ready(function() {
    
    // link to firebase
    var config = {
        apiKey: "AIzaSyAszRpEIj_XeIdytMMAUAkAWeToEy4VDmk",
        authDomain: "train-schedule-68349.firebaseapp.com",
        databaseURL: "https://train-schedule-68349.firebaseio.com",
        projectId: "train-schedule-68349",
        storageBucket: "train-schedule-68349.appspot.com",
        messagingSenderId: "539430608512"
      };
//initialize
  firebase.initializeApp(config);
    
    // a var for database
     var database = firebase.database();
    
    // on click submit button
    $("#trainSubmit").on("click", function(event) {
        event.preventDefault(); 
    
        //variables
        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();
        var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("Num");
        var frequency = $("#freq").val().trim();
    

        //new train info to link with firebase def
        var newTrain = {
            train: trainName,
            trainDest: destination,
            trainfrom: firstTime,
            everyNumMin: frequency
        };
    
        //uploads newTrain to firebase
        database.ref().push(newTrain);
        
        //clears elements 
        $("#name").val("");
        $("#dest").val("");
        $("#firstTime").val("");
        $("#freq").val("");
    
        return false;
    
    }); 
    
    //adding to current Train Schedule table from Add Train Input
    database.ref().on("child_added", function(childSnapshot,prevChildKey) {

            //store in variables
            var trainName = childSnapshot.val().train;
            var destination =childSnapshot.val().trainDest;
            var firstTime = childSnapshot.val().trainfrom;
            var frequency = childSnapshot.val().everyNumMin;
    
            //define current time
            var trainTime = moment(firstTime, "hh:mm a").subtract(1, "years");
            var currentTime = moment().format("HH:mm a");
            //console.log("Current Time:" + currentTime);
            
            //difference
            var difference =  moment().diff(moment(trainTime),"minutes");
    
            //time left
            var trainTimeleft = difference % frequency;
    
            //minutes until arrival
            var arrival = frequency - trainTimeleft;
    
            //next arrival time
            var nextArrival = moment().add(arrival, "m").format("hh:mm a");
    
            //adding info to main table 
            $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + arrival + "</td></tr>");
    
    });
    });
    