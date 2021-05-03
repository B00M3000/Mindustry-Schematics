# How to setup a server.

The easiest way to play multiplayer is to set up a LAN game and have your friends join that. However, to do that you need to both be connected to the same wifi, so this only works for people you know in real life. The second easiest way is to use steam multiplayer, but that requires the steam version, which isn't free. In this guide, I will be showing you the hard way to set up multiplayer, but the way that lets you play with anyone in the world without paying. And it even works on mobile!

### Step 1: Set up a static IP for your device

The steps for this are different depending on whether you're on mobile or PC. You're best off googling how to do it on your device. In general, you can find it in network or connection settings. This step might be covered by the port forwarding guide (see next step).

### Step 2: Set up port forwarding

The exact specifics are different for each router, but in general you have to type a certain number into your address bar in your browser, then log in with the router admin username and password, and finally add a port forwarding rule. Look on the back of your router to find the model, then google "port forwarding [router model]". You want to forward private port 6567 with TCP and UDP. The public port you use doesn't matter, as long as you remember it, but you should probably use 6567.

### Step 3: Google your IP

Simply type "what is my IP" into google. You're looking for 4 numbers between 0 and 256, separated by periods (full stops if you're British). If you get any letters, that's IPv6, you want IPv4. Copy those numbers (complete with the dots), then add a colon (:) to the end, and then the public port from step 2. You should get something like "682.420.69.173:1273", if you chose port 1273. If your number starts with "192.168", "172.16", "10.", or "100.64"-"100.127", you have the wrong IP. This is not the same as your private IP from step 2.

### Step 4: Host, and have people join

That's pretty much it. From here there are 2 ways to host. The first is to download server.jar from itch.io or github, and run it. This only works on PC, not on mobile (well, not without a whole other guide and a half). The advantage to this method is that you don't have to be playing in order to host. The second method is to simply host a normal LAN game. This works on mobile as well as PC, but as soon as you save and quit everyone will be disconnected.
Once you're hosting, anyone in the world can join by typing the IP you got in step 3 in place of a server address. If you close the server window or exit the game, you'll stop hosting, and they'll be disconnected, so try not to do that.

That should be it, if there's anything I forgot or anything you need help with, feel free to ask. If this post is archived, you can ask on the mindustry discord.
