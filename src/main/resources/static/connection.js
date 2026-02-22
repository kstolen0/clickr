let url;
let socket;

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
	const count = Number(res.count);
	const target = Number(res.target);
	const style = Number(res.style);
	const progressBg = Object.keys(colors)[style];
	const pageBg = colors[progressBg];

	console.log(` ${style} ${progressBg} ${pageBg}`)
	const pc = Math.ceil(count / target * 100);

	const el = document.getElementById("count");
	el.innerHTML = count;
	const targetEl = document.getElementById("target");
	targetEl.innerHTML = target;

	const progressEl = document.getElementById("progress");
	progressEl.style.top = `${100 - pc}vh`;
	progressEl.style.background = progressBg;
	document.getElementById("html").style.background = pageBg;


}

function sendInc() {
	const command = { command: "inc" };
	socket.send(JSON.stringify(command));
	const el = document.getElementById("count");
	el.blur();
}
