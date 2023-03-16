var mqtt_username = "xxx"
var mqtt_password = "xxx"
var mqtt_baseTopic = "basetopic"
var mqtt_broker = "ws://mqtt.local:8084"  // port 8083 for wss

const deviceList = []

var logBox = document.getElementById("logger")

function addDevice(deviceName) {
  for (let i = 0; i < deviceList.length; i++) {
    logBox.innerText += "duplicate, skipping " + deviceName + "\n";
    if (deviceList[i] == deviceName) {
      return
    }
  }
  var select = document.getElementById("deviceList")
  var option = document.createElement("option")
  deviceList.push(deviceName)
  option.text = option.value = deviceName
  select.add(option)
}

const client = mqtt.connect(mqtt_broker, {keepalive: 60,
                                          clientId: "MQTTUpdater",
                                          clean: true,
                                          //username: mqtt_username,
                                          //password: mqtt_password,
                                          connectTimeout: 10000,
                                          reconnectPeriod: 30000
                                         })
logBox.innerText += "starting...\n"

client.on('connect', function (connack) {
  logBox.innerText += "connected\n"
  client.subscribe(mqtt_baseTopic + "/+/$system/status", {qos: 2}, function (err, granted) {
    logBox.innterText += "subscribed to status topic\n"
  })
})
client.on('error', function(error) {
  if (error !== 0) {
    logBox.innerText += "connection lost: "+responseObject.errorMessage+"\n"
  }
})
client.on('message', function (topic, message, packet) {
  //if (message != "online") return
  var deviceName = topic.split("/")[1]
  logBox.innerText += "new device detected: " + deviceName + "\n"
  addDevice(deviceName)
})

document.getElementById("uploadBtn").addEventListener("click", function() {
  var e = document.getElementById("deviceList")
  var deviceName = e.options[e.selectedIndex].value
  if (deviceName == "none") {
    alert("Select a device")
    return
  }
  var firmwareFile = document.getElementById("firmwareInput").files[0]
  if (firmwareFile === undefined) {
    alert("Select a file")
    return
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    var uint8View = new Uint8Array(e.target.result);
    const buf = mybuffer.Buffer.from(uint8View)
    client.publish(mqtt_baseTopic + "/" + deviceName + "/$system/update", buf, {qos: 2}, function() {
      logBox.innerText += "firmware sent\n"
    })
  };
  reader.onerror = function(e) {
    logBox.innerText += 'Error : ' + e.type + "\n";
  };
  console.log(firmwareFile)
  reader.readAsArrayBuffer(firmwareFile);
})
