// Set up zip.js
zip.workerScriptsPath = "js/lib/zip/";


// Zip 'em up for download:
var HandZipper = (function(obj) {

    var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

    function onerror(message) {
        alert(message);
    }

    function createTempFile(callback) {
        var tmpFilename = "tmp.zip";
        requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
            function create() {
                filesystem.root.getFile(tmpFilename, {
                    create : true
                }, function(zipFile) {
                    callback(zipFile);
                });
            }

            filesystem.root.getFile(tmpFilename, null, function(entry) {
                entry.remove(create, create);
            }, create);
        });
    }

    var model = (function() {
        var zipFileEntry, zipWriter, writer, creationMethod, URL = obj.webkitURL || obj.mozURL || obj.URL;

        return {
            setCreationMethod : function(method) {
                creationMethod = method;
            },
            addFiles : function addFiles(files, oninit, onadd, onprogress, onend) {
                var addIndex = 0;

                function nextFile() {
                    var file = files[addIndex];
                    onadd(file);
                    zipWriter.add(file.name, new zip.BlobReader(file.blob), function() {
                        addIndex++;
                        if (addIndex < files.length)
                            nextFile();
                        else
                            onend();
                    }, onprogress);
                }

                function createZipWriter() {
                    zip.createWriter(writer, function(writer) {
                        zipWriter = writer;
                        oninit();
                        nextFile();
                    }, onerror);
                }

                if (zipWriter)
                    nextFile();
                else if (creationMethod == "Blob") {
                    writer = new zip.BlobWriter();
                    createZipWriter();
                } else {
                    createTempFile(function(fileEntry) {
                        zipFileEntry = fileEntry;
                        writer = new zip.FileWriter(zipFileEntry);
                        createZipWriter();
                    });
                }
            },
            getBlobURL : function(callback) {
                zipWriter.close(function(blob) {
                    var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
                    callback(blobURL);
                    zipWriter = null;
                });
            },
            getBlob : function(callback) {
                zipWriter.close(callback);
            }
        };
    })();

    // General setup:
    model.setCreationMethod("Blob");

    // Utility. Not part of model, since it deals with DOM
    function downloadZip(zipName){
        if (typeof navigator.msSaveBlob == "function") {
            model.getBlob(function(blob) {
                navigator.msSaveBlob(blob, filenameInput.value);
            });
        } else {
            model.getBlobURL(function(blobURL) {
                var clickEvent;
                clickEvent = document.createEvent("MouseEvent");
                clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                var downloadButton = document.createElement("a");
                downloadButton.href = blobURL;
                downloadButton.download = zipName;
                document.body.appendChild(downloadButton);
                downloadButton.dispatchEvent(clickEvent);

            });
            return false;
        }
    }

    var startZipTime = 0;

    return {
        zip: function(zipName,files){
            model.addFiles(files,function(){
                // oninit
                startZipTime = (new Date()).getTime();
            },function(){
                // onadd
            },function(e){
                // onprogress
                //console.log('progress',e);
            },function(){
                // onend
                var duration = (new Date()).getTime() - startZipTime;
                console.log('Complete! Total time to compress: ' + duration + "ms");

                // Do the download
                downloadZip(zipName);
            });
        },
    }
})(this);

