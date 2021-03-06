var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');

const homepage = "http://www.cnil.fr"
var cookieviz_windows = [];

window.addEventListener(
    'DOMContentLoaded',
    initBrowser
);

function initBrowser(){
    window.nwjsHeader=document.querySelector('header');
    window.nwjsBrowser=document.querySelector('#browser');
    
    nwjsHeader.addEventListener(
        'click',
        navigate
    );
    
    nwjsHeader.addEventListener(
        'keyup',
        go
    );
    
    setTimeout(
        function(){           
            win.title="Navigateur CookieViz";
            nwjsHeader.querySelector('#address').value=homepage;
            nwjsBrowser.contentWindow.window.location.href=homepage;
            setTimeout(
                function(){
                    nwjsBrowser.style.opacity=1;
                },600
            );
            nwjsHeader.style.opacity=1;
            openCookieViz();
            nwjsBrowser.addEventListener("load", function () {
                nwjsHeader.querySelector('#address').value=nwjsBrowser.contentWindow.window.location.href;
            });
        },300
    );
}

function go(e){
    if(e.keyCode!==13){
        return;
    }
    
    if(e.target.value.indexOf('//')<0){
        e.target.value='http://'+e.target.value;
    }
    
    nwjsBrowser.contentWindow.window.location.href=e.target.value;
}

function openCookieViz(){
    nw.Window.open("./cookieviz/index.html",{
        position: 'mouse',
        width: 1000,
        height: 600
    }, function(new_win) {
        new_win.requestAttention(true); 
        new_win.setResizable(true);
        cookieviz_windows.push(new_win);
    });
}


function closeCookieViz(){
    cookieviz_windows.forEach(function(cookie_win){
        cookie_win.close();
    })
    cookieviz_windows = [];
}

win.on('close', function () {
    this.hide(); // Pretend to be closed already
    console.log("En cours de fermeture...");
    closeCookieViz();

    // Remove cache
    var fs = require('fs-extra');
    var dataPath = require('nw.gui').App.dataPath;
    fs.remove(dataPath, err => {
        console.error(err)
    });
    this.close(true); // then close it forcefully
});

function navigate(e){
    switch(e.target.id){
        case 'back' :
        case 'forward' :
            nwjsBrowser.contentWindow.window.history[e.target.id]();
            break;
        case 'refresh' :
            nwjsBrowser.contentWindow.window.location.reload();
            break;
        case 'cookieviz' :
            openCookieViz();
            break;
        case 'address' :
            e.target.select();
            break;
    }
}
