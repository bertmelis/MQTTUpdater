# MQTTUpdater

Web interface to update devices over MQTT

I don't know anything about javascript. This code is not clean and has bugs.
But I just run this locally, on my computer and if it stops working I just reload and it works again.

Devices must be subscribed to `mqtt_baseTopic/deviceName/$system/update` to receive updates.
They also should announce their presence on `mqtt_baseTopic/deviceName/$system/status`.

Enjoy.
