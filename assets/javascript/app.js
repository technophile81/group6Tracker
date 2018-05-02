// Initialize Firebase
var config = {
    apiKey: "AIzaSyAdrPo3BBA1SZFpXeEmasw_Ml2dPKJevHg",
    authDomain: "employeedata-b6f55.firebaseapp.com",
    databaseURL: "https://employeedata-b6f55.firebaseio.com",
    projectId: "employeedata-b6f55",
    storageBucket: "employeedata-b6f55.appspot.com",
    messagingSenderId: "454826337302"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// -----------------------------

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    //  $("#connected-viewers").text(snap.numChildren());
});

// --------------------------------------------------------------

// Form Stuff: Click event

$("#submit").on("click", function (event) {
    event.preventDefault();

    // Text input variables
    var employeeName = $("#employee-name").val().trim();
    var employeeRole = $("#employee-role").val().trim();
    var employeeStartDate = $("#employee-startdate").val().trim();
    var employeeRate = $("#employee-rate").val().trim();

    database.ref("/employeeTimeData").push({
        employeeName: employeeName,
        employeeRole: employeeRole,
        employeeStartDate: employeeStartDate,
        employeeMonthsWorked: employeeMonthsWorked,
        employeeRate: employeeRate,
        employeeBilled: employeeBilled,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

// Clear form
$("#submit").on("click", function (event) {
    $("#employee-form")[0].reset();
});


database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    // ------------------------------------

    $("#employee-info").empty();

    snapshot.forEach(function (childSnapshot) {

        //check for valid child
        if (!childSnapshot.child("employeeName").exists()) {
            return;
        }
        var employeeName = childSnapshot.val().employeeName;
        var employeeRole = childSnapshot.val().employeeRole;
        var employeeStartDate = childSnapshot.val().employeeStartDate;
        var employeeMonthlyRate = childSnapshot.val().employeeMonthlyRate;

        // Show form stuff

        var newRow = $("<tr>");
        var employeeNameDisplay = $("<td>").text(employeeName);
        var employeeRoleDisplay = $("<td>").text(employeeRole);
        var employeeStartDateDisplay = $("<td>").text(employeeStartDate);
        var employeeMonthsWorkedDisplay = $("<td>").text(employeeMonthsWorked);
        var employeeRateDisplay = $("<td>").text(employeeRate);
        var employeeBilledDisplay = $("<td>").text(employeeBilled);


        newRow.append(employeeNameDisplay, employeeRoleDisplay, employeeStartDateDisplay, employeeMonthsWorkedDisplay, employeeRateDisplay, employeeBilledDisplay);
        $("#employee-info").append(newRow);

    });

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});





