let url;
let socket;
let prevCount = undefined;
let currentCount = undefined;
let target = undefined;

const colors = {
	"#F2EFEA": "#DBD56E",
	"#FC7753": "#F2EFEA",
	"#66D7D1": "#FC7753",
	"#403D58": "#66D7D1",
	"#DBD56E": "#403D58",
};

function setupSocket() {

	url = `ws://${window.location.host}/click`;
	if (window.location.protocol === "https:") {
		url = `wss://${window.location.host}/click`;
	}
	socket = new WebSocket(url);

	socket.onopen = openConnection;
	socket.onclose = closeConnection;
	socket.onmessage = updateCount;
}

function openConnection() {
	console.log("connection opened");
}

function closeConnection(event) {
	console.log(event);
}

function updateCount(event) {
	const res = JSON.parse(event.data)
	let count = Number(res.count);
	target = Number(res.target);
	const style = Number(res.style);
	const progress = (count / target * 100).toFixed(2);
	const c1 = Object.keys(colors)[style];
	const c2 = colors[c1];
	const c3 = colors[c2];

	setCount(count, c3);
	setTarget(target, c3);
	setProgress(progress, c1);
	document.getElementById("html").style.background = c2;
}



function setCount(value, color) {
	if (prevCount == undefined) {
		prevCount = value
		currentCount = value
	} else {
		prevCount = currentCount
		currentCount = value
	}
	const count = document.getElementById("count");
	count.innerHTML = value;
	count.style.color = color;
}

function setTarget(value, color) {
	const target = document.getElementById("target");
	target.innerHTML = value;
	target.style.color = color;
}

function setProgress(value, color) {
	const progress = document.getElementById("progress");
	progress.style.top = `${100 - value}vh`;
	progress.style.background = color;
	if (currentCount === 0) {
		progress.remove()
		const newProgress = document.createElement('div')
		newProgress.id = 'progress'
		newProgress.className = 'progress ease'
		newProgress.style.background = color;
		document.body.append(newProgress)
	} else if (currentCount < prevCount) {
		requestAnimationFrame(() => {
			progress.classList.remove('ease');
			progress.classList.add('fall');
		})
	} else {
		progress.classList.add('ease');
		progress.classList.remove('fall');

	}
}

function sendInc() {
	const command = { command: "inc" };
	socket.send(JSON.stringify(command));
	const el = document.getElementById("count");
	el.blur();
}
