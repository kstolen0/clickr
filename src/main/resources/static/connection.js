let url;
let socket;

function setupSocket() {

	url = `ws://${window.location.host}/click`;
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
	const total = Number(res.total);
	const el = document.getElementById("count");
	el.innerHTML = count;

const totalEl = document.getElementById("total");
totalEl.innerHTML = total;
}

function sendInc() {
	const command = { command: "inc" };
	socket.send(JSON.stringify(command));
	const el = document.getElementById("count");
	el.blur();
}
