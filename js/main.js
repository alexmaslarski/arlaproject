"use strict";


// Navigation
let hideAllPages = () => {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}
// show page or tab
let showPage = pageId => {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  location.href = `#${pageId}`;
  setActiveTab(pageId);
  // showLoader(500);
}
// set default page
let setDefaultPage = () => {
  let page = "profile-page";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}
setDefaultPage();

function setActiveTab(pageId) {
  let pages = document.querySelectorAll("nav a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  }
}

/*
let showLoader = (duration) => {
    $("#splash").show();
    setTimeout(function () {
        $("#splash").hide();
    }, duration);
}
setTimeout(() => {
    $("#splash").hide();
}, 1500);
*/

var acc = document.getElementsByClassName("category");

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    // this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}


//SPA for the navigation inside the profile page
let hideAllNavPages = () => {
  let pages = document.querySelectorAll(".profileNavPage");
  for (let page of pages) {
    page.style.display = "none";
  }
}
// show page or tab
function showNavPage(pageId){
  hideAllNavPages();
  let tabs = document.querySelectorAll(".profilePage");
  for (let tab of tabs){
    if(tab.classList.contains('activeNav')){
      tab.classList.remove('activeNav');
      console.log('removed');
    }
  };
  document.querySelector(`#${pageId}`).style.display = "block";
  document.querySelector(`#${pageId}-tab`).classList.add('activeNav');

}

function setDefaultNavPage(){
  document.querySelector('#previous-reports').style.display = "block";
}
hideAllNavPages();

setDefaultNavPage();


//Chart

const _db = firebase.firestore();
const _dataRef = _db.collection("output-data");
let _sustainabilityData;



// listen for changes on _dataRef
_dataRef.orderBy("year").onSnapshot(function (snapshotData) {
  _sustainabilityData = []; // reset _sustainabilityData
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    let data = doc.data(); // save the data in a variable
    _sustainabilityData.push(data);
  });


  appendFootprint(_sustainabilityData);
  appendScores(_sustainabilityData);

});

function appendScores(sustainabilityData) {

  sustainabilityData.forEach(data => {
    if (data.year === 2019) {
      document.querySelector("#total-score").innerHTML = data.totalFootprint;
      document.querySelector("#digestion-score").innerHTML = data.digestion;
      document.querySelector("#imported-feed-score").innerHTML = data.importedFeed;
      document.querySelector("#electricity-score").innerHTML = data.electricity;
      document.querySelector("#diesel-score").innerHTML = data.diesel;

    }
  })
}


function appendFootprint(sustainabilityData) {
  let totalCarbonFootprint = [];
  let years = [];
  sustainabilityData.forEach(data => {
    totalCarbonFootprint.push(data.totalFootprint);
    years.push(data.year);
  });

  // generate chart
  let chart = document.querySelector('#carbonFootprint');
  let myDoughnutChart = new Chart(chart, {
    type: 'line',
    data: {
      datasets: [{
        data: totalCarbonFootprint,
        label: 'kg CO2 per year',
        fill: false,
        borderColor: "#e755ba",
        backgroundColor: "#e755ba",
        pointBackgroundColor: "#55bae7",
        pointBorderColor: "#55bae7",
        pointHoverBackgroundColor: "#55bae7",
        pointHoverBorderColor: "#55bae7",
      }],
      labels: years
    }
  });


}
