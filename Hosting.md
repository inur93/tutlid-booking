

## Initial setup with Docker and Caprover ##
after logging in to the server run:
```powershell
apt update 
apt install docker.io
mkdir /captain && docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock caprover/caprover
```

Visit myip:3000 to start the setup and use the default password captain42
remember to change the password

Set the domain to caprover.vormadal.com
Set the A record in dns to *.caprover.vormadal.com and point to the ip of the server



## Setup ##

login on [hetzner.com](https://accounts.hetzner.com/login) 
login to [caprover](https://captain.caprover.vormadal.com/#/login)

root
password = JEXpVwsFsJeRx4aaHaVi

run:
docker run -d -p 25565:25565 
-v /mnt/minecraft/World:/data/world 
-v /mnt/minecraft/Server/World/server.properties:/data/server.properties 
-e EULA=true --name mc itzg/minecraft-server

update minecraft
docker pull itzg/minecraft-server



## SSH key ###

1. Download and install [Puttygen](https://www.puttygen.com/download-putty)
2. Run the PuTTYgen application
3. Select the `SSH-2 RSA` Key type
4. Click on generate and move the mouse around until the loader is complete.
5. Copy the public key and register it on Hetzner
6. Save the private key (and store the password in KeyPass)
7. Under `Conversion` select `Export OpenSSH key` and save the file as `~/.ssh/id_rsa` this will automatically make the ssh client to use the certificate.
8. Now you can connect to the server by running 
```powershell
ssh root@<ip>
```
9. enter the password for the private key

### Deployment ###

1. install caprover-cli
```bash
yarn global add caprover
```
2. Enable App Token under deployment in the caprover app dashboard
3. 35e146e433c3384b1792fc82521661fd48ff6a069fde78f525add17d24335c5b
4. Set the path of the captain-definition file in caprover app dashboard deployment tab at the bottom
4. caprover deploy -h https://captain.caprover.vormadal.com -b master -c ./captain-definition-frontend --appToken 35e146e433c3384b1792fc82521661fd48ff6a069fde78f525add17d24335c5b -a vormadal-docs