function GetString(obj) {
    var str = 'angle:' + String(obj.angle) + ',';
    return str;
}

function ChangeForm(form, url) {

  function change_controls(message) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send(message);
  }

  form.onsubmit = function() {
    var message = {};
    message.angle = angle
    change_controls(GetString(message));
    return false;
  };
}


function UserControl(elem, url) {

  function subscribe() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;

      if (this.status == 200) {
        subscribe();
        return;
      }

      setTimeout(subscribe, 1000);
    }
    xhr.open("GET", url, true);
    xhr.send();
  }

  subscribe();

}

var k = 2, angle = 45;

function plus_do() {
	angle = (angle + 15) % 180;
	update(angle);
}

function minus_do() {
	angle = (angle - 15) % 180;
	update(angle);

}

var leftPlot = new Plotter("leftplot", {
    left: -5,
	right: 5,
	top: 5,
	bottom: -5,
	width: 450,
	height: 450
});

var line = leftPlot.addFunc(function(x){
	return x;
});


var btn1 = document.getElementById('drawbutton');
btn1.addEventListener('click', minus_do);

var btn2 = document.getElementById('drawbutton2');
btn2.addEventListener('click', plus_do);

function update(angle) {
	leftPlot.remove(line);
	k = Math.tan(angle * Math.PI / 180);
	line = leftPlot.addFunc(function(x){ return k * x; });
}
