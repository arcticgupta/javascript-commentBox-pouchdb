
var db = new PouchDB('commentBox');

function saveCase(){
    var data = {
        _id: new Date().toISOString(),
        data: document.getElementById("commentArea").innerHTML,
    };
    db.put(data, function callback(err, result) {
        if (!err) {
            console.log('Successfully posted Data');
        }
    });
}

function showCase() {
    db.info().then(function (result) {
        if(result.doc_count === 0) {
            saveCase();
            console.log("Database Initialized");
        }
        else{
            db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                document.getElementById("commentArea").innerHTML=doc.rows[0].doc.data;
            });
        }
    });
}

function getTime(){
    var today= new Date();
    if (today.getMinutes()<10) {
        return today.getHours() + ":0" + today.getMinutes();
    }
    else {
        return today.getHours() + ":" + today.getMinutes()
    }

}

function addComment(){
    if (checkLogin()){
        var commentArea=document.getElementById("commentArea");
        var commentNumber= commentArea.childNodes.length-5;
        var handle= document.getElementById("userName").innerText;
        var commentText= document.getElementById("commentText").value;
        commentArea.innerHTML+=`<div id="${commentNumber}-comment" class="comment-thread">\n` +
            `\t\t\t<div id="${commentNumber}-handle" style="display:inline-block" class="comment-handle">${handle}</div>\n` +
            `\t\t\t<div id="${commentNumber}-time" style="display:inline-block" class="comment-time">${getTime()}</div>\n` +
            `\t\t\t<div id="${commentNumber}-text" class="comment-text">${commentText}</div>\n` +
            `\t\t\t<div id="${commentNumber}-replyInput" style="display:none">\n` +
            `\t\t\t\t<textarea rows="1" id="${commentNumber}-commentText" class="comment-box" placeholder="Reply..."></textarea>\n` +
            `\t\t\t\t<div>\n` +
            `\t\t\t\t\t<button onclick="replyOk('${commentNumber}')" class="add-btn">OK</button>\n` +
            `\t\t\t\t\t<button onclick="replyCancel('${commentNumber}')" class="add-btn">Cancel</button>\n` +
            `\t\t\t\t</div>\n` +
            `\t\t\t</div>`+
            `\t\t\t<div id="${commentNumber}-editInput" style="display:none">\n` +
            `\t\t\t\t<textarea rows="1" id="${commentNumber}-commentTextEdit" class="comment-box" placeholder="Edit..."></textarea>\n` +
            `\t\t\t\t<div>\n` +
            `\t\t\t\t\t<button onclick="editOk('${commentNumber}')" class="add-btn">OK</button>\n` +
            `\t\t\t\t\t<button onclick="editCancel('${commentNumber}')" class="add-btn">Cancel</button>\n` +
            `\t\t\t\t</div>\n` +
            `\t\t\t</div>`+
            `\t\t\t<button id="${commentNumber}-edit" onclick="edit('${commentNumber}')" class="add-btn">Edit</button>\n` +
            `\t\t\t<button id="${commentNumber}-reply" onclick="reply('${commentNumber}')" class="add-btn">Reply</button>\n` +
            `\t\t</div>`
        saveCase()
    }
    else window.alert("Set username first.")
}
function reply(parentId){
    if (checkLogin()) {
        document.getElementById(parentId + "-replyInput").style.display = "block";
        document.getElementById(parentId + "-edit").style.display = "none";
        document.getElementById(parentId + "-reply").style.display = "none"
    }
    else window.alert("Set username first.")
}

function replyOk(parentId){
    var parentComment= document.getElementById(parentId+"-comment");
    var commentNumber=parentId+"."+ (parentComment.childNodes.length-14);
    var handle= document.getElementById("userName").innerText;
    var parentMargin=commentArea.style.marginLeft;
    var commentText= document.getElementById(parentId+"-commentText").value;
    parentComment.innerHTML+=`<div id="${commentNumber}-comment" style="margin-left:${parentMargin+2}em;margin-bottom:${parentMargin+2}em" class="comment-thread">\n` +
        `\t\t\t<div id="${commentNumber}-handle" style="display:inline-block" class="comment-handle">${handle}</div>\n` +
        `\t\t\t<div id="${commentNumber}-time" style="display:inline-block" class="comment-time">${getTime()}</div>\n` +
        `\t\t\t<div id="${commentNumber}-text" class="comment-text">${commentText}</div>\n` +
        `\t\t\t<div id="${commentNumber}-replyInput" style="display:none">\n` +
        `\t\t\t\t<textarea rows="1" id="${commentNumber}-commentText" class="comment-box" placeholder="Enter..."></textarea>\n` +
        `\t\t\t\t<div>\n` +
        `\t\t\t\t\t<button onclick="replyOk('${commentNumber}')" class="add-btn">OK</button>\n` +
        `\t\t\t\t\t<button onclick="replyCancel('${commentNumber}')" class="add-btn">Cancel</button>\n` +
        `\t\t\t\t</div>\n` +
        `\t\t\t</div>`+
        `\t\t\t<div id="${commentNumber}-editInput" style="display:none">\n` +
        `\t\t\t\t<textarea rows="1" id="${commentNumber}-commentTextEdit" class="comment-box" placeholder="Edit..."></textarea>\n` +
        `\t\t\t\t<div>\n` +
        `\t\t\t\t\t<button onclick="editOk('${commentNumber}')" class="add-btn">OK</button>\n` +
        `\t\t\t\t\t<button onclick="editCancel('${commentNumber}')" class="add-btn">Cancel</button>\n` +
        `\t\t\t\t</div>\n` +
        `\t\t\t</div>`+
        `\t\t\t<button id="${commentNumber}-edit" onclick="edit('${commentNumber}')" class="add-btn">Edit</button>\n` +
        `\t\t\t<button id="${commentNumber}-reply" onclick="reply('${commentNumber}')" class="add-btn">Reply</button>\n` +
        `\t\t</div>`;
    document.getElementById(parentId+"-replyInput").style.display="none";
    document.getElementById(parentId+"-edit").style.display="inline-block";
    document.getElementById(parentId+"-reply").style.display="inline-block";
    saveCase();
}

function replyCancel(parentId){
    document.getElementById(parentId+"-replyInput").style.display="none";
    document.getElementById(parentId+"-edit").style.display="inline-block";
    document.getElementById(parentId+"-reply").style.display="inline-block";
    saveCase();

}

function edit(parentId){
    if (checkLogin()) {
        if (document.getElementById(parentId + "-handle").innerText === document.getElementById("userName").innerText) {
            document.getElementById(parentId + "-editInput").style.display = "block";
            document.getElementById(parentId + "-edit").style.display = "none";
            document.getElementById(parentId + "-reply").style.display = "none"
        } else {
            window.alert("You can only edit your own comments.")
        }
    }
    else window.alert("Set username first.")
}

function editOk(parentId){
    document.getElementById(parentId+"-text").innerText=document.getElementById(parentId+"-commentTextEdit").value;
    document.getElementById(parentId+"-editInput").style.display="none";
    document.getElementById(parentId+"-edit").style.display="inline-block";
    document.getElementById(parentId+"-reply").style.display="inline-block";
    saveCase();

}

function editCancel(parentId){
    document.getElementById(parentId+"-editInput").style.display="none";
    document.getElementById(parentId+"-edit").style.display="inline-block";
    document.getElementById(parentId+"-reply").style.display="inline-block";
    saveCase();
}

function checkLogin(){
    if (document.getElementById("userName").innerText==="UNKNOWN") return 0;
    else return 1
}

function toggleSet(){
    var setButton=document.getElementById("setName");
    var changeButton=document.getElementById("changeName");
    var name=document.getElementById("name");
    var userName=document.getElementById("userName");
    if (!name.value) window.alert("Please Enter a Username");
    else{
        if (setButton.style.display==="inline-block"){
            userName.innerText=name.value;
            name.style.display="none";
            setButton.style.display="none";
            changeButton.style.display="inline-block";
        }
        else{
            userName.innerText="UNKNOWN";
            name.style.display="inline-block";
            setButton.style.display="inline-block";
            changeButton.style.display="none";
        }

    }
}
