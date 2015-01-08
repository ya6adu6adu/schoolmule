"use strict";

window.isUserActive = new Date().getTime(); //start time when user login, ms
window.onload = function(){
    /**
     * check activity time, if < 15min then logout
     * @type {number}
     */
    bindEvents(window.document);
    window.checkUserActivity = setInterval(function(){
        var newTime = new Date().getTime();
        if((newTime-window.isUserActive)/(1000*60) > 15){
            clearInterval(window.checkUserActivity);
            schoolmule.main.logOutUser();
        }
    }, 10000);
};
function setUserActivity(){
    window.isUserActive = new Date().getTime(); //update time every user action (click, press key, mousemove), ms
};

/**
 * bind events to DOM object
 * @param domObject - DOM Element for binding events
 */
function bindEvents(domObject){
    var throttledEvent;
    if(domObject) {
        throttledEvent = _.throttle(setUserActivity, 10000);
        $(domObject).mousemove(throttledEvent);
        $(domObject).click(throttledEvent);
        $(domObject).keyup(throttledEvent);
    }
}
