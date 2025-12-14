$(function () {
    "use strict"

    var loadText;
    var stage;
    var canvas = document.getElementById("canvas");    

    gm.init(canvas, load, resize);

    function load() {        
        var dated = "";
        var manifest = [
            // Resource 01 UI            
            //new createjs.LoadItem().set({ id: "bg_splash", src: "bg_splash.jpg", crossOrigin: "Anonymous" }),
            { id: "bg_splash", src: "images/UI/bg_splash.jpg" + dated },
            { id: "bg_opening", src: "images/UI/bg_opening.png" + dated },
            { id: "bg_activity", src: "images/UI/bg_activity.png" + dated },
            { id: "bg", src: "images/UI/bg.png" + dated },
            { id: "credit_page", src: "images/UI/credit-page.png" + dated },
            { id: "btnstartoff", src: "images/UI/btnstartoff.png" + dated },
            { id: "btnstarton", src: "images/UI/btnstarton.png" + dated },
            { id: "btnplayoff", src: "images/UI/btnplayoff.png" + dated },
            { id: "btnplayon", src: "images/UI/btnplayon.png" + dated },
            { id: "btnnextoff", src: "images/UI/btnnextoff.png" + dated },
            { id: "btnnexton", src: "images/UI/btnnexton.png" + dated },
            { id: "btnXon", src: "images/UI/btnXon.png" + dated },
            { id: "btnXoff", src: "images/UI/btnXoff.png" + dated },
            { id: "btnsaveanson", src: "images/UI/btnsaveanson.png" + dated },
            { id: "btnsaveansoff", src: "images/UI/btnsaveansoff.png" + dated },
            { id: "btndefinitionoff", src: "images/UI/btndefinitionoff.png" + dated },
            { id: "btndefinitionon", src: "images/UI/btndefinitionon.png" + dated },
            { id: "btnchooseagainoff", src: "images/UI/btnchooseagainoff.png" + dated },
            { id: "btnchooseagainon", src: "images/UI/btnchooseagainon.png" + dated },
            { id: "btnconfirmoff", src: "images/UI/btnconfirmoff.png" + dated },
            { id: "btnconfirmon", src: "images/UI/btnconfirmon.png" + dated },
            { id: "btnexplanationoff", src: "images/UI/btnexplanationoff.png" + dated },
            { id: "btnexplanationon", src: "images/UI/btnexplanationon.png" + dated },
            { id: "btnreplayoff", src: "images/UI/btnreplayoff.png" + dated },
            { id: "btnreplayon", src: "images/UI/btnreplayon.png" + dated },
            { id: "btnmusicoff", src: "images/UI/btnmusicoff.png" + dated },
            { id: "btnmusicon", src: "images/UI/btnmusicon.png" + dated },


            { id: "witness1", src: "images/UI/witness1.png" + dated },
            { id: "witness2", src: "images/UI/witness2.png" + dated },
            { id: "witness3", src: "images/UI/witness3.png" + dated },
            { id: "witness4", src: "images/UI/witness4.png" + dated },
            { id: "witness5", src: "images/UI/witness5.png" + dated },

            { id: "explanation1", src: "images/UI/explanation1.png" + dated },
            { id: "explanation2", src: "images/UI/explanation2.png" + dated },
            { id: "explanation3", src: "images/UI/explanation3.png" + dated },
            { id: "explanation4", src: "images/UI/explanation4.png" + dated },
            { id: "explanation5", src: "images/UI/explanation5.png" + dated },

            { id: "error1", src: "images/UI/error1.png" + dated },
            { id: "error2", src: "images/UI/error2.png" + dated },

            { id: "def_authoritative", src: "images/UI/def_authoritative.png" + dated },
            { id: "def_objective", src: "images/UI/def_objective.png" + dated },
            { id: "def_trustworthy", src: "images/UI/def_trustworthy.png" + dated },

            { id: "slidebar0", src: "images/UI/slidebar0.png" + dated },
            { id: "slidebar1", src: "images/UI/slidebar1.png" + dated },
            { id: "slidebar2", src: "images/UI/slidebar2.png" + dated },
            { id: "slidebar3", src: "images/UI/slidebar3.png" + dated },

            { id: "bar0", src: "images/UI/bar0.png" + dated },
            { id: "bar1", src: "images/UI/bar1.png" + dated },
            { id: "bar2", src: "images/UI/bar2.png" + dated },
            { id: "bar3", src: "images/UI/bar3.png" + dated },

            { id: "btngrey", src: "images/UI/btngrey.png" + dated },
            { id: "btnblue", src: "images/UI/btnblue.png" + dated },
            { id: "btnpink", src: "images/UI/btnpink.png" + dated },
            { id: "btnyellow", src: "images/UI/btnyellow.png" + dated },

            { id: "check", src: "images/UI/check.png" + dated },
            { id: "uncheck", src: "images/UI/uncheck.png" + dated },

            // musics
            { id: "BGM_V1", src: "sounds/musics/BGM_V1.mp3" + dated },
            { id: "BGM_V3", src: "sounds/musics/BGM_V3.mp3" + dated },

            // effects
            { id: "btn_click", src: "sounds/effects/btn_click.wav" + dated },
            { id: "flip_paper", src: "sounds/effects/flip_paper.mp3" + dated },

        ];

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        document.body.oncontextmenu = function () { return false; };

        stage = gm.getStage();
        stage.enableMouseOver();

        gm.resize();
        canvas.style.backgroundColor = "#ffffff"
        loadText = new createjs.Text("请稍等", "bold 24px Arial", "#000000");
        loadText.maxWidth = 1000;
        loadText.textAlign = "center";
        loadText.textBaseline = "middle";
        loadText.x = PAGE_WIDTH * 0.5;
        loadText.y = PAGE_HEIGHT * 0.5;

        stage.addChild(loadText);


        // preload fonts        
        var font400 = new createjs.Text("4", "400 1px Noto Sans SC", "#00000000");
        var font500 = new createjs.Text("5", "500 1px Noto Sans SC", "#00000000");
        var font700 = new createjs.Text("7", "700 1px Noto Sans SC", "#00000000");        
        stage.addChild(font400, font500, font700);

        var queue = new createjs.LoadQueue(false, null, true);
        queue.installPlugin(createjs.Sound);
        queue.on("fileload", handleFileLoad, this);
        queue.on("progress", handleProgress, this);
        queue.on("complete", handleComplete, this);
        queue.loadManifest(manifest);
        queue.setMaxConnections(10);        

        createjs.Ticker.addEventListener("tick", tick);
    }

    function handleFileLoad(event) {
        var item = event.item;
        var type = item.type;        
        //console.log("item: ", item);
        var images = PlaytivateActivity.functions.getImages();
        if (event && (event.item.type === "image")) {
            images[event.item.id] = event.result;
        }
    }

    function handleProgress(event) {
        var percentage = (event.target.progress * 100 | 0)
        loadText.text = "Fetching Data  " + percentage + "%";
        if (percentage >= 100) {
            percentage = 100;
            loadText.text = "Loading...Pls Wait";
        }        
        stage.update();
    }

    function handleComplete(event) {
        init();
        
    }

    function resize() {        
    }

    function init() {
        stage.removeChild(loadText);
        stage.autoClear = true;
        stage.enableDOMEvents(true);
        configure();
    }

    function configure() {

        createjs.Touch.enable(stage);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.framerate = 30;
        //createjs.Tween.ignoreGlobalPause = true;
        //createjs.Tween.useTicks = true;

        var libs = PlaytivateActivity.functions.getLibraries(stage, canvas);
        var content = new libs["activity"]();
        stage.addChild(content);        
    }

    function tick(event) {
        stage.update(event);
    }
})