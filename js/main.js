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

let showLoader = (duration) => {
    $("#splash").show();
    setTimeout(function () {
        $("#splash").hide();
    }, duration);
}
setTimeout(() => {
    $("#splash").hide();
}, 1500);


var acc = document.getElementsByClassName("category");
var i;

for (i = 0; i < acc.length; i++) {
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