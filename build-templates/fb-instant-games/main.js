(function () {

    console.log = function () {
    }
    
    function initializeGameAsync() {
        FBInstant.initializeAsync().then(function () {
            FBInstant.setLoadingProgress(globalLoadingProgressCount);
            globalProgressLoop = setInterval(function () {
                globalLoadingProgressCount++;
                FBInstant.setLoadingProgress(globalLoadingProgressCount);
            }, 360);
            window.globalInitGameAsyncResolved = true;
        }).catch(function (err) {
            console.error(err);
            setTimeout(function () {
                initializeGameAsync();
            }, 1000);
        });
    }
    function boot () {

        let RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
        let INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
        let MAIN = cc.AssetManager.BuiltinBundleName.MAIN;

        let settings = {
            platform: "fb-instant-games",
            groupList: ["default"],
            collisionMatrix: [
                [true]
            ],
            hasResourcesBundle: true,
            hasStartSceneBundle: false,
            remoteBundles: [],
            subpackages: [],
            launchScene: "db://assets/scene/PlayGame.fire",
            orientation: "",          
            debug: false
        };

        // init engine
        var canvas;

        if (cc.sys.isBrowser) {
            canvas = document.getElementById('GameCanvas');
        }

        var onStart = function () {
            cc.view.resizeWithBrowserSize(true);
            cc.view.enableRetina(true);

            if (cc.sys.isMobile) {
                if (settings.orientation === 'landscape') {
                    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                }
                else if (settings.orientation === 'portrait') {
                    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                }
                // qq, wechat, baidu
                cc.view.enableAutoFullScreen(
                    cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU &&
                    cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT &&
                    cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ
                );
            }

            // Limit downloading max concurrent task to 2,
            // more tasks simultaneously may cause performance draw back on some android system / brwosers.
            // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
            if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                cc.assetManager.downloader.maxConcurrency = 2;
            }

            var launchScene = settings.launchScene;

            var bundle = cc.assetManager.bundles.find(function (b) {
                return b.getSceneInfo(launchScene);
            });

            bundle.loadScene(launchScene, 
                cc.sys.isBrowser ? function (completedCount, totalCount) {
                    var progress = 100 * completedCount / totalCount;
                    if (globalInitGameAsyncResolved) {
                        if (globalProgressLoop) {
                            clearInterval(globalProgressLoop);
                            globalProgressLoop = null;
                        }
                        FBInstant.setLoadingProgress(progress);
                    }
                } : null,
                function (err, scene) {
                    console.log('Success to load scene: ' + launchScene);
                    if (globalProgressLoop) {
                        clearInterval(globalProgressLoop);
                        globalProgressLoop = null;
                    }
                    if (globalInitGameAsyncResolved)
                        cc.director.runSceneImmediate(scene);
                    else {
                        //cc.director.preloadScene('MainGame');
                        let initCheckTimer = setInterval(function () {
                            if (globalInitGameAsyncResolved) {
                                cc.director.runSceneImmediate(scene);
                                clearInterval(initCheckTimer);
                            }
                        }, 10);
                    }
                }
            );
            
        };

        var option = {
            //width: width,
            //height: height,
            id: 'GameCanvas',
            debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
            showFPS: settings.debug,
            frameRate: 60,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
        };
        
        cc.assetManager.init({ bundleVers: settings.bundleVers });
        var bundleRoot = [INTERNAL];
        settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

        var count = 0;
        function cb (err) {
            if (err) return console.error(err.message, err.stack);
            count++;
            if (count === bundleRoot.length + 1) {
                cc.assetManager.loadBundle(MAIN, function (err) {
                    if (!err) cc.game.run(option, onStart);
                });
            }
        }

        // load plugins
        cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x; }), cb);

        // load bundles
        for (var i = 0; i < bundleRoot.length; i++) {
            cc.assetManager.loadBundle(bundleRoot[i], cb);
        }
    }  
})();
