rem This script updates a fork of the project
rem do not use on the original project as it may cause undefined behaviour
rem un comment the command bellow if you are running the script for the first time
rem git remote add upstream https://github.com/B00M3000/Mindustry-Schematics.git
git fetch upstream
git checkout master
git merge upstream/master