
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
  acc[i].addEventListener("click", function() {
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
let showNavPage = pageId => {
hideAllNavPages();
document.querySelector(`#${pageId}`).style.display = "block";
location.href = `#${pageId}`;
setActiveTabNav(pageId);
// showLoader(500);
}
// set default page
let setDefaultNavPage = () => {
let page = 'previousReports';
if (location.hash) {
  page = location.hash.slice(1);
}
showNavPage(page);
}
setDefaultNavPage();

function setActiveTabNav(pageId) {
let pages = document.querySelectorAll("#profile-nav a");
for (let page of pages) {
  if (`#${pageId}` === page.getAttribute("href")) {
    page.classList.add("activeNav");

  } else {
    page.classList.remove("activeNav");
  }

}
}

hideAllNavPages();


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

  // generate chart
  let chart = document.querySelector('#cows');
  let myDoughnutChart = new Chart(chart, {
    type: 'bar',
    data: {
      datasets: [{
        data: cows,
        label: 'Number of Cows',
        fill: false,
        borderColor: "#e755ba",
        backgroundColor: "#e755ba",
        pointBackgroundColor: "#55bae7",
        pointBorderColor: "#55bae7",
        pointHoverBackgroundColor: "#55bae7",
        pointHoverBorderColor: "#55bae7",
      }],
      labels: years
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            min: (Math.min(...cows) - 5),
            max: (Math.max(...cows) + 1)
          }
        }]
      }
    }
  });
}

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

  console.log(years);
  console.log(milkNorth);
  console.log(milkSouth);

  // generate chart
  let chart = document.querySelector('#milkProduction');
  let myDoughnutChart = new Chart(chart, {
    type: 'line',
    data: {
      datasets: [{
        data: milkNorth,
        label: 'Milk Production North',
        fill: false,
        borderColor: "#e755ba",
        backgroundColor: "#e755ba",
        pointBackgroundColor: "#55bae7",
        pointBorderColor: "#55bae7",
        pointHoverBackgroundColor: "#55bae7",
        pointHoverBorderColor: "#55bae7",
      }, {
        label: 'Milk Production South',
        data: milkSouth,
        fill: false,
        borderColor: "#55bae7",
        backgroundColor: "#55bae7",
        pointBackgroundColor: "#e755ba",
        pointBorderColor: "#e755ba",
        pointHoverBackgroundColor: "#e755ba",
        pointHoverBorderColor: "#e755ba",
        type: 'line'
      }],
      labels: years
    }
  });
}

}
