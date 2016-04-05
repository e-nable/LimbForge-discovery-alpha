var HandLoader = function(manifest){
    if (!manifest || !manifest.parts) throw new Error("Expected a manifest with a parts array.");

    function getParts(hand,size,design){


        if (hand !== "left" && hand !== "right") throw new Error("Expected hand to be either right or left");
        if (typeof size != "number" || size < 100 || size > 200) throw new Error("Expected size to be a number between 100 and 200");
        if (typeof design != "string") throw new Error("Expected design to be a string");

        return _.filter(manifest["parts"],function(part){
            return part["handedness"].indexOf(hand) > -1; // if "handedness" includes the specified handedness, it's included!
        });
    }

    function loadDisplayModel(hand,size,design,cb){
        // This function assumes there's one display model which is scaled and mirrored for the user's benefit.
        // This display model is NOT THE SAME as the files that are downloaded for printing.
        var loader = new THREE.STLLoader();
        loader.load( manifest["displayModel"], function ( geometry, data ) {

            var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
            var mesh = new THREE.Mesh( geometry, material );
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Manipulate the mesh according to display pref's, specifically "hand" (if it needs to be mirrored) and
            // "size" to zoom it with reference to a fixed grid
            mesh.rotation.set(0,0,0 );
            mesh.position.set(0,0,0);

            scene.add( mesh );
            if (cb) cb(data);
        } );
    }

    return {
        loadDisplayHand : function(hand,size,design,cb){
            loadDisplayModel(hand,size,design,cb);
        },
        getFiles: function(hand,size,design,successCallback,errorCallback){
            var parts = getParts(hand,size,design);
            var files = [];
            var completedDownloads = 0;

            // Trigger a download of each part via xhr, specifying blob type
            _.each(parts,function(p){

                (function(){
                    var partfilename = _.template(p.file_name_template)({handedness:hand,size:size,designName:design});
                    var partDirname = _.template(p.file_dir_template)({handedness:hand,size:size,designName:design});

                    // Wrap xhr in anonymous function to guarantee xhr variable has its own scope for each download
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener('load', function(){

                        if (xhr.status == 200){
                            //Do something with xhr.response (not responseText), which should be a Blob
                            files.push({
                                name: partfilename,
                                blob: xhr.response
                                //                            blob: new Blob([arrayBuffers[elementName]], {type: "application/sla"})
                            });
                        } else {
                            // Error encountered!
                            errorCallback(p.name);
                        }

                        completedDownloads += 1;

                        if (completedDownloads == parts.length) {
                            successCallback(files);
                        }
                    });

                    xhr.open('GET', partDirname + partfilename);
                    xhr.responseType = 'blob';
                    xhr.send(null);
                })();
            });
        }
    };

};