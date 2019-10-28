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


// show page or tab
/*
let showNavPage = pageId => {
    hideAllNavPages();
    document.querySelector(`#${pageId}`).style.display = "block";
    location.href = `#${pageId}`;
    setActiveTabNav(pageId);
    // showLoader(500);
}
*/


// set default page
 /*
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
  }*/

  hideAllNavPages();
  setDefaultNavPage();


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
  console.log(_sustainabilityData);
  appendCows(_sustainabilityData); // call appendCows with _sustainabilityData as function argument
  appendCarbonFootprint(_sustainabilityData); //call appendCarbonFootprint with _sustainabilityData as function argument
  appendMilkProduction(_sustainabilityData); //call appendMilkProduction with _sustainabilityData as function argument
});

function appendCows(sustainabilityData) {
  // prepare data
  let cows = [];
  let years = [];
  sustainabilityData.forEach(data => {
    if (data.region === 'north') {
      cows.push(data.herdYearCows);
      years.push(data.year);
    }
  });



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

function appendMilkProduction(sustainabilityData) {
  let years = [];
  let milkNorth = [];
  let milkSouth = [];
  sustainabilityData.forEach(data => {
    if (data.region === 'north') {
      milkNorth.push(data.herdMilkProduction.replace(',', '.'));
      years.push(data.year);
    } else if (data.region === 'south') {
      milkSouth.push(data.herdMilkProduction.replace(',', '.'));
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

//End of chart
