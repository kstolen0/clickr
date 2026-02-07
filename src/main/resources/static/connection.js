let url;
let socket;

function setupSocket() {

	url = 'ws://0.0.0.0:8080/click';
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
	const count = Number(event.data);
	console.log(count);
	const el = document.getElementById("count")
	el.innerHTML = count;
}

function sendInc() {
	const command = { command: "inc" }
	socket.send(JSON.stringify(command));
}
