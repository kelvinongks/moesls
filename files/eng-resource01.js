
(function (cjs, playActivity) {
    var libs = {};
    var imgs = {};
    var curFrame = 0;
    var pages = [];    

    // globals
    var gAudioInstance = null;
    var gEffectInstance = null;
    var gMusicInstance = null;
    var gLocalMusicInstance = null;
    var gMusicSetting = { vol: 0, volDefault: 0.7 };
    var gParentActivity = null;

    // flags
    var gIsDevelopment = true;    

    // constants    

    (libs.activity = function () {
        var activity = this;
        gParentActivity = activity;        

        // video panel
        this.videoPanel = new libs.createVideoPanel();

        // music control
        this.musicControl = new libs.createMusicControl(PAGE_WIDTH - 40, 40);

        // splash panel
        this.splashPanel = new libs.createSplashPanel();        

        // user data
        this.userData = {            
        };                
        
        this.imageLoader = new createjs.DOMElement(document.getElementById('imageLoader'));
        this.imageLoader.htmlElement.style.setProperty("display", "none");
        this.imageLoader.callback = null;

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    if (!IsEmpty(activity.imageLoader.callback)) {
                        activity.imageLoader.callback(img);
                    }
                }
                img.src = event.target.result;
            }
            try {
                reader.readAsDataURL(e.target.files[0]);
            } catch (e) {
                //
            }            
        }
        this.imageLoader.htmlElement.addEventListener('change', handleImage, false);
        this.imageLoader.htmlElement.addEventListener('click', function () { this.value = null });

        // content	    
        this.content = new libs.createContent(this);

        this.addChild(this.content, this.videoPanel, this.musicControl);

        //console.log("content: " + this.content);

    }).prototype = new cjs.Container();

    // create content
    (libs.createContent = function (parent) {
        var clip = new cjs.MovieClip();
        clip.name = "content";
        clip.parent = parent;
        clip.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);

        // timeline functions:
        var frame_0 = function () {
            clip.stop()
        }

        clip.timeline.addTween(cjs.Tween.get(this).call(frame_0).wait(1));

        // pages
        // 0

        var splashPage01 = new libs.createPage(clip, null, -1, PAGE_INDEX.SPLASH_01, 1, function (page) {
            page.addContent(new libs.contentSplashPage01(page));
        });

        var openingPage01 = new libs.createPage(clip, null, -1, PAGE_INDEX.OPENING_01, 1, function (page) {
            page.addContent(new libs.contentOpeningPage01(page));
        });

        var activityPage01 = new libs.createPage(clip, null, -1, PAGE_INDEX.ACTIVITY_01, 1, function (page) {
            page.addContent(new libs.contentActivityPage01(page));
        });

        clip.timeline.addTween(cjs.Tween.get({})
            .to({ state: [{ t: splashPage01 }] })            
            //.to({ state: [{ t: activityPage01 }] })
            .to({ state: [{ t: openingPage01 }] }, 1)
            .to({ state: [{ t: activityPage01 }] }, 1)
            .wait(1));

        return clip;
    });

    // create page
    (libs.createPage = function (parent, imgBg, prevIndex, currIndex, nextIndex, callback) {
        var page = new createjs.Container();
        page.parent = parent;

        var activity = parent.parent;
        var topHeaderBar = null;
        var menuHeaderBar = null;        
        var btnInventoryCallback = null;
        var btnInventoryOnClose = null;        
        var isMenuHidden = false;

        page.currIndex = currIndex;

        page.hideMenu = function () {
            isMenuHidden = true;
        }

        page.showMenuNavigationBtns = function (isVisible) {
            activity.menuPanel.getMenuBtn().visible = isVisible;            
        }

        page.hideNavigation = function () {
            
        }

        page.hideBtnBack = function () {
            
        }

        page.hideBtnNext = function () {
            
        }

        page.showBtnNext = function () {
            
        }

        page.showBtnBack = function () {
            
        }

        page.disableBtnNext = function () {
            
        }

        page.enableBtnNext = function (extra) {
            
        }

        page.overrideBtnNext = function (callback) {
            btnNextCallback = callback;
        }

        page.overrideBtnBack = function (callback) {
            btnBackCallback = callback;
        }

        page.btnNextText = function (text) {
            
        }

        page.btnNextSubmit = function (callback) {
            btnNextCallback = callback;            
        }

        page.btnNextRevert = function (callback) {            
            btnNextCallback = callback;
        }

        page.getContainer = function () {
            return page;
        }

        page.getBtnBack = function () {
            
        }

        page.getBtnNext = function () {
            
        }

        page.setBtnNextBackImages = function (imgNext, imgBack) {
           
        }

        page.setUnitLogoTextColor = function (color) {
            unitLogo.setTextColor(color);
        }

        page.showInventoryBtn = function (callback, onClose) {
            // inventory Disabled
            if (ENABLE_INVENTORY) {
                btnInventory.visible = true;
                btnInventoryCallback = callback;
                btnInventoryOnClose = onClose;
            }
        }

        page.hideBottomBar = function () {
            
        }

        page.setBottomBarColor = function (color) {
            
        }

        page.jumpTo = function (nextIndex, extra) {            
            if (pages[parent.currentFrame].content.stop) {
                pages[parent.currentFrame].content.stop();
            }
            parent.gotoAndStop(nextIndex);            

            // play page animation              
            pages[nextIndex].play();

            if (pages[nextIndex].content.play) {
                pages[nextIndex].content.play(extra);
            }
        }

        page.backTo = function (prevIndex) {
            if (pages[parent.currentFrame].content.stop) {
                pages[parent.currentFrame].content.stop();
            }
            parent.gotoAndStop(prevIndex);

            parent.parent.headerPanel.updatePowerBtn();

            // play page animation            
            pages[prevIndex].back();
            if (pages[prevIndex].content.back) {
                pages[prevIndex].content.back();
            }
        }

        page.play = function () {
            if (!IsEmpty(topHeaderBar)) {
                topHeaderBar.y = -80;
                createjs.Tween.get(topHeaderBar, { override: true }).to({ y: -10 }, 200);
            }            
        }

        page.back = function () {
            activity.menuPanel.visible = IsEmpty(menuHeaderBar) ? false : true;
        }

        page.addContent = function (content, iconType, title, width, headerText, extra) {
            if (!IsEmpty(content.addBefore)) {
                page.addChild(content.addBefore());
            }

            if (!IsEmpty(headerText)) {
                page.addChild(topHeaderBar = createTopHeaderBar(headerText, width, extra));
            }
            
            if (!IsEmpty(content)) {
                page.content = content;
                page.addChild(content);
            }
            
            if (!isMenuHidden) {
                page.addChild(menuHeaderBar = createMenuHeaderBar(iconType, title, width, extra));
            }
            page.addChild(unitLogo);            

            if (!IsEmpty(content.addLast)) {
                page.addChild(content.addLast());
            }            
            page.addChild(btnInventory);

            if (!IsEmpty(content.addPageLast)) {
                page.addChild(content.addPageLast());
            }
        }

        page.getPage = function () {
            return page;
        }

        page.getBg = function () {
            if (!IsEmpty(bg)) {
                return bg;
            }
            return null;
        }

        // bg
        if (!IsEmpty(imgBg)) {
            var bg = new createjs.Bitmap(imgBg);
            page.addChild(bg);
        } else {
            var empty = new cjs.Shape(new cjs.Graphics().beginFill("#212121").drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
            page.addChild(empty);
        }

        var createTopHeaderBar = function (title, width, extra) {
            if (IsEmpty(title)) {
                title = "";
            }

            var header = new createjs.Container();
            header.setTransform(-10, -10);
            
            var imgBg = new createjs.Shape(new createjs.Graphics().beginFill("#622232").moveTo(0, 0).lineTo(1160, 0).lineTo(1140, 90).lineTo(0, 90));
            var fontSize = 24;
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.fontSize)) {
                    fontSize = extra.fontSize;
                }
            }
            var text = new cjs.Text(title, "500 " + fontSize + "px Noto Sans SC", "#fff8e0");
            text.setTransform(width + 25, 33);

            if (title.includes("\n")) {
                text.lineHeight = 30;
                text.y -= 13;
                if (!IsEmpty(extra)) {
                    if (!IsEmpty(extra.lineHeight)) {
                        text.lineHeight = extra.lineHeight;
                    }
                    if (!IsEmpty(extra.offsetY)) {
                        text.y += (extra.offsetY + 13);
                    }

                    if (!IsEmpty(extra.offsetX)) {
                        text.x += extra.offsetX;
                    }
                }
            }

            header.addChild(imgBg);
            header.addChild(text);

            header.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);
            return header;
        }

        var createMenuHeaderBar = function (iconType, title, width, extra) {
            if (IsEmpty(title)) {
                title = "";
            }
            if (IsEmpty(width)) {
                width = 340;
            }

            var iconMenuHeaderBar = null;
            var textMenuHeaderBar = null;

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.menuHeaderBarIcon)) {
                    iconMenuHeaderBar = new createjs.Bitmap(extra.menuHeaderBarIcon);
                    iconMenuHeaderBar.setTransform(PAGE_WIDTH - 190, 35, 0.5, 0.5, 0, 0, 0, iconMenuHeaderBar.getBounds().width * 0.5, iconMenuHeaderBar.getBounds().height * 0.5)
                }
                if (!IsEmpty(extra.menuHeaderBarText)) {
                    textMenuHeaderBar = new cjs.Text(extra.menuHeaderBarText, "700 26px Noto Sans SC", "#4E342E");
                    textMenuHeaderBar.textAlign = "right";
                    textMenuHeaderBar.textBaseline = "middle";
                    textMenuHeaderBar.setTransform(PAGE_WIDTH - 250, 35);
                }

            }

            var header = new createjs.Container();
            header.setTransform(0, 0);

            if (!IsEmpty(iconType)) {
                var imgChapterBg = new createjs.ScaleBitmap(imgs.header_bar_chapter, new createjs.Rectangle(150, 0, 20, 90));
                imgChapterBg.setDrawSize(width, 80);                

                var imgIcon;
                var rotateX = 15;
                switch (iconType) {
                    case ICON_SUBJECT_TYPE.BOOK: {
                        imgIcon = imgs.icon_chapter;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.BULB: {
                        imgIcon = imgs.icon_bulb;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.PHONE: {
                        imgIcon = imgs.icon_phone;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.POSTCARD: {
                        imgIcon = imgs.icon_postcard;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.PENCIL: {
                        imgIcon = imgs.icon_color_pencil;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.CHECKBOX: {
                        imgIcon = imgs.icon_checkbox;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.CHESS: {
                        imgIcon = imgs.icon_chess;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.VIDEO: {
                        imgIcon = imgs.icon_video;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.STARS: {
                        imgIcon = imgs.icon_2stars;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.STAR: {
                        imgIcon = imgs.icon_1star;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.GAMEPAD: {
                        imgIcon = imgs.icon_gamepad;
                        rotateX = 15;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.SCOOTER_01: {
                        imgIcon = imgs.icon_color_scooter_01;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.SCOOTER_02: {
                        imgIcon = imgs.icon_color_scooter_02;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.QUESTION: {
                        imgIcon = imgs.icon_question;
                        rotateX = 15;
                        break;
                    }
                }
                // header type icon
                var iconHeaderType = new createjs.Bitmap(imgIcon);
                iconHeaderType.setTransform(200, 40, 0.5, 0.5, rotateX, 0, 0, 48, 48)
                header.addChild(imgChapterBg);
                header.addChild(iconHeaderType);
            }            

            // right icon
            var iconRight = new createjs.Bitmap(imgs.icon_caret_right);
            iconRight.setTransform(10, 20, 0.75, 0.75, 0, 0, 0, 0, 0)            

            // subject
            var textSubject = new cjs.Text(title, "700 32px Noto Sans SC", "#FFC7C6");
            textSubject.textBaseline = "middle";
            textSubject.setTransform(245, 40);
            
            header.addChild(iconRight);
            if (!IsEmpty(iconMenuHeaderBar)) {
                header.addChild(iconMenuHeaderBar);
            }
            if (!IsEmpty(textMenuHeaderBar)) {
                header.addChild(textMenuHeaderBar);
            }
            header.addChild(textSubject);
            return header;
        }

        var createInventoryBtn = function () {
            var btn = new cjs.Bitmap(imgs.icon_backpack);
            btn.setTransform(PAGE_WIDTH - 240, 50, 1, 1, 15, 0, 0, 40, 50);
            btn.shadow = new libs.createShadow(SHADOW_TYPE.BUTTON);
            btn.on("mouseover", function () {
                createjs.Tween.get(btn, { override: true }).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
            });
            btn.on("mouseout", function () {
                createjs.Tween.get(btn, { override: true }).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
            });
            btn.on("click", function () {
                if (!IsEmpty(btnInventoryCallback)) {
                    btnInventoryCallback();
                }
                if (!IsEmpty(btnInventoryOnClose)) {
                    activity.inventoryPanel.onClose(btnInventoryOnClose);
                }

                activity.inventoryPanel.show();

            });
            btn.cursor = "pointer";
            btn.visible = false;
            return btn
        }

        var createUnitLogo = function () {
            var width = 200;
            var height = 50;
            var container = new cjs.Container();
            container.setTransform(PAGE_WIDTH, 13, 1, 1, 0, 0, 0, width, 0);

            container.setTextColor = function (color) {
                title.color = color;
            }
            /*
            var imgBg = new createjs.ScaleBitmap(imgs.header_bar_unit, new createjs.Rectangle(25, 0, 5, 50));
            imgBg.setDrawSize(width, height);
            imgBg.cache(-20, -20, width + 40, height + 40);
            imgBg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);            
            */

            var title = new cjs.Text("", "600 24px Noto Sans SC", TEXT_COLOR.DEFAULT);
            title.textAlign = "center";
            title.textBaseline = "middle";
            title.setTransform((width * 0.5) + 15, (height * 0.5) - 3);

            //container.addChild(imgBg);
            container.addChild(title);
            //container.addChild(imgBg2);
            //container.shadow = libs.createShadow(SHADOW_TYPE.PANEL);
            //container.cache(-20, -20, width + 40, height + 40);
            return container;
        }
        
        var btnInventory = createInventoryBtn();
        var unitLogo = createUnitLogo();

        if (!IsEmpty(callback)) {
            callback(page);
        }
        pages.push(page)
        return page;
    });

    /************ PAGES STARTS ************/
    // unit page01
    (libs.contentUnitPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;

        container.reset = function () {
        }

        container.stop = function () {
        };

        container.play = function () {
            container.reset();
        };

        parent.hideBtnBack();
        
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();    

    (libs.contentSplashPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;
        var videoPanel = clip.parent.videoPanel;
        var imgBg = null;

        container.addBefore = function () {
            imgBg = new cjs.Bitmap(imgs.bg_splash);                        
            return imgBg;            
        }

        container.reset = function () {            
            libs.stopSound();
            scene01.reset();            
        }

        container.stop = function () {
            libs.stopSound();
            scene01.removeVideoListeners();
        };

        container.play = function () {
            container.reset();            
        };

        container.back = function () {
            container.reset();
        };                

        parent.hideMenu();
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");        

        var handleVisibilityChange = function () {
            if (document[hidden]) {
                if (!IsEmpty(gMusicInstance)) gMusicInstance.paused = true;
                if (!IsEmpty(gLocalMusicInstance)) gLocalMusicInstance.paused = true;
                if (!IsEmpty(gAudioInstance)) gAudioInstance.paused = true;
            } else {
                if (!IsEmpty(gMusicInstance)) gMusicInstance.paused = false;
                if (!IsEmpty(gLocalMusicInstance)) gLocalMusicInstance.paused = false;
                if (!IsEmpty(gAudioInstance)) gAudioInstance.paused = false;
            }
        }
        AddVisibilityChange(handleVisibilityChange);        

        var createScene = function () {
            var container = new cjs.Container();            
            var idStage = -1;

            // do not reset
            var hasAddedVideoListeners = false;

            var videoTimeupdate = function () {

            }

            var videoPlay = function () {

            }

            var videoEnded = function () {
                switch (idStage) {
                    case 0:
                        libs.captureImgToImg(img, imgBg);
                        scene01.play();                        
                        break;
                    case 1:                        
                        libs.captureImgToImg(img, imgBg);
                        setTimeout(function () {                            
                            parent.jumpTo(PAGE_INDEX.OPENING_01);
                        }, 2000)
                        break;
                }
            }

            container.removeVideoListeners = function () {                
                videoPanel.video.removeEventListener('timeupdate', videoTimeupdate);
                videoPanel.video.removeEventListener("play", videoPlay)
                videoPanel.video.removeEventListener("ended", videoEnded);
                hasAddedVideoListeners = false;
            }

            container.play = function () {
                idStage++;
                //console.log("stage: " + idStage);
                let src = null;
                let startTime = 0
                switch (idStage) {
                    case 0: src = "videos/CPDD_white.mp4"; break;
                    case 1: src = "videos/Credit_page.mp4"; break;
                }
                if (!IsEmpty(src)) {
                    videoPanel.video.src = src;
                    videoPanel.video.currentTime = startTime;
                    switch (idStage) {
                        case 0:                        
                            videoPanel.video.play();
                            break;                        
                    }
                    if (!hasAddedVideoListeners) {
                        hasAddedVideoListeners = true;
                        videoPanel.video.addEventListener('timeupdate', videoTimeupdate);
                        videoPanel.video.addEventListener("play", videoPlay)
                        videoPanel.video.addEventListener("ended", videoEnded);
                    }
                }
            }

            container.reset = function () {
                idStage = -1;                
                clip.parent.musicControl.show(false);
            }

            container.showAll = function () { }                                                             

            var btnStart = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 635, "", imgs.btnstartoff, imgs.btnstarton, function () {
                btnStart.visible = false;

                scene01.play();
                //parent.jumpTo(PAGE_INDEX.OPENING_01);
            }, { isClickInteraction: true });            

            var img = new cjs.Bitmap(videoPanel.video);                        

            container.addChild(img);
            container.addChild(btnStart);            
            return container;
        }

        var scene01 = createScene();                

        container.addChild(scene01);
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();

    (libs.contentOpeningPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;
        var videoPanel = clip.parent.videoPanel;
        var imgBg = null

        container.addBefore = function () {
            imgBg = new cjs.Bitmap(imgs.bg_opening);
            return imgBg;           
        }

        container.reset = function () {            
            libs.stopSound();
            scene01.reset();

        }

        container.stop = function () {
            libs.stopSound();
        };

        container.play = function () {
            container.reset();
            clip.parent.musicControl.show(true);
            scene01.play();
        };

        container.back = function () {
            container.reset();
        };

        parent.hideMenu();
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");                

        var createScene = function () {
            var container = new cjs.Container();
            var idStage = -1;

            // do not reset
            var hasAddedVideoListeners = false;

            container.play = function () {
                idStage++;
                //console.log("stage: " + idStage);
                let src = null;
                let startTime = 0
                switch (idStage) {
                    case 0: libs.playMusic("BGM_V1"); src = "videos/V1.mp4"; break;
                    case 1: src = "videos/V2.mp4"; break;
                    case 2: src = "videos/V3.mp4"; break;
                    case 3: src = "videos/V4.mp4"; break;
                    case 4: videoPanel.video.play(); break;
                    case 5: src = "videos/V5.mp4"; break;
                    case 6: src = "videos/V6.mp4"; break;
                }
                if (!IsEmpty(src)) {
                    videoPanel.video.src = src;
                    videoPanel.video.currentTime = startTime;
                    switch (idStage) {
                        case 0:
                        case 1:
                        case 2:
                        case 5:
                        case 6:
                            videoPanel.video.play();
                            break;
                        case 3:
                            videoPanel.video.pause();
                            break;
                    }
                    if (idStage === 0 && !hasAddedVideoListeners) {
                        hasAddedVideoListeners = true;
                        videoPanel.video.addEventListener('timeupdate', function () {
                            switch (idStage) {
                                case 1:
                                    if (btnPlay.visible === true && videoPanel.video.currentTime > 0.01) {
                                        btnPlay.visible = false;
                                    }
                            }
                        });
                        videoPanel.video.addEventListener("play", function () {
                            switch (idStage) {
                                case 1:
                                    clip.parent.musicControl.show(false);
                                    break;
                            }
                        })
                        videoPanel.video.addEventListener("ended", function () {
                            switch (idStage) {
                                case 0:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    libs.fadeIn(btnPlay);
                                    break;
                                case 1:
                                    clip.parent.musicControl.show(true);                                    
                                    libs.captureImgToImg(img, imgBg);
                                    scene01.play();
                                    break;
                                case 2:
                                    libs.playMusic("BGM_V3");                                    
                                    libs.captureImgToImg(img, imgBg);
                                    libs.fadeIn(btnNext);
                                    break;
                                case 4:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    libs.fadeIn(btnNext);
                                    break;
                                case 5:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    libs.fadeIn(btnNext);
                                    break;
                                case 6:
                                    libs.fadeIn(btnCross, null, function () {
                                        libs.captureCanvasToImg(function (pic) {
                                            if (IsEmpty(pic)) pic = imgs.bg_activity;
                                            imgBg.image = pic;

                                        })
                                    });                                    
                                    break;

                            }

                        });
                    }
                }
            }

            container.reset = function () {
                idStage = -1;
                btnPlay.visible = false;
                btnNext.visible = false;
                btnCross.visible = false;
                btnPlay.reset();
                btnNext.reset();
                btnCross.reset();
                btnNext.setPos((PAGE_WIDTH * 0.5) - 1, 600);                
            }

            container.showAll = function () {
            }

            container.showBtnProceed = function (isVisible) {
                btnProceed.visible = isVisible;
            }

            var btnProceed = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 635, "", imgs.btnstartoff, imgs.btnstarton, function () {
                btnProceed.visible = false;
                scene01.play();
                libs.playMusic("BGM_V1");
            }, { isClickInteraction: false });

            var btnPlay = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 635, "", imgs.btnplayoff, imgs.btnplayon, function () {
                scene01.play();
                libs.stopMusic();
            }, {});

            var btnNext = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 600, "", imgs.btnnextoff, imgs.btnnexton, function () {
                //console.log("idStage: " + idStage);
                switch (idStage) {
                    case 2:
                        scene01.play();
                        btnNext.setEffect("btn_click");
                        btnNext.reset();
                        break;
                    case 3:
                        btnNext.visible = false;
                        btnNext.setPos((PAGE_WIDTH * 0.5) - 1, 660);
                        scene01.play();
                        btnNext.reset();
                        break;
                    case 4:
                        scene01.play();
                        btnNext.visible = false;
                        btnNext.setPos((PAGE_WIDTH * 0.5) + 130, 610);
                        btnNext.reset();
                        break;
                    case 5:
                        scene01.play();
                        btnNext.visible = false;
                        btnNext.setPos((PAGE_WIDTH * 0.5) - 1, 660);
                        btnNext.reset();
                        break;

                }

            }, { effect: "flip_paper" });

            var btnCross = libs.createCustomBtn(1103, 493, "", imgs.btnXoff, imgs.btnXon, function () {
                btnCross.reset();                
                parent.jumpTo(PAGE_INDEX.ACTIVITY_01, { pic: imgBg.image });
            }, {});

            btnPlay.visible = false;
            btnNext.visible = false;
            btnCross.visible = false;

            var img = new cjs.Bitmap(videoPanel.video);
            
            container.addChild(img);            
            container.addChild(btnPlay);
            container.addChild(btnNext);
            container.addChild(btnCross);
            //container.addChild(btnProceed);            

            return container;
        }

        var scene01 = createScene();        

        container.addChild(scene01);
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();

    (libs.contentActivityPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;
        var videoPanel = clip.parent.videoPanel;
        var imgBg = null

        container.addBefore = function () {
            imgBg = new cjs.Bitmap(imgs.bg_activity);
            return imgBg;            
        }

        container.reset = function () {            
            libs.stopSound();
            scene01.reset();
            
        }

        container.stop = function () {
            libs.stopSound();
        };

        container.play = function (data) {
            //console.log("data: " + data);
            if (!IsEmpty(data)) {
                if (!IsEmpty(data.pic)) {
                    imgBg.image = data.pic;
                }                
            }
            container.reset();
            scene01.play();
        };

        container.back = function () {
            container.reset();
        };

        parent.hideMenu();
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");                

        var createScene = function () {
            var container = new cjs.Container();

            var idStage = -1;            
            var srcWitnessSelectionVideo = null;
            var srcWitnessVerdictVideo = null;
            var picTryAgain = null;
            var picExplanation01 = null;
            var picExplanation02 = null;

            // do not reset
            var hasAddedVideoListeners = false;
            var overlayWitnessList = [];

            var data = [
                { x: 114, y: 86, pic: imgs.witness1, defPosXList: [310, 700, 1070], ranges: [0, 0, 0], checkboxOffsetX: -10, viewed: false, selected: false },
                { x: 176, y: 283, pic: imgs.witness2, defPosXList: [315, 720, 1093], ranges: [0, 0, 0], checkboxOffsetX: 10, viewed: false, selected: false },
                { x: 125, y: 483, pic: imgs.witness3, defPosXList: [310, 700, 1070], ranges: [0, 0, 0], checkboxOffsetX: 5, viewed: false, selected: false },
                { x: 650, y: 89, pic: imgs.witness4, defPosXList: [360, 750, 1130], ranges: [0, 0, 0], checkboxOffsetX: 10, viewed: false, selected: false },
                { x: 741, y: 283, pic: imgs.witness5, defPosXList: [315, 715, 1085], ranges: [0, 0, 0], checkboxOffsetX: 5, viewed: false, selected: false },
            ];

            container.play = function (id) {
                if (!IsEmpty(id)) {
                    idStage = id
                } else {
                    idStage++;
                }
                
                //console.log("stage: " + idStage);
                let src = null;
                let startTime = 0
                switch (idStage) {
                    case 0: src = "videos/V7.mp4"; break;
                    case 1: src = "videos/V8.mp4"; break;
                    case 2: src = srcWitnessSelectionVideo; break;
                    case 3: src = srcWitnessVerdictVideo; break;
                }
                if (!IsEmpty(src)) {
                    videoPanel.video.src = src;
                    videoPanel.video.currentTime = startTime;
                    switch (idStage) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            videoPanel.video.play();
                            break;                        
                    }
                    if (idStage === 0 && !hasAddedVideoListeners) {
                        hasAddedVideoListeners = true;
                        videoPanel.video.addEventListener('timeupdate', function () {                            
                        });
                        videoPanel.video.addEventListener("play", function () {
                        })
                        videoPanel.video.addEventListener("ended", function () {
                            switch (idStage) {
                                case 0:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    showWitnessOverlay(true);
                                    libs.fadeIn(btnNext);
                                    break;
                                case 1:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    picTryAgain = imgBg.image;
                                    showWitnessCheckbox(true);
                                    libs.fadeIn(btnNext);
                                    break;
                                case 2:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    libs.fadeIn(btnChooseAgain);
                                    libs.fadeIn(btnConfirm);
                                    break;
                                case 3:                                    
                                    libs.captureImgToImg(img, imgBg);
                                    libs.fadeIn(btnExplanation01);
                                    libs.fadeIn(btnExplanation02);
                                    libs.fadeIn(btnReplay)
                                    break;
                            }
                        });
                    }
                }
            }

            container.reset = function () {
                if (!IsEmpty(imgBg)) {
                    imgBg.visible = true;
                }
                idStage = -1;                
                srcWitnessSelectionVideo = null;
                srcWitnessVerdictVideo = null;
                picTryAgain = null;
                picExplanation01 = null;
                picExplanation02 = null;                
                btnNext.visible = false;
                btnReplay.visible = false;
                btnChooseAgain.visible = false;
                btnConfirm.visible = false;
                btnExplanation01.visible = false;
                btnExplanation02.visible = false;

                btnNext.reset();
                btnReplay.reset();
                btnChooseAgain.reset();
                btnConfirm.reset();
                btnExplanation01.reset();
                btnExplanation02.reset();

                resetWitnessOverlay();
                showWitnessOverlay(false);
                showWitnessCheckbox(false);

                data.forEach(function (item) {
                    item.viewed = false;
                    item.selected = false;
                    item.ranges = [0, 0, 0];
                })
            }

            container.showAll = function () {
            }

            container.showBtnProceed = function (isVisible) {
                btnProceed.visible = isVisible;
            }

            var createInfoPage = function (pic, parent, extra) {                
                var page = null;

                var createPage = function (pic, extra) {
                    var container = new cjs.Container();

                    var posClose = { x: 920, y: 240 };

                    if (!IsEmpty(extra)) {
                        if (!IsEmpty(extra.posCloseX)) {
                            posClose.x = extra.posCloseX;
                        }
                        if (!IsEmpty(extra.posCloseY)) {
                            posClose.y = extra.posCloseY;
                        }
                    }

                    var img = new cjs.Bitmap(pic);                    
                    img.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, img.getBounds().width, img.getBounds().height));
                    var btnCross = libs.createCustomBtn(posClose.x, posClose.y, "", imgs.btnXoff, imgs.btnXon, function () {
                        parent.removeChild(page);
                    }, {});                    

                    img.on("click", function () { });
                    container.addChild(img);
                    container.addChild(btnCross);
                    return container;
                }

                if (!IsEmpty(page)) {
                    parent.removeChild(page);                    
                }
                page = createPage(pic, extra);
                parent.addChild(page);
            }

            var createWitnessOverlays = function (parent, data, updateRange) {                
                var container = new cjs.Container();                

                var createOverlay = function (idWitness, x, y, pic, defPosXList, ranges) {
                    var container = new cjs.Container();
                    container.setTransform(x, y);

                    const width = 460;
                    const height = 170;

                    container.reset = function () {
                        checkbox01.reset();
                        bar01.reset();
                        bar02.reset();
                        bar03.reset();
                    }

                    container.showCheckbox = function (isVisible) {
                        if (isVisible) {
                            libs.fadeIn(checkbox01);
                        } else {
                            checkbox01.visible = false;
                        }                        
                    }

                    var witness = null;

                    var createWitness = function (pic, ranges, onSave) {
                        var container = new cjs.Container();

                        var posClose = { x: 1200, y: 80 };
                        var rangesDefault = [ranges[0], ranges[1], ranges[2]];

                        var bg = new cjs.Bitmap(imgs.bg);
                        bg.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, bg.getBounds().width, bg.getBounds().height));

                        var img = new cjs.Bitmap(pic);
                        img.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, img.getBounds().width, img.getBounds().height));

                        var createSlider = function (idSlider, x, y, offsetX, range) {
                            var container = new cjs.Container();
                            container.setTransform(x, y);

                            var status = "none";
                            var min;
                            var max;
                            var range01;
                            var range02;

                            var imgSlider = null;
                            var imgKnob = null;

                            container.getStatus = function () {
                                return status;
                            }

                            container.getRange = function () {
                                return knob01.x;
                            }

                            var checkRanges = function (x, update00, update01, update02, update03) {
                                if (x === min) {
                                    update00();
                                    status = "none"
                                } else if (x > min && x < range01) {
                                    update01();
                                    status = "yellow"
                                } else if (x >= range01 && x < range02) {
                                    update02();
                                    status = "pink"
                                } else if (x >= range02 && x <= max) {
                                    update03();
                                    status = "blue"
                                }
                            }


                            var createKnob = function (x, y, pic, update) {
                                var container = new cjs.Container();
                                container.setTransform(x, y);

                                var img = new cjs.Bitmap(pic);
                                img.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, img.getBounds().width, img.getBounds().height));
                                img.setTransform(0, 0, 1, 1, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);

                                container.cursor = "pointer";
                                container.on("pressmove", function (evt) {
                                    evt.currentTarget.x = (evt.stageX + offsetX);
                                    if (evt.currentTarget.x < min) evt.currentTarget.x = min;
                                    if (evt.currentTarget.x > max) evt.currentTarget.x = max;

                                    checkRanges(evt.currentTarget.x,
                                        function () {
                                            if (img !== imgs.btngrey) {
                                                img.image = imgs.btngrey;
                                                update("none");
                                            }
                                        },
                                        function () {
                                            if (img !== imgs.btnyellow) {
                                                img.image = imgs.btnyellow;
                                                update("yellow");
                                            }
                                        },
                                        function () {
                                            if (img !== imgs.btnpink) {
                                                img.image = imgs.btnpink;
                                                update("pink");
                                            }
                                        },
                                        function () {
                                            if (img !== imgs.btnblue) {
                                                img.image = imgs.btnblue;
                                                update("blue");
                                            }
                                        });

                                    /*
                                    if (evt.currentTarget.x >= min && evt.currentTarget.x < range01) {
                                        if (img !== imgs.btnyellow) {
                                            img.image = imgs.btnyellow;
                                            update("yellow");
                                        }
                                    } else if (evt.currentTarget.x >= range01 && evt.currentTarget.x < range02) {
                                        if (img !== imgs.btnpink) {
                                            img.image = imgs.btnpink;
                                            update("pink");
                                        }
                                    } else if (evt.currentTarget.x >= range02 && evt.currentTarget.x <= max) {
                                        if (img !== imgs.btnblue) {
                                            img.image = imgs.btnblue;
                                            update("blue");
                                        }
                                    }
                                    */
                                    updateRange(idWitness, idSlider, evt.currentTarget.x);
                                    gm.getStage().update();
                                })

                                container.addChild(img);
                                return container;
                            }

                            var img = new cjs.Bitmap(imgs.slidebar0);
                            img.setTransform(0, 0, 1, 1, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);

                            min = -img.getBounds().width * 0.5 + 10;
                            max = img.getBounds().width * 0.5 - 20;
                            range01 = min + 85;
                            range02 = min + 170;

                            if (range === 0) range = min;// + 40;

                            checkRanges(range,
                                function () {
                                    imgSlider = imgs.slidebar0;
                                    imgKnob = imgs.btngrey;
                                },
                                function () {
                                    imgSlider = imgs.slidebar1;
                                    imgKnob = imgs.btnyellow;
                                },
                                function () {
                                    imgSlider = imgs.slidebar2;
                                    imgKnob = imgs.btnpink;
                                },
                                function () {
                                    imgSlider = imgs.slidebar3;
                                    imgKnob = imgs.btnblue;
                                });                            

                            img.image = imgSlider;                                                       

                            var knob01 = createKnob(range, 10, imgKnob, function (color) {
                                if (color === "none") {
                                    if (img.image !== imgs.slidebar0) {
                                        img.image = imgs.slidebar0;
                                    }
                                } else if (color === "yellow") {
                                    if (img.image !== imgs.slidebar1) {
                                        img.image = imgs.slidebar1;
                                    }
                                } else if (color === "pink") {
                                    if (img.image !== imgs.slidebar2) {
                                        img.image = imgs.slidebar2;
                                    }
                                } else if (color === "blue") {
                                    if (img.image !== imgs.slidebar3) {
                                        img.image = imgs.slidebar3;
                                    }
                                }

                                status = color;
                            });

                            container.addChild(img);
                            container.addChild(knob01);
                            return container;
                        }                        

                        var btnDef01 = libs.createCustomBtn(defPosXList[0], 463, "", imgs.btndefinitionoff, imgs.btndefinitionon, function () {
                            btnDef01.reset();
                            createInfoPage(imgs.def_authoritative, parent, { posCloseX: 1010 });
                        }, {});

                        var btnDef02 = libs.createCustomBtn(defPosXList[1], 463, "", imgs.btndefinitionoff, imgs.btndefinitionon, function () {
                            btnDef02.reset();
                            createInfoPage(imgs.def_objective, parent, { posCloseX: 1010 });
                        }, {});

                        var btnDef03 = libs.createCustomBtn(defPosXList[2], 463, "", imgs.btndefinitionoff, imgs.btndefinitionon, function () {
                            btnDef03.reset();
                            createInfoPage(imgs.def_trustworthy, parent, { posCloseX: 1010 });
                        }, {});
                        
                        var slider01 = createSlider(0, 270, 550, -267, ranges[0]);
                        var slider02 = createSlider(1, 660, 550, -659, ranges[1]);
                        var slider03 = createSlider(2, 1030, 550, -1031, ranges[2]);

                        var btnSave = libs.createCustomBtn(PAGE_WIDTH * 0.5, 673, "", imgs.btnsaveansoff, imgs.btnsaveanson, function () {
                            parent.removeChild(witness);
                            witness = null;
                            onSave(slider01.getStatus(), slider02.getStatus(), slider03.getStatus(), slider01.getRange(), slider02.getRange(), slider03.getRange());
                        }, {});

                        var btnCross = libs.createCustomBtn(posClose.x, posClose.y, "", imgs.btnXoff, imgs.btnXon, function () {
                            ranges[0] = rangesDefault[0];
                            ranges[1] = rangesDefault[1];
                            ranges[2] = rangesDefault[2];
                            parent.removeChild(witness);
                            witness = null;
                        }, {});
                        bg.on("click", function () { });
                        container.addChild(bg);
                        container.addChild(img);
                        container.addChild(btnDef01, btnDef02, btnDef03);
                        container.addChild(slider01, slider02, slider03);                        
                        container.addChild(btnSave);
                        container.addChild(btnCross);
                        return container;
                    }

                    var bg = new cjs.Shape(new cjs.Graphics().beginFill("#CDCDCD02").drawRect(0, 0, width, height));

                    container.cursor = "pointer";
                    bg.on("click", function () {
                        //console.log("range01: " + ranges[0]);
                        //console.log("before: data range01: " + data[idWitness].ranges[0]);
                        if (IsEmpty(witness)) {
                            witness = createWitness(pic, data[idWitness].ranges, function (status01, status02, status03, range01, range02, range03) {
                                //console.log("status01: " + status01);
                                bar01.updateStatus(status01);
                                bar02.updateStatus(status02);
                                bar03.updateStatus(status03);                                
                                data[idWitness].ranges[0] = range01;
                                data[idWitness].ranges[1] = range02;
                                data[idWitness].ranges[2] = range03;
                                if (status01 !== "none" && status02 !== "none" && status03 !== "none") {
                                    data[idWitness].viewed = true;
                                } else {
                                    data[idWitness].viewed = false;
                                } 
                                //console.log("save data range01: " + data[idWitness].ranges[0]);
                            });
                            parent.addChild(witness);
                        }                        
                    });

                    var createBar = function (x, y) {
                        var container = new cjs.Container();
                        container.setTransform(x, y);

                        container.reset = function () {
                            img.image = imgs.bar0;
                        }

                        container.updateStatus = function (status) {
                            switch (status) {
                                case "none": img.image = imgs.bar0; break;
                                case "yellow": img.image = imgs.bar1; break;
                                case "pink": img.image = imgs.bar2; break;
                                case "blue": img.image = imgs.bar3; break;
                            }
                        }

                        var img = new cjs.Bitmap(imgs.bar0);
                        img.setTransform(0, 0, 1, 1, 0, 0, 0, img.getBounds().width, 0);

                        container.addChild(img);
                        container.mouseEnabled = false;
                        return container;
                    }

                    var createCheckbox = function (x, y) {
                        var container = new cjs.Container();
                        container.setTransform(x, y);

                        container.reset = function () {
                            img.image = imgs.uncheck;
                        }

                        var img = new cjs.Bitmap(imgs.uncheck);
                        img.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, img.getBounds().width, img.getBounds().height));
                        img.setTransform(data[idWitness].checkboxOffsetX, 0, 1, 1, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);

                        container.cursor = "pointer";
                        container.on("click", function () {
                            if (img.image === imgs.uncheck) {
                                img.image = imgs.check;
                                data[idWitness].selected = true;
                            } else {
                                img.image = imgs.uncheck;
                                data[idWitness].selected = false;
                            }
                        })

                        container.addChild(img);
                        return container;
                    }

                    //var bar01 = new cjs.Bitmap(imgs.bar1);
                    //bar01.setTransform(width - 60, 45, 1, 1, 0, 0, 0, bar01.getBounds().width, 0);

                    var bar01 = createBar(width - 60, 45);
                    var bar02 = createBar(width - 60, 83);
                    var bar03 = createBar(width - 60, 121);

                    var checkbox01 = createCheckbox(width, 0);
                    checkbox01.visible = false;

                    container.addChild(bg);
                    container.addChild(bar01, bar02, bar03);
                    container.addChild(checkbox01);
                    return container;
                };

                data.forEach(function (item, index) {
                    var overlay = createOverlay(index, item.x, item.y, item.pic, item.defPosXList, item.ranges);
                    container.addChild(overlay);
                    overlayWitnessList.push(overlay);
                });               

                return container;
            }

            var resetWitnessOverlay = function () {
                overlayWitnessList.forEach(function (item) {
                    item.reset();
                });
            }

            var showWitnessOverlay = function (isVisible) {
                overlayWitnessList.forEach(function (item) {
                    item.visible = isVisible;
                });
            }

            var showWitnessCheckbox = function (isVisible) {
                overlayWitnessList.forEach(function (item) {
                    item.showCheckbox(isVisible);
                });
            }

            var overlayWitnesses = createWitnessOverlays(container, data, function (idWitness, idSlider, value) {
                data[idWitness].ranges[idSlider] = value;
                //console.log("value: " + value);
            });

            var btnProceed = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 635, "", imgs.btnstartoff, imgs.btnstarton, function () {
                btnProceed.visible = false;
                scene01.play();
                
            }, { isClickInteraction: false });            

            var btnReplay = libs.createCustomBtn(840, 660, "", imgs.btnreplayoff, imgs.btnreplayon, function () {
                imgBg.visible = false;
                parent.jumpTo(PAGE_INDEX.OPENING_01);
            }, {});

            var btnNext = libs.createCustomBtn(960, 630, "", imgs.btnnextoff, imgs.btnnexton, function () {                
                switch (idStage) {
                    case 0:
                        var allViewed = true;
                        data.forEach(function (item) {
                            if (!item.viewed) allViewed = false;
                        })
                        if (!allViewed) {
                            createInfoPage(imgs.error1, container);
                        } else {
                            scene01.play();
                            btnNext.visible = false;
                        }
                        btnNext.reset();                        
                        break;
                    case 1:
                    case 2:
                        var numSelected = 0;
                        data.forEach(function (item) {
                            if (item.selected) numSelected++;
                        })
                        if (numSelected !== 2) {
                            createInfoPage(imgs.error2, container);
                            btnNext.reset();
                        } else {

                            if (data[0].selected && data[1].selected) {
                                srcWitnessSelectionVideo = "videos/V9_1_2.mp4";
                                srcWitnessVerdictVideo = "videos/lose_1_2.mp4";
                                picExplanation01 = imgs.explanation1;
                                picExplanation02 = imgs.explanation2;
                            } else if (data[0].selected && data[2].selected) {
                                srcWitnessSelectionVideo = "videos/V9_1_3.mp4";
                                srcWitnessVerdictVideo = "videos/lose_1_3.mp4";
                                picExplanation01 = imgs.explanation1;
                                picExplanation02 = imgs.explanation3;
                            } else if (data[0].selected && data[3].selected) {
                                srcWitnessSelectionVideo = "videos/V9_1_4.mp4";
                                srcWitnessVerdictVideo = "videos/lose_1_4.mp4";
                                picExplanation01 = imgs.explanation1;
                                picExplanation02 = imgs.explanation4;
                            } else if (data[0].selected && data[4].selected) {
                                srcWitnessSelectionVideo = "videos/V9_1_5.mp4";
                                srcWitnessVerdictVideo = "videos/lose_1_5.mp4";
                                picExplanation01 = imgs.explanation1;
                                picExplanation02 = imgs.explanation5;
                            } else if (data[1].selected && data[2].selected) {
                                srcWitnessSelectionVideo = "videos/V9_2_3.mp4";
                                srcWitnessVerdictVideo = "videos/lose_2_3.mp4";
                                picExplanation01 = imgs.explanation2;
                                picExplanation02 = imgs.explanation3;
                            } else if (data[1].selected && data[3].selected) {
                                srcWitnessSelectionVideo = "videos/V9_2_4.mp4";
                                srcWitnessVerdictVideo = "videos/lose_2_4.mp4";
                                picExplanation01 = imgs.explanation2;
                                picExplanation02 = imgs.explanation4;
                            } else if (data[1].selected && data[4].selected) {
                                srcWitnessSelectionVideo = "videos/V9_2_5.mp4";
                                srcWitnessVerdictVideo = "videos/lose_2_5.mp4";
                                picExplanation01 = imgs.explanation2;
                                picExplanation02 = imgs.explanation5;
                            } else if (data[2].selected && data[3].selected) {
                                srcWitnessSelectionVideo = "videos/V9_3_4.mp4";
                                srcWitnessVerdictVideo = "videos/win.mp4";
                                picExplanation01 = imgs.explanation3;
                                picExplanation02 = imgs.explanation4;
                            } else if (data[2].selected && data[4].selected) {
                                srcWitnessSelectionVideo = "videos/V9_3_5.mp4";
                                srcWitnessVerdictVideo = "videos/lose_3_5.mp4";
                                picExplanation01 = imgs.explanation3;
                                picExplanation02 = imgs.explanation5;
                            } else if (data[3].selected && data[4].selected) {
                                srcWitnessSelectionVideo = "videos/V9_4_5.mp4";
                                srcWitnessVerdictVideo = "videos/lose_4_5.mp4";
                                picExplanation01 = imgs.explanation4;
                                picExplanation02 = imgs.explanation5;
                            }

                            libs.captureCanvasToImg(function (pic) {
                                imgBg.image = pic;
                                showWitnessOverlay(false);
                                img.image = videoPanel.video;
                                scene01.play(2);
                                btnNext.visible = false;
                                btnConfirm.visible = false;
                                btnChooseAgain.visible = false;
                                btnNext.reset();
                                btnConfirm.reset();
                                btnChooseAgain.reset();
                            })                            
                        }                      
                        break;                    
                    
                }
            }, {});

            var btnChooseAgain = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 100, 100, "", imgs.btnchooseagainoff, imgs.btnchooseagainon, function () {
                switch (idStage) {
                    case 2:
                        img.image = picTryAgain;
                        showWitnessOverlay(true);
                        btnChooseAgain.visible = false;
                        btnConfirm.visible = false;
                        btnConfirm.reset();
                        btnChooseAgain.reset();                        
                        btnNext.visible = true;
                        break;                    
                }
            }, {});

            var btnConfirm = libs.createCustomBtn((PAGE_WIDTH * 0.5) + 100, 100, "", imgs.btnconfirmoff, imgs.btnconfirmon, function () {
                switch (idStage) {
                    case 2:
                        scene01.play();
                        btnChooseAgain.visible = false;
                        btnConfirm.visible = false;
                        btnConfirm.reset();
                        btnChooseAgain.reset();                        
                        break;
                }
            }, {});

            var btnExplanation01 = libs.createCustomBtn(660, 570, "", imgs.btnexplanationoff, imgs.btnexplanationon, function () {
                switch (idStage) {
                    case 3:
                        btnExplanation01.reset();
                        createInfoPage(picExplanation01, container, { posCloseX: 1160, posCloseY: 110 });
                        break;
                }
            }, {});

            var btnExplanation02 = libs.createCustomBtn(1030, 570, "", imgs.btnexplanationoff, imgs.btnexplanationon, function () {
                switch (idStage) {
                    case 3:
                        btnExplanation02.reset();
                        createInfoPage(picExplanation02, container, { posCloseX: 1160, posCloseY: 110 });
                        break;
                }
            }, {});

            //btnPlay.visible = false;
            btnNext.visible = false;
            btnReplay.visible = false;
            btnChooseAgain.visible = false;
            btnConfirm.visible = false;
            btnExplanation01.visible = btnExplanation02.visible = false;

            var img = new cjs.Bitmap(videoPanel.video);
            
            container.addChild(img);
            container.addChild(overlayWitnesses);
            container.addChild(btnNext);
            container.addChild(btnReplay);
            container.addChild(btnChooseAgain);
            container.addChild(btnConfirm);
            container.addChild(btnExplanation01, btnExplanation02);
            //container.addChild(btnProceed);
            return container;
        }

        var scene01 = createScene();        

        container.addChild(scene01);
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();
    /************ PAGES ENDS ************/

    /************ HELPER STARTS ************/
    (libs.playSound = function (audioCilp, onComplete) {
        if (!IsEmpty(gAudioInstance)) {
            gAudioInstance.stop();
        }
        gAudioInstance = cjs.Sound.play(audioCilp);
        gAudioInstance.volume = 1;
        //if (document[hidden]) audioInstance.paused = true;
        gAudioInstance.on("complete", function () {
            if (!IsEmpty(onComplete)) {
                onComplete();
            }
        })
        return gAudioInstance;
    });

    (libs.playEffect = function (audioCilp, onComplete) {
        if (!IsEmpty(gEffectInstance)) {
            gEffectInstance.stop();
        }
        gEffectInstance = cjs.Sound.play(audioCilp);
        gEffectInstance.volume = 1;
        //if (document[hidden]) audioInstance.paused = true;
        gEffectInstance.on("complete", function () {
            if (!IsEmpty(onComplete)) {
                onComplete();
            }
        })
        return gEffectInstance;
    });

    (libs.stopSound = function () {
        if (!IsEmpty(gAudioInstance)) {
            gAudioInstance.stop();
        }
        gAudioInstance = null;
    });

    (libs.stopEffect = function () {
        if (!IsEmpty(gEffectInstance)) {
            gEffectInstance.stop();
        }
        gEffectInstance = null;
    });

    (libs.playMusic = function (audioCilp) {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.stop();
        }
        gMusicInstance = cjs.Sound.play(audioCilp);
        gMusicInstance.volume = gMusicSetting.vol;
        gMusicInstance.loop = -1;
        //gMusicInstance.muted = true;
    });

    (libs.stopMusic = function () {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.stop();
        }
        gMusicInstance = null;
    });

    (libs.pauseMusic = function () {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.volume = 0.0;
        }        
    });  

    (libs.resumeMusic = function () {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.volume = gMusicSetting.vol;
        }
    });  

    (libs.playLocalMusic = function (audioClip) {
        if (IsEmpty(gLocalMusicInstance)) {
            gLocalMusicInstance = cjs.Sound.play(audioClip);
            gLocalMusicInstance.volume = 0.2;
            gLocalMusicInstance.loop = -1;
        }
    });

    (libs.stopLocalMusic = function () {
        if (!IsEmpty(gLocalMusicInstance)) {
            gLocalMusicInstance.stop();
            gLocalMusicInstance = null;
        }
    });

    (libs.createCustomText = function (x, y, msg, extra) {
        var fontSize = 30;
        var lineHeight = 40;
        var textAlign = "left";
        var textColor = TEXT_COLOR.DEFAULT;
        var fontWeight = 700;
        var fontType = "Noto Sans SC";

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.fontSize)) {
                fontSize = extra.fontSize;
            }
            if (!IsEmpty(extra.fontWeight)) {
                fontWeight = extra.fontWeight;
            }
            if (!IsEmpty(extra.lineHeight)) {
                lineHeight = extra.lineHeight;
            }
            if (!IsEmpty(extra.textAlign)) {
                textAlign = extra.textAlign;
            }
            if (!IsEmpty(extra.textColor)) {
                textColor = extra.textColor;
            }
            if (!IsEmpty(extra.fontType)) {
                fontType = extra.fontType;
            }
        }        

        var text = new cjs.Text(msg, fontWeight + " " + fontSize + "px " + fontType, textColor);
        text.textBaseline = "middle";
        text.textAlign = textAlign;
        text.lineHeight = lineHeight;
        text.setTransform(x, y);

        return text;
    });

    // video panel
    (libs.createVideoPanel = function (parent, x, y) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);

        var onVideoCloseCallback;

        container.onVideoClose = function (callback) {
            onVideoCloseCallback = callback;
        }

        var videoBg = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,0.75)").drawRect(0, 0, 1280, 960));
        videoBg.on("click", function () { });
        var btnClose = new createjs.Bitmap(imgs.btn_close);
        btnClose.cursor = "pointer";
        btnClose.setTransform(1150, 170, 1.5, 1.5, 0, 0, 0, 30, 30);
        btnClose.shadow = new createjs.Shadow("rgba(0,0,0,0.6)", 0, 8, 36);
        btnClose.on("click", function () {
            container.videoContainer.style.setProperty("display", "none");
            container.video.pause();
            container.visible = false;
            if (!IsEmpty(onVideoCloseCallback)) {
                onVideoCloseCallback();
            }
        });
        btnClose.addEventListener("mouseover", function () {
            createjs.Tween.get(btnClose).to({ scaleX: 1.55, scaleY: 1.55 }, 100, createjs.Ease.quintInOut);
        });
        btnClose.addEventListener("mouseout", function () {
            createjs.Tween.get(btnClose).to({ scaleX: 1.5, scaleY: 1.5 }, 100, createjs.Ease.quintInOut);
        });

        container.addChild(videoBg);
        container.addChild(btnClose);
        container.visible = false;

        container.videoContainer = document.getElementById("videoContainer");
        container.video = document.getElementById("video");
        container.videoContainer.style.display = 'none';
        container.video.style.display = 'none';

        return container;
    });

    // menu panel
    (libs.createMusicControl = function (x, y) {
        var container = new createjs.Container();        
        container.setTransform(x, y);

        container.show = function (isVisible) {
            container.visible = isVisible;
        }

        var btnMusic = libs.createCustomBtn(0, 0, "", imgs.btnmusicoff, imgs.btnmusicon, function () {
            let img = btnMusic.getImg();            
            if (img.image === imgs.btnmusicon) {
                btnMusic.setPic(imgs.btnmusicoff);
                gMusicSetting.vol = 0;
            } else {
                btnMusic.setPic(imgs.btnmusicon);
                gMusicSetting.vol = gMusicSetting.volDefault;
            }
            if (!IsEmpty(gMusicInstance)) {
                gMusicInstance.volume = gMusicSetting.vol;
            }
            
        }, { isClickInteraction: true });

        btnMusic.setPic(imgs.btnmusicon);
        gMusicSetting.vol = gMusicSetting.volDefault;;

        container.addChild(btnMusic);
        return container;
    });    

    (libs.createSplashPanel = function (parent, x, y) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);        

        var onCloseCallback;        

        container.onClose = function (callback) {
            onCloseCallback = callback;
        }       

        container.setText = function (msg) {
            btn.setText(msg);
        }

        var requestFullScreen = function () {
            var canvas = document.getElementById("canvas");
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen()
                    .then(function () {
                        // element has entered fullscreen mode successfully
                        screen.orientation.lock("landscape")
                            .then(function () {
                                //alert('Locked');
                            })
                            .catch(function (error) {
                                //alert(error);
                                title.text = error;
                            });
                    })
                    .catch(function (error) {
                        // element could not enter fullscreen mode
                        // error message
                        //title.text = error.message;
                    });
            }
            else if (canvas.webkitRequestFullScreen) {
                canvas.webkitRequestFullScreen();
                screen.orientation.lock("landscape")
                    .then(function () {
                        //alert('Locked');
                    })
                    .catch(function (error) {
                        //alert(error);
                        //title.text = error;
                    });
            }
        }

        var createBtn = function (x, y, onClick) {
            var container = new cjs.Container();

            const width = 300;
            const height = 120;

            container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

            container.setText = function (msg) {
                text.text = msg;
            }

            var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(4).beginStroke("#106AB0").beginFill("#0091EA").drawRect(0, 0, width, height));
            var text = libs.createCustomText(width * 0.5, height * 0.5, "关闭视频", { textColor: "#FFFFFF", textAlign: "center", fontSize: 40 })

            libs.createBtnEffect(container, onClick)

            container.addChild(bg);
            container.addChild(text);
            return container;
        }

        var bg = new createjs.Shape(new createjs.Graphics().beginFill("#78909CF0").drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
        bg.on("click", function () { });        

        var btn = createBtn(PAGE_WIDTH * 0.5, PAGE_HEIGHT * 0.5, function () {
            container.visible = false;

            requestFullScreen();

            if (!IsEmpty(onCloseCallback)) {
                onCloseCallback();
                onCloseCallback = null;
            }
        });

        container.addChild(bg);        
        container.addChild(btn);
        container.visible = false;
        return container;
    });        

    // create btn effect
    (libs.createBtnEffect = function (container, onClick, extra) {
        var defaultScale = 1;
        var expandScale = 1;
        var isClickInteraction = false;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.defaultScale)) {
                defaultScale = extra.defaultScale;
            }
            if (!IsEmpty(extra.expandScale)) {
                expandScale = extra.expandScale;
            }
            if (!IsEmpty(extra.isClickInteraction) && extra.isClickInteraction === true) {
                isClickInteraction = extra.isClickInteraction;
            }
        }

        container.on("mouseover", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.bypassScale) && extra.bypassScale === true) return;
            createjs.Tween.get(container, { /*override: true*/ }).to({ scaleX: expandScale, scaleY: expandScale }, 100, createjs.Ease.quintInOut);
            if (!IsEmpty(extra) && !IsEmpty(extra.onMouseover)) {
                extra.onMouseover();
            }
        });
        container.on("mouseout", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.bypassScale) && extra.bypassScale === true) return;
            createjs.Tween.get(container, { /*override: true*/ }).to({ scaleX: defaultScale, scaleY: defaultScale }, 100, createjs.Ease.quintInOut);
            if (!IsEmpty(extra) && !IsEmpty(extra.onMouseout)) {
                extra.onMouseout();
            }
        });
        container.on("mouseup", function () {
            //console.log("mouseup");
            if (!IsEmpty(extra) && !IsEmpty(extra.onMouseup)) {
                extra.onMouseup();
            }
        });
        container.on("mousedown", function () {
            //console.log("mousedown");            
            if (!IsEmpty(extra) && !IsEmpty(extra.onMousedown)) {
                extra.onMousedown();
            }            
        });
        /*
        container.on("click", function () {
            if (!IsEmpty(onClick)) {
                onClick();
            }
        });
        */
        container.cursor = "pointer";
    });  

    // create shadow
    (libs.createShadow = function (type, shadowColor) {
        var color = "#000000";
        if (!IsEmpty(shadowColor)) {
            color = shadowColor;
        }
        switch (type) {
            case SHADOW_TYPE.PANEL: {
                return new cjs.Shadow(color + "66", 0, 8, 24);
            }
            case SHADOW_TYPE.BUTTON: {
                return new cjs.Shadow(color + "99", 0, 8, 36);
            }
            case SHADOW_TYPE.ICON: {
                return new cjs.Shadow(color + "99", 0, 4, 12);
            }
        }
    });    

    // set filters
    (libs.setFilters = function (target, color, extra) {
        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        target.uncache();

        if (!IsEmpty(target.getBounds())) {
            width = target.getBounds().width;
            height = target.getBounds().height;
        }
        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.size)) {
                width = extra.size.width;
                height = extra.size.height;
            }
            if (!IsEmpty(extra.pos)) {
                x = extra.pos.x;
                y = extra.pos.y;
            }
        }
        var colorDec = ColorHex2Dec(color);
        target.filters = [new createjs.ColorFilter(0, 0, 0, 1, colorDec[0], colorDec[1], colorDec[2], 0)];
        target.cache(x, y, width, height);
    }); 

    // create play button
    (libs.createPlayBtn = function (x, y, onClick, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y)

        var scale = 1;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.scale)) {
                scale = extra.scale;
            }
        }

        var btn = new createjs.Shape(new cjs.Graphics().beginFill("#D84848").setStrokeStyle(4).beginStroke("#FFFFFF").drawCircle(0, 0, 40));
        btn.setTransform(30, 30, 1, 1, 0, 0, 0, 30, 30)

        var icon = new createjs.Bitmap(imgs.icon_play);
        icon.setTransform(5, 0, 0.75, 0.75, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
        libs.setFilters(icon, "#FFFFFF");

        container.on("mouseover", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: (scale * 1.05), scaleY: (scale * 1.05) }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: scale, scaleY: scale }, 100, createjs.Ease.quintInOut);
        });
        container.on("click", function () {
            onClick();
        });
        container.cursor = "pointer";        

        container.scaleX = container.scaleY = scale;

        container.addChild(btn);
        container.addChild(icon);
        return container;
    });

    // create generic button
    (libs.createGenericBtn = function (parent, title, x, y, btnSize, onClick, extra) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);
        var isDisabled = false;
        container.disable = function () {
            commandBg.style = "#B0BEC5";
            commandStroke.style = "#78909C";
            btn.cursor = "default";
            container.scaleX = container.scaleY = 1;
            isDisabled = true;
        }

        container.enable = function () {
            commandBg.style = "#0091EA";
            commandStroke.style = "#106AB0";
            btn.cursor = "pointer";
            isDisabled = false;
        }

        var width = btnSize.w;
        var height = btnSize.h;
        var fontSize = 30;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.fontSize)) {
                fontSize = extra.fontSize;
            }
        }
        
        var btn = new cjs.Shape();
        var commandBg = btn.graphics.beginFill("#0091EA").command;
        var commandStroke = btn.graphics.setStrokeStyle(3).beginStroke("#106AB0").command;
        btn.graphics.drawRect(0, 0, width, height);
        btn.shadow = libs.createShadow(SHADOW_TYPE.PANEL);        
        btn.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        btn.cursor = "pointer";
        btn.on("click", function () {
            if (isDisabled) return;
            onClick();
        });
        btn.addEventListener("mouseover", function () {
            if (isDisabled) return;
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
        });
        btn.addEventListener("mouseout", function () {
            if (isDisabled) return;
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
        });

        var btnTitle = new cjs.Text(title, "500 " + fontSize + "px Noto Sans SC", "#FFFFFF");
        btnTitle.textAlign = "center";
        btnTitle.textBaseline = "middle";
        btnTitle.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);

        container.addChild(btn);
        container.addChild(btnTitle);

        return container;
    });
    
    // fade in item
    (libs.fadeIn = function (item, duration, callback) {
        item.visible = true;
        item.alpha = 0;
        if (IsEmpty(duration)) {
            duration = 550;
        }
        createjs.Tween.get(item, { override: true }).to({ alpha: 1 }, duration, createjs.Ease.linear).call(function () {                                    
            if (!IsEmpty(callback)) {
                callback();
            }
        });        
    });  

    // fade in item
    (libs.fadeOut = function (item, duration) {
        item.visible = true;
        item.alpha = 1;
        if (IsEmpty(duration)) {
            duration = 550;
        }
        createjs.Tween.get(item, { override: true }).to({ alpha: 0 }, duration);
    });  

    (libs.blinkColor = function (text, defaultColor, nextColor, speed) {
        if (!IsEmpty(text.isBlinking) && text.isBlinking) {
            text.color = (text.color === defaultColor) ? text.color = nextColor : text.color = defaultColor;
            setTimeout(function () {
                libs.blinkColor(text, defaultColor, nextColor, speed);
            }, speed);
            //createjs.Tween.get(box).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
        }
    });        

    (libs.createVideoBtn = function (x, y, onClick) {
        var container = new cjs.Container();
        container.setTransform(x, y)

        var imgBg = new cjs.ScaleBitmap(imgs.button_hex_01, new cjs.Rectangle(45, 0, 20, 80));
        imgBg.setDrawSize(300, 80);
        imgBg.setTransform(0, 0, 1, 1, 0, 0, 0, 150, 40);

        var text = libs.createCustomText(45, 0, "观看动画", { textAlign: "center", textColor: "#FFFFFF" });

        var icon = new cjs.Bitmap(imgs.icon_video);
        icon.setTransform(-70, -15, 0.7, 0.7, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);;

        container.on("mouseover", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1.02, scaleY: 1.02 }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
        });
        container.on("click", function () {
            onClick();
        });
        container.cursor = "pointer";

        container.addChild(imgBg);
        container.addChild(icon);
        container.addChild(text);
        return container;
    });

    (libs.createPlayAndPauseBtn = function (x, y, vo, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        var speech = null;
        var scale = 1;

        container.isVoPlaying = function () {
            return icon.image === imgs.icon_pause;
        }

        container.setVo = function (newVo) {
            vo = newVo;
        }
        //var props = new cjs.PlayPropsConfig().set({ interrupt: cjs.Sound. })        
        container.reset = function () {
            if (!IsEmpty(speech)) {
                speech.paused = true;
            }
            speech = null;
            icon.image = imgs.icon_play;
            icon.x = 2;
            icon.updateCache();
        }

        container.play = function () {
            if (IsEmpty(vo)) return;
            if (icon.image === imgs.icon_play) {
                if (!IsEmpty(speech)) {
                    speech.paused = false;
                } else {
                    libs.stopSound();
                    speech = libs.playSound(vo);
                    speech.on("complete", function () {
                        speech = null;
                        icon.image = imgs.icon_play;
                        icon.x = 2;
                        icon.updateCache();
                    })
                    if (!IsEmpty(extra)) {
                        if (!IsEmpty(extra.onPlay)) {
                            extra.onPlay();
                        }
                    }
                }
                icon.image = imgs.icon_pause;
                icon.x = 0;
                icon.updateCache();
            } else {
                speech.paused = true;
                icon.image = imgs.icon_play;
                icon.x = 2;
                icon.updateCache();
            }

        }

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.scale)) {
                scale = extra.scale;
            }
        }
        var bg = new createjs.Shape(new cjs.Graphics().beginFill("#FFC5C8").setStrokeStyle(3).beginStroke("#D34946").drawRect(0, 0, 40, 40));
        bg.setTransform(0, 0, 1, 1, 0, 0, 0, 20, 20)

        var icon = new cjs.Bitmap(imgs.icon_play);
        icon.setTransform(2, 0, 0.35, 0.35, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
        libs.setFilters(icon, "#D34946");

        container.on("mouseover", function (evt) {
            createjs.Tween.get(container, { override: true }).to({ scaleX: scale + 0.1, scaleY: scale + 0.1 }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: scale, scaleY: scale }, 100, createjs.Ease.quintInOut);
        });
        container.on("mousedown", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onPlay)) {
                extra.onPlay();
            }
            container.play()
        });
        container.cursor = "pointer";
        container.scaleX = container.scaleY = scale;

        container.addChild(bg);
        container.addChild(icon);
        return container;
    });                
        
    (libs.calImgScale = function (img, imgWidth, imgHeight) {
        var imgScale = 1;
        if (!IsEmpty(img) && !IsEmpty(img.getBounds())) {
            if (img.getBounds().height > imgHeight) {
                imgScale = imgHeight / img.getBounds().height;
            } else {
                if (img.getBounds().width > img.getBounds().height) {
                    imgScale = imgWidth / img.getBounds().width;
                } else {
                    if (img.getBounds().width > imgWidth) {
                        imgScale = imgWidth / img.getBounds().width;
                    } else {
                        imgScale = imgHeight / img.getBounds().height;
                    }
                }                
            }
        }
        return imgScale;
    });

    (libs.calImgScaleAtHeight = function (img, imgWidth, imgHeight) {
        var imgScale = 1;
        if (!IsEmpty(img) && !IsEmpty(img.getBounds())) {
            if (img.getBounds().height > imgHeight) {
                imgScale = imgHeight / img.getBounds().height;
            } else {
                if (img.getBounds().width > imgWidth) {
                    imgScale = imgHeight / img.getBounds().height;                    
                } else {
                    imgScale = imgWidth / img.getBounds().width;
                }
            }
        }
        return imgScale;
    });

    (libs.calImgScaleAtWidth = function (img, imgWidth, imgHeight) {
        var imgScale = 1;
        if (!IsEmpty(img) && !IsEmpty(img.getBounds())) {
            if (img.getBounds().width < img.getBounds().height) {
                imgScale = imgHeight / img.getBounds().height;
            } else {
                if (img.getBounds().width > imgWidth) {
                    imgScale = imgWidth / img.getBounds().width;
                } else {
                    if (img.getBounds().height > imgHeight) {
                        imgScale = imgHeight / img.getBounds().height;
                    } else {
                        imgScale = imgWidth / img.getBounds().width;
                    }
                }
            }
            
        }
        return imgScale;
    });

    (libs.createLine = function (x0, y0, x1, y1, color, extra) {
        var thickness = 8;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.thickness)) {
                thickness = extra.thickness;
            }
        }
        var line = new cjs.Shape(new cjs.Graphics().setStrokeStyle(thickness).beginStroke(color).moveTo(x0, y0).lineTo(x1, y1));
        return line;
    });

    (libs.createCustomBtn = function (x, y, msg, imgOff, imgOn, onClick, extra) {
        var container = new cjs.Container();        
        
        let textColor = "#A0FA78";
        var isClickInteraction = false;
        let effect = "btn_click";

        if (!IsEmpty(extra)) {            
            if (!IsEmpty(extra.textColor)) {
                textColor = extra.textColor;
            }
            if (!IsEmpty(extra.isClickInteraction) && extra.isClickInteraction === true) {
                isClickInteraction = extra.isClickInteraction;
            }
            if (!IsEmpty(extra.effect)) {
                effect = extra.effect;
            }
        }

        container.reset = function () {
            imgBg.image = imgOff;
        }

        container.setPos = function (x, y) {
            container.x = x;
            container.y = y;
        }

        container.setEffect = function (sound) {
            effect = sound;
        }        

        container.getImg = function () {
            return imgBg;
        }

        container.setPic = function (pic) {
            imgBg.image = pic;
        }

        container.click = function () {
            if (!IsEmpty(onClick)) {
                onClick();
            }
        }

        var imgBg = new cjs.Bitmap(imgOff);
        imgBg.crossOrigin = "Anonymous"
        imgBg.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, imgBg.getBounds().width, imgBg.getBounds().height));
        container.setTransform(x, y, 1, 1, 0, 0, 0, imgBg.getBounds().width * 0.5, imgBg.getBounds().height * 0.5);

        var text = libs.createCustomText(0, 0, msg, { textColor: textColor, textAlign: "center", fontSize: 26 });

        //container.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#000000A0").drawRect(-width * 0.5 + 30, -height * 0.5, width - 60, height * 0.5));
        container.cursor = "pointer";
        if (isClickInteraction) {
            container.on("click", function () {
                libs.playEffect("btn_click");
                onClick();
            });            
        } else {
            container.on("mousedown", function () {
                libs.playEffect(effect);
                imgBg.image = imgOn;

            });
            container.on("pressup", function () {                
                onClick();
            })
        }
        

        /*
        container.on("click", function () {
            onClick();
        })
        */

        container.addChild(imgBg);
        container.addChild(text);
        return container;
    });    

    (libs.captureCanvasToImg = function (callback) {
        gParentActivity.cache(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        callback(gParentActivity.cacheCanvas);
        gParentActivity.uncache();
    });

    (libs.captureImgToImg = function (imgSrc, imgDest) {
        imgSrc.cache(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        imgDest.image = imgSrc.cacheCanvas;
        imgSrc.uncache();
    });
    /************ HELPER ENDS ************/
    
    (libs.pageActivityBg = function (parent, timeline) {
        this.initialize(imgs.page_activity01_bg);
        this.parent = parent;
        this.setTransform(-((1280 - PAGE_WIDTH) * 0.5), -((960 - PAGE_HEIGHT) * 0.5));
        if(!IsEmpty(timeline)){
            timeline.addTween(cjs.Tween.get(this).wait(1)); 
        } 
    }).prototype = p = new cjs.Bitmap();
    p.nominalBounds = new cjs.Rectangle(0,0,1741,960);       
    
    // functions
    playActivity.functions = {
        getLibraries: function() {             
            return libs; 
        },
        getImages: function() { return imgs; },        
        getCurFrame: function() { return curFrame; }
    };
    
})(createjs = createjs||{}, PlaytivateActivity = PlaytivateActivity||{});
var createjs, PlaytivateActivity;


