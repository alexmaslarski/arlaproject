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
    this.classList.toggle("activeCategory");
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


//Chart

const _db = firebase.firestore();
const _dataRef = _db.collection("output-data");
const _dataRefAverage = _db.collection("industry-avg");
const _dataRefInput = _db.collection("input-data");
let _sustainabilityData;



// listen for changes on _dataRef
_dataRef.orderBy("year").onSnapshot(function (snapshotData) {
  _sustainabilityData = []; // reset _sustainabilityData
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    let data = doc.data(); // save the data in a variable
    _sustainabilityData.push(data);
  });

appendRegions(_sustainabilityData);
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




// Input calculations
let averageData;
_dataRefAverage.onSnapshot(function (snapshotData) {
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    averageData = doc.data(); // save the data in a variable
    console.log(averageData);

  });

});
let lastYearData;
_dataRefInput.onSnapshot(function (snapshotData) {
  snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
    lastYearData = doc.data(); // save the data in a variable
    console.log(lastYearData);

  });

});
function compare(value, category) {
  compareToNorm(value,category);
  compareToLastYear(value,category);

}
function compareToNorm(value, category) {
  if (category === "cows") {
    calculateNorm(value, averageData.cows, 'cowsNorm');
    console.log(100 - ((value / averageData.cows) * 100));


  } else if (category === "milkProduction") {
    calculateNorm(value, averageData.milkProduction, 'milkNorm');
  } else if (category === "selfSufficiency") {
    calculateNorm(value, averageData.milkProduction, 'sufficiencyNorm');
  } else if (category === "feedConsumption") {
    calculateNorm(value, averageData.milkProduction, 'feedNorm');
  } else if (category === "diesel") {
    calculateNorm(value, averageData.milkProduction, 'dieselNorm');
  } else if (category === "electricity") {
    calculateNorm(value, averageData.milkProduction, 'electricityNorm');
  }

}

function compareToLastYear(value, category) {
  if (lastYearData.year == 2018) {
    if (category === "cows") {
      calculateNorm(value, lastYearData.cows, 'cowsLast');
      console.log(100 - ((value / lastYearData.cows) * 100));
    } else if (category === "milkProduction") {
      calculateNorm(value, lastYearData.milkProduction, 'milkLast');
    } else if (category === "selfSufficiency") {
      calculateNorm(value, lastYearData.milkProduction, 'sufficiencyLast');
    } else if (category === "feedConsumption") {
      calculateNorm(value, lastYearData.milkProduction, 'feedLast');
    } else if (category === "diesel") {
      calculateNorm(value, lastYearData.milkProduction, 'dieselLast');
    } else if (category === "electricity") {
      calculateNorm(value, lastYearData.milkProduction, 'electricityLast');
    }
  }


}

function calculateNorm(value, norm, element) {
  let result = 100 - ((value / norm) * 100);
  if (result < 0) {
    document.querySelector(`#${element}`).innerHTML = `
<i class="fas fa-long-arrow-alt-up red"></i>
<p>${Math.abs(result).toFixed(2)}%</p>
`
  } else if (result > 0) {
    document.querySelector(`#${element}`).innerHTML = `
<i class="fas fa-long-arrow-alt-down green"></i>
<p>${Math.abs(result).toFixed(2)}%</p>
`
  } else if (result == 0) {
    document.querySelector(`#${element}`).innerHTML = `
    <i class="fas fa-equals"></i>
    <p>${Math.abs(result).toFixed(2)}%</p>
    `
  }
}
