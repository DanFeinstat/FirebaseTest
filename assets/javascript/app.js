$(document).ready(function(){



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCXUAQYCS6dzMc7oSKXo-6-zOSJsJcciFQ",
    authDomain: "trainschedule-5fc79.firebaseapp.com",
    databaseURL: "https://trainschedule-5fc79.firebaseio.com",
    projectId: "trainschedule-5fc79",
    storageBucket: "",
    messagingSenderId: "1098834643321"
  };
  firebase.initializeApp(config);

  let database = firebase.database();

  $('#submit').on('click', function(event){
    event.preventDefault();
    let trainName = $('#input-train-name').val().trim();
    let destination = $('#input-destination').val().trim();
    let firstTime = $('#input-first-train-time').val().trim();
    let frequency = $('#input-frequency').val().trim();

    database.ref().push({
      trainName:trainName,
      destination:destination,
      firstTime:firstTime,
      frequency:frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
  })

  database.ref().orderByChild('dateAdded').limitToLast(1).on('child_added', function(snapshot){
    //define a variable for snapshot value
    let sv = snapshot.val();

    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTime);
    console.log(sv.frequency);
    var firstTimeConverted = moment(sv.firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    let currentTime = moment();
    let diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
    console.log('difference in time = '+diffTime);
    let tRemainder = diffTime % sv.frequency;
    //minutes until next train
    let minutesUntilTrain = sv.frequency - tRemainder;
    console.log('time until next train = '+minutesUntilTrain)
    //arrival time
    let nextTrain = moment().add(minutesUntilTrain, "minutes");
    console.log('Arrival Time = '+moment(nextTrain).format('hh:mm'))
    $('tbody').append(
      '<tr>\
          <td>'+sv.trainName+'</td>\
          <td>'+sv.destination+'</td>\
          <td>'+sv.frequency+'</td>\
          <td>'+moment(nextTrain).format('hh:mm')+'</td>\
          <td>'+minutesUntilTrain+'</td>\
        </tr>')

  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });


})
