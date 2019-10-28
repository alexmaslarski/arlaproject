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
_dataRef.orderBy("year").onSnapshot(function(snapshotData) {
  _sustainabilityData = []; // reset _sustainabilityData
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    let data = doc.data(); // save the data in a variable
    data.id = doc.id; // add the id to the data variable
    _sustainabilityData.push(data); // push the data object to the global array _sustainabilityData
  });

appendRegions(_sustainabilityData);
  appendFootprint(_sustainabilityData);
  appendScores(_sustainabilityData);

});



function appendCarbonFootprint(sustainabilityData) {
  // prepare data
  let carbonFootprint = [];
  let years = [];
  sustainabilityData.forEach(data => {
    if (data.region === 'north-denmark') {
      carbonFootprint.push(data.carbonFootprintWholeFarm.replace(',', '.'));
      years.push(data.year);
    }
  });

  console.log(carbonFootprint);
  console.log(years);

  // generate chart
  let chart = document.querySelector('#carbonFootprint');
  let myDoughnutChart = new Chart(chart, {
    type: 'line',
    data: {
      datasets: [{
        data: total-footprint-output,
        label: 'Carbon Footprint WholeFarm',
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


}


function appendRegions(sustainabilityData) {
  let regions = [];
  let totalFootprint = [];
  console.log(regions);
  console.log(totalFootprint);


for (let data of sustainabilityData) {
  regions.push(data.region);
  totalFootprint.push(data.totalFootprint);
  }
console.log(sustainabilityData);
  let regionChart = document.querySelector('#regions');
  let regionPieChart = new Chart(regionChart, {
    type: 'pie',
    options: {
      title: {
              display: true,
              text: 'Custom Chart Title'
          },
      legend: {
        position: 'bottom',
      }
    },
    data: {
      datasets: [{
        data: totalFootprint,
        label: 'kg CO2 per year',
        fill: true,
        borderColor: "#e755ba",
        backgroundColor: [
          "#e755ba",
          "#e5e5e5",
          "#006C3A"

        ],

        pointBackgroundColor: "#55bae7",
        pointBorderColor: "#55bae7",
        pointHoverBackgroundColor: "#55bae7",
        pointHoverBorderColor: "#55bae7",
      }],
      labels: regions
    }
  });
  console.log(regionPieChart);

};
