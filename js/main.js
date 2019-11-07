"use strict";

const _db = firebase.firestore();
const _dataRef = _db.collection("output-data");
const _dataRefAverage = _db.collection("industry-avg");
const _dataRefInput = _db.collection("input-data");
let _sustainabilityData;
let averageData;
let lastYearData;



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
  setActiveTabNav(pageId);
  // showLoader(500);
}
// set default page
let setDefaultNavPage = () => {
  let page = 'previousReports';
  showNavPage(page);


}
setDefaultNavPage();

function setActiveTabNav(pageId) {
  let pages = document.querySelectorAll("#profile-nav li");
  for (let page of pages) {
    if (`#${pageId}` === `#${page.getAttribute("data-link")}`) {
      page.classList.add("activeNav");

    } else {
      page.classList.remove("activeNav");
    }

  }
}





// Category accordion
var acc = document.getElementsByClassName("category");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("activeCategory");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}




// listen for changes on _dataRef
_dataRef.orderBy("year").onSnapshot(function(snapshotData) {
  _sustainabilityData = []; // reset _sustainabilityData
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    let data = doc.data(); // save the data in a variable
    _sustainabilityData.push(data);
  });

  appendRegions(_sustainabilityData);
  appendFootprint(_sustainabilityData);
  appendScores(_sustainabilityData);

});

// Update profile category scores
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


// Create data for previous report chart
function appendFootprint(sustainabilityData) {
  let totalCarbonFootprint = [];
  let years = [];
  sustainabilityData.forEach(data => {
    totalCarbonFootprint.push(data.totalFootprint);
    years.push(data.year);
  });

  // generate chart
  Chart.defaults.global.defaultFontFamily = 'Roboto';
  Chart.defaults.global.defaultFontColor = '#006C3A';
  let chart = document.querySelector('#carbonFootprint');
  let myDoughnutChart = new Chart(chart, {
    type: 'bar',
    options: {
      title: {
        display: true,
        text: 'Kilograms of CO2 per year',
        fontSize: 20,
      },
      legend: false,
    },
    data: {
      datasets: [{
        data: totalCarbonFootprint,
        label: 'kg CO2 per year',
        fill: false,
        hoverBackgroundColor: [
          "rgba(075, 177, 049, .9)",
          "rgba(255, 204, 050, .9)",
          "rgba(060, 196, 235, .9)",
          "rgba(125, 093,168 , .9)",
          "rgba(248, 053, 060, .9)",
        ],

        borderWidth: 2.5,
        borderColor: [
          "#4bb131",
          "#ffcc32",
          "#3cc4eb"
        ],
        backgroundColor: [
          "rgba(075, 177, 049, .6)",
          "rgba(255, 204, 050, .6)",
          "rgba(060, 196, 235, .6)",
          "rgba(125, 093,168 , .6)",
          "rgba(248, 053, 060, .6)",
        ],

      }],
      labels: years
    }
  });


}


// Chart inside statistics
function appendRegions(sustainabilityData) {
  let regions = [];
  let totalFootprint = [];

  for (let data of sustainabilityData) {
    regions.push(data.region);
    totalFootprint.push(data.totalFootprint);
  }
  console.log(sustainabilityData);
  let regionChart = document.querySelector('#regions');
  let regionPieChart = new Chart(regionChart, {
    type: 'doughnut',
    options: {
      title: {
        display: true,
        text: 'Kilograms of CO2 per region',
          fontSize: 20,
      },
      legend: {
        position: 'right',
      }
    },
    data: {
      datasets: [{
        data: totalFootprint,
        label: 'kg CO2 per year',
        fill: true,
hoverBackgroundColor: [
  "rgba(125, 093,168 , 1)",
  "rgba(248, 053, 060, 1)",
  "rgba(255, 126, 005, 1)",
  "rgba(075, 177, 049, 1)",
  "rgba(255, 204, 050, 1)",
],
        backgroundColor: [
          "rgba(125, 093,168 , .7)",
          "rgba(248, 053, 060, .7)",
          "rgba(255, 126, 005, .7)",
          "rgba(075, 177, 049, .7)",
          "rgba(255, 204, 050, .7)",

        ],


      }],
      labels: regions
    }
  });
  console.log(regionPieChart);

};




// Input calculations

_dataRefAverage.onSnapshot(function(snapshotData) {
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    averageData = doc.data(); // save the data in a variable

  });

});

_dataRefInput.onSnapshot(function(snapshotData) {
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    lastYearData = doc.data(); // save the data in a variable

  });

});
// Call both comparison functions
function compare(value, category) {
  compareToNorm(value, category);
  compareToLastYear(value, category);

}
// Compare the input to the norm for each question
function compareToNorm(value, category) {
  if (category === "milkProduction") {
    calculateNorm(value, averageData.milkProduction, 'milkNorm', 'norm');
  } else if (category === "selfSufficiency") {
    calculateNorm(value, averageData.selfSufficiency, 'sufficiencyNorm', 'norm');
  } else if (category === "feedConsumption") {
    calculateNorm(value, averageData.feedConsumption, 'feedNorm', 'norm');
  } else if (category === "diesel") {
    calculateNorm(value, averageData.diesel, 'dieselNorm', 'norm');
  } else if (category === "electricity") {
    calculateNorm(value, averageData.electricity, 'electricityNorm', 'norm');
  }

}
// Compare the input to last year for each question
function compareToLastYear(value, category) {
  if (lastYearData.year == 2018) {
    if (category === "milkProduction") {
      calculateNorm(value, lastYearData.milkProduction, 'milkLast', 'last year');
    } else if (category === "selfSufficiency") {
      calculateNorm(value, lastYearData.selfSufficiency, 'sufficiencyLast', 'last year');
    } else if (category === "feedConsumption") {
      calculateNorm(value, lastYearData.feedConsumption, 'feedLast', 'last year');
    } else if (category === "diesel") {
      calculateNorm(value, lastYearData.diesel, 'dieselLast', 'last year');
    } else if (category === "electricity") {
      calculateNorm(value, lastYearData.electricity, 'electricityLast', 'last year');
    }
  }


}
// Calculate and display results
function calculateNorm(value, norm, element, comparedTo) {
  let result = 100 - ((value / norm) * 100);
  if (result < 0) {
    document.querySelector(`#${element}`).innerHTML = `
    <span class="value-description">Compared to ${comparedTo}</span>
<i class="fas fa-long-arrow-alt-up red"></i>
<p>${Math.abs(result).toFixed(2)}%</p>

`
  } else if (result > 0) {
    document.querySelector(`#${element}`).innerHTML = `
    <span class="value-description">Compared to ${comparedTo}</span>
<i class="fas fa-long-arrow-alt-down green"></i>
<p>${Math.abs(result).toFixed(2)}%</p>
`
  } else if (result == 0) {
    document.querySelector(`#${element}`).innerHTML = `
    <span class="value-description">Compared to ${comparedTo}</span>
    <i class="fas fa-equals"></i>
    <p>${Math.abs(result).toFixed(2)}%</p>
    `
  }
}
