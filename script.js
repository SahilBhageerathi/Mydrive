(function () {

    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddTextFile = document.querySelector("#addTextFile");
    let btnAddAlbum = document.querySelector("#addAlbum");
    let divbreadcrumb = document.querySelector("#breadcrumb");
    let aRootPath = document.querySelector("a[purpose='path']");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let resources = [];
    let cfid = -1;
    let rid = 0;

    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let appClose = divAppTitleBar.querySelector("#app-close");


    btnAddFolder.addEventListener("click", addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);
    btnAddAlbum.addEventListener("click", addAlbum);
    aRootPath.addEventListener("click", viewFolderFromPath);
    appClose.addEventListener("click", closeApp);

    function closeApp() {
        divAppTitle.innerHTML = "Title will come here";
        divAppTitle.setAttribute("rid", "");
        divAppMenuBar.innerHTML = "";
        divAppBody.innerHTML = "";
    }

    function addFolder() {
        let rname = prompt("Enter a folder Name");

        //blank name validation
        if (rname.length == 0) {
            alert("Folder's name cannot be Empty");
            return;
        }

        //when pressed cancel 

        if (!rname) {
            return;
        }

        //trim the name
        rname = rname.trim();

        //unique name validation
        let alreadyexists = resources.some(r => r.rname == rname && r.pid == cfid);

        if (alreadyexists == true) {
            alert(rname + " already exists");
            return;
        }

        rid++;
        addFolderHTML(rname, rid, cfid);

        resources.push({
            rid: rid,
            rname: rname,
            rtype: "folder",
            pid: cfid,
        })

        saveToStorage();

    }

    function addTextFile() {

        let rname = prompt("Enter text-File's Name");

        //blank name validation
        if (rname.length == 0) {
            alert("Text-File's name cannot be Empty");
            return;
        }

        //when pressed cancel 

        if (!rname) {
            return;
        }

        //trim the name
        rname = rname.trim();

        //unique name validation
        let alreadyexists = resources.some(r => r.rname == rname && r.pid == cfid);

        if (alreadyexists == true) {
            alert(rname + " already exists");
            return;
        }

        rid++;
        addTextFileHTML(rname, rid, cfid);




        resources.push({
            rid: rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            isBold: false,
            isItalic: false,
            isUnderline: false,
            bgcolor: "#ffffff",
            textcolor: "#000000",
            fontFamily: "serif",
            fontSize: 16,
            content: "I am a new file",

        })

        saveToStorage();
    }

    function addAlbum() {
        let rname = prompt("Enter your Album's Name");

        //blank name validation
        if (rname.length == 0) {
            alert("Album's name cannot be Empty");
            return;
        }

        //when pressed cancel 

        if (!rname) {
            return;
        }

        //trim the name
        rname = rname.trim();

        //unique name validation
        let alreadyexists = resources.some(r => r.rname == rname && r.pid == cfid);

        if (alreadyexists == true) {
            alert(rname + " already exists");
            return;
        }

        rid++;
        addAlbumHTML(rname, rid, cfid);



        resources.push({
            rid: rid,
            rname: rname,
            rtype: "album",
            pid: cfid,
        })

        saveToStorage();

    }

    function deleteFolder() {

        let divFolder = this.parentNode;
        let fidTBD = parseInt(divFolder.getAttribute("rid"));//folder id to be deleted
        let divName = divFolder.querySelector("[purpose='name']");
        let fnameTBD = divName.innerHTML;

        let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Are you sure you want to delete this ${fnameTBD}` + (childrenExists ? ".It also has Children." : ""));

        if (!sure) {

            return;
        }

        //remove from HTML 
        divContainer.removeChild(divFolder);

        //remove from RAM 

        deleteHelper(fidTBD);

        //Remove from storage

        saveToStorage();
    }

    function deleteHelper(fidTBD) {

        //deleting its children 
        let children = resources.filter(r => r.pid == fidTBD);

        for (let i = 0; i < children.length; i++) {
            deleteHelper(children[i].rid);
        }

        //deleting itself 

        let idx = resources.findIndex(r => r.rid == fidTBD);//get the index
        resources.splice(idx, 1);

    }

    function deleteTextFile() {
        let divTextFile = this.parentNode;
        let fidTBD = parseInt(divTextFile.getAttribute("rid"));//file id to be deleted
        let divName = divTextFile.querySelector("[purpose='name']");
        let fnameTBD = divName.innerHTML;

        // let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Are you sure you want to delete this ${fnameTBD}`);

        if (!sure) {

            return;
        }

        //remove from HTML 
        divContainer.removeChild(divTextFile);

        //remove from RAM we dont need recursive deleteas it is not a folder

        let idx = resources.findIndex(r => r.rid == fidTBD);//get the index
        resources.splice(idx, 1);

        //Remove from storage

        saveToStorage();


    }

    function deleteAlbum() {

        let divAlbum = this.parentNode;
        let fidTBD = parseInt(divAlbum.getAttribute("rid"));//file id to be deleted
        let divName = divAlbum.querySelector("[purpose='name']");
        let fnameTBD = divName.innerHTML;

        // let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Are you sure you want to delete this ${fnameTBD}`);

        if (!sure) {

            return;
        }

        //remove from HTML 
        divContainer.removeChild(divAlbum);

        //remove from RAM we dont need recursive deleteas it is not a folder

        let idx = resources.findIndex(r => r.rid == fidTBD);//get the index
        resources.splice(idx, 1);

        //Remove from storage

        saveToStorage();

    }

    function renameFolder() {
        let nrname = prompt("Enter a folder Name");//newResourceName

        //blank name validation
        if (nrname.length == 0) {
            alert("Folder's name cannot be Empty");
            return;
        }

        //when pressed cancel 

        if (!nrname) {
            return;
        }

        //trim the name
        nrname = nrname.trim();

        //old name validation
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");
        let oldrname = divName.innerHTML;

        if (oldrname == nrname) {
            alert("Enter a new Name");
            return;
        }


        //unique name validation
        let alreadyexists = resources.some(r => r.rname == nrname && r.pid == cfid);

        if (alreadyexists == true) {
            alert(nrname + " already exists");
            return;
        }

        //change in HTML
        divName.innerHTML = nrname;

        //change in RAM
        let ridTBU = divFolder.getAttribute("rid")
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;

        //save to storage
        saveToStorage();

    }

    function renameTextFile() {
        let nrname = prompt("Enter File's Name");//newResourceName

        //blank name validation
        if (nrname.length == 0) {
            alert("File's name cannot be Empty");
            return;
        }

        //when pressed cancel 

        if (!nrname) {
            return;
        }

        //trim the name
        nrname = nrname.trim();

        //old name validation
        let divTextFile = this.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let oldrname = divName.innerHTML;

        if (oldrname == nrname) {
            alert("Enter a new Name");
            return;
        }


        //unique name validation
        let alreadyexists = resources.some(r => r.rname == nrname && r.pid == cfid);

        if (alreadyexists == true) {
            alert(nrname + " already exists");
            return;
        }

        //change in HTML
        divName.innerHTML = nrname;

        //change in RAM
        let ridTBU = divTextFile.getAttribute("rid")
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;

        //save to storage
        saveToStorage();

    }

    function renameAlbum() {
        let nrname = prompt("Enter Album's Name");//newResourceName

        //blank name validation
        if (nrname.length == 0) {
            alert("Album's name cannot be Empty");
            return;
        }

        //when pressed cancel 

        if (!nrname) {
            return;
        }

        //trim the name
        nrname = nrname.trim();

        //old name validation
        let divAlbum = this.parentNode;
        let divName = divAlbum.querySelector("[purpose=name]");
        let oldrname = divAlbum.innerHTML;

        if (oldrname == nrname) {
            alert("Enter a new Name");
            return;
        }


        //unique name validation
        let alreadyexists = resources.some(r => r.rname == nrname && r.pid == cfid);

        if (alreadyexists == true) {
            alert(nrname + " already exists");
            return;
        }

        //change in HTML
        divName.innerHTML = nrname;

        //change in RAM
        let ridTBU = divAlbum.getAttribute("rid")
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;

        //save to storage
        saveToStorage();

    }

    function viewFolder() {
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let apathTemplate = templates.content.querySelector("a[purpose='path']");
        let apath = document.importNode(apathTemplate, true);

        //set the name into the anchor tag
        apath.innerHTML = fname;
        //set the rid to the current folder id which is clicked
        apath.setAttribute("rid", fid);

        //add the event listener so to move with the click event
        apath.addEventListener("click", viewFolderFromPath);

        divbreadcrumb.appendChild(apath);

        cfid = fid;
        divContainer.innerHTML = "";

        for (let i = 0; i < resources.length; i++) {

            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder")
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }



    }

    function viewFolderFromPath() {

        let apath = this;
        let fid = parseInt(this.getAttribute("rid"));

        //remove the siblings in the nextSibling breadCrumb

        while (apath.nextSibling) {
            apath.parentNode.removeChild(apath.nextSibling);
        }

        //set the container

        cfid = fid;
        divContainer.innerHTML = "";

        for (let i = 0; i < resources.length; i++) {

            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder")
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }

    }


    function viewTextFile() {
        //get the text File name and set it as the title
        let divTextFile = this.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        //set the menuBar 
        let divNotepadMenuTemplate = templates.content.querySelector("[purpose='notepad-menu']");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);


        //set the body

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);


        //work on save,bold,italic......

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGcolor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextcolor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let spanForUpload = divAppMenuBar.querySelector("[action=forupload]");
        let inputUpload = divAppMenuBar.querySelector("[action=upload]");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGcolor.addEventListener("change", changeNotepadBGcolor);
        inputTextcolor.addEventListener("change", changeNotepadTextcolor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        inputUpload.addEventListener("change", uploadNotepad);
        spanForUpload.addEventListener("click", function () {
            inputUpload.click();
        });


        //setting the atttributes that are saved
        let resource = resources.find(r => r.rid == fid);


        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGcolor.value = resource.bgcolor;
        inputTextcolor.value = resource.textcolor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        let textArea = divAppBody.querySelector("textArea");
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGcolor.dispatchEvent(new Event("change"));
        inputTextcolor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));

    }

    function viewAlbum() {
        let divAlbum = this.parentNode;
        let divName = divAlbum.querySelector("[purpose='name']");
        let fname = divName.innerHTML;
        let fid = parseInt(divAlbum.getAttribute("rid"));

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        //set the menuBar 
        let divAlbumMenuTemplate = templates.content.querySelector("[purpose='album-menu']");
        let divAlbumMenu = document.importNode(divAlbumMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divAlbumMenu);


        //set the body

        let divAlbumBodyTemplate = templates.content.querySelector("[purpose=album-body]");
        let divAlbumBody = document.importNode(divAlbumBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divAlbumBody);


        let spanAdd = divAlbumMenu.querySelector("[action=add]");
        spanAdd.addEventListener("click", addPictureToAlbum);


    }
    ////////////////////////////////////////////////////////Album function/////////////////////////////////////////////////////////////////////////////

    function addPictureToAlbum() {
        let iurl = prompt("enter a image url");
        if(!iurl)
        {
            return;
        }
        let img = document.createElement("img");
        img.setAttribute("src", iurl);

        img.addEventListener("click", showPictureInMain);


        let divPictureList = divAppBody.querySelector(".picture-list");
        divPictureList.appendChild(img);
    }

    function showPictureInMain() {

        let divPictureMainImg = divAppBody.querySelector(".picture-main > img");
        divPictureMainImg.setAttribute("src", this.getAttribute("src"));

        let divPictureList = divAppBody.querySelector(".picture-list");
        let displayedImgs = divPictureList.querySelectorAll("img");

        for (let i = 0; i < displayedImgs.length; i++) {
                displayedImgs[i].setAttribute("pressed", false);
        }

        this.setAttribute("pressed",true);

    }
    ////////////////////////////////////////////////////////Note pad functions/////////////////////////////////////////////////////////////////////////
    function downloadNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let divNotepadMenu = this.parentNode;


        let strForDownload = JSON.stringify(resource);
        let encodeData = encodeURIComponent(strForDownload);

        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodeData);
        aDownload.setAttribute("download", resource.rname + ".json");
        aDownload.click();
    }
    function uploadNotepad() {
        let file = window.event.target.files[0];

        let reader = new FileReader();

        reader.addEventListener("load", function () {

            let data = window.event.target.result;
            let resource = JSON.parse(data);

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGcolor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextcolor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textArea = divAppBody.querySelector("textArea");


            spanBold.setAttribute("pressed", !resource.isBold);
            spanItalic.setAttribute("pressed", !resource.isItalic);
            spanUnderline.setAttribute("pressed", !resource.isUnderline);
            inputBGcolor.value = resource.bgcolor;
            inputTextcolor.value = resource.textcolor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.content;


            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGcolor.dispatchEvent(new Event("change"));
            inputTextcolor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));
        });


        reader.readAsText(file);
    }
    function saveNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);


        //let spanSave=divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGcolor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextcolor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgcolor = inputBGcolor.value;
        resource.textcolor = inputTextcolor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();

    }

    function makeNotepadBold() {

        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";

        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";

        }
        else {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }

    }

    function makeNotepadItalic() {
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";

        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        }
        else {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }

    }

    function makeNotepadUnderline() {
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";

        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        }
        else {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }

    }

    function changeNotepadBGcolor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");

        textArea.style.backgroundColor = color;
    }

    function changeNotepadTextcolor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");

        textArea.style.color = color;

    }

    function changeNotepadFontFamily() {
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;

    }

    function changeNotepadFontSize() {
        var fs = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fs + "px";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function addFolderHTML(rname, rid, pid) {

        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        let spanRename = divFolder.querySelector("[action=rename]");
        let spanDelete = divFolder.querySelector("[action=delete]");
        let spanView = divFolder.querySelector("[action=view]");

        spanRename.addEventListener("click", renameFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", viewFolder);


        divContainer.appendChild(divFolder);
    }

    function addTextFileHTML(rname, rid, pid) {

        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true);

        let divName = divTextFile.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        let spanRename = divTextFile.querySelector("[action=rename]");
        let spanDelete = divTextFile.querySelector("[action=delete]");
        let spanView = divTextFile.querySelector("[action=view]");

        spanRename.addEventListener("click", renameTextFile);
        spanDelete.addEventListener("click", deleteTextFile);
        spanView.addEventListener("click", viewTextFile);


        divContainer.appendChild(divTextFile);
    }

    function addAlbumHTML(rname, rid, pid) {
        let divAlbumTemplate = templates.content.querySelector(".album");
        let divAlbum = document.importNode(divAlbumTemplate, true);

        let divName = divAlbum.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divAlbum.setAttribute("rid", rid);
        divAlbum.setAttribute("pid", pid);

        let spanRename = divAlbum.querySelector("[action=rename]");
        let spanDelete = divAlbum.querySelector("[action=delete]");
        let spanView = divAlbum.querySelector("[action=view]");

        spanRename.addEventListener("click", renameAlbum);
        spanDelete.addEventListener("click", deleteAlbum);
        spanView.addEventListener("click", viewAlbum);


        divContainer.appendChild(divAlbum);

    }

    function saveToStorage() {

        let rjson = JSON.stringify(resources);
        localStorage.setItem("data", rjson);

    }

    function loadFromStorage() {

        let rjson = localStorage.getItem("data");
        if (!rjson) {
            return;
        }


        resources = JSON.parse(rjson);

        for (let i = 0; i < resources.length; i++) {

            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder")
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
                else if (resources[i].rtype == "album") {
                    addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }

            if (resources[i].rid > rid) {
                rid = resources[i].rid;
            }
        }



    }

    divContainer.innerHTML = "";
    loadFromStorage();


})();