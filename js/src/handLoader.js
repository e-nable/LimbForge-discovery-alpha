var HandLoader = function(manifest,design){
    if (!manifest || !manifest.parts) throw new Error("Expected a manifest with a parts array.");

    var currentMesh, originalMesh, flippedMesh,
        flipped = false;

    function getParts(hand,size,design){


        if (hand !== "left" && hand !== "right") throw new Error("Expected hand to be either right or left");
        if (typeof size != "number" || size < 100 || size > 200) throw new Error("Expected size to be a number between 100 and 200");
        if (typeof design != "object") throw new Error("Expected design to be an object");

        return _.filter(manifest["parts"],function(part){
            return part["handedness"].indexOf(hand) > -1; // if "handedness" includes the specified handedness, it's included!
        });
    }

    function loadDisplayModel(hand,size,design,cb){
        // This function assumes there's one display model which is scaled and mirrored for the user's benefit.
        // This display model is NOT THE SAME as the files that are downloaded for printing.
        var loader = new THREE.STLLoader();
        loader.load( design.directory + manifest["displayModel"], function ( geometry, data ) {

            var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
            material.side = THREE.DoubleSide;
            var mesh = new THREE.Mesh( geometry, material );
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Manipulate the mesh according to display pref's, specifically "hand" (if it needs to be mirrored) and
            // "size" to zoom it with reference to a fixed grid
            mesh.rotation.set(-Math.PI*0.45,0,0 );
            mesh.position.set(0,0,0);

            scene.add( mesh );

            // Store references so the display model can be manipulated
            originalMesh = currentMesh = mesh;
            flippedMesh = generateFlippedMeshFromMesh(mesh);

            if (cb) cb(data);
        } );
    }

    function generateFlippedMeshFromMesh(mesh){
        // create separate mesh for flipped view. Lighting on flipped faces looks super weird.
        // See http://stackoverflow.com/questions/27722441/loading-object-as-geometry-instead-of-buffergeometry-in-threejs
        var flippedGeometry = new THREE.Geometry().fromBufferGeometry( mesh.geometry );
        flippedGeometry.dynamic = true;

        for (var i = 0, l = flippedGeometry.faces.length; i < l; i++) {

            var face = flippedGeometry.faces[i];
            var temp = face.a;
            face.a = face.c;
            face.c = temp;

        }

        var faceVertexUvs = flippedGeometry.faceVertexUvs[0];
        for (i = 0, l = faceVertexUvs.length; i < l; i++) {

            var vector2 = faceVertexUvs[i][0];
            faceVertexUvs[i][0] = faceVertexUvs[i][2];
            faceVertexUvs[i][2] = vector2;
        }

        var flipped = new THREE.Mesh( flippedGeometry, mesh.material );
        flipped.rotation.set(mesh.rotation.x,mesh.rotation.y,mesh.rotation.z );
        flipped.scale.set(-1,1,1);

        return flipped;
    }

    return {
        loadDisplayHand : function(hand,size,design,cb){
            loadDisplayModel(hand,size,design,cb);
        },
        setDisplayModelSize: function(size) {
            if (currentMesh) {
                currentMesh.scale.set((flipped ? -1 : 1 ) * size/100,size/100,size/100);
                render();
            }
        },
        flip: function(flip){
            flipped = flip;

            var currScale = Math.abs(currentMesh.scale.y);

            flippedMesh.scale.set(-1*currScale,currScale,currScale);
            originalMesh.scale.set(currScale,currScale,currScale);

            currentMesh = flipped ? flippedMesh : originalMesh;
            var otherMesh = flipped ? originalMesh : flippedMesh;

            scene.remove(otherMesh);
            scene.add(currentMesh);

            render();
        },
        getFiles: function(hand,size,design,successCallback,errorCallback){
            var parts = getParts(hand,size,design);
            var files = [];
            var completedDownloads = 0;

            // Trigger a download of each part via xhr, specifying blob type
            _.each(parts,function(p){

                (function(){
                    var partfilename = _.template(p.file_name_template)({handedness:hand,size:size});
                    var partDirname = design.directory + _.template(p.file_dir_template)({handedness:hand,size:size});

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