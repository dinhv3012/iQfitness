# Set Up

a. If it is the first time you are working in the project, write the command "npm install" to download all the necessary dependencies to build the project. To use third party modules, use the command "npm install" followed by the package name. For instance "npm install @mui/core

b. To create a new branch, go into the directory of this project, for instance it should say something like "/Documents/GitHub/DH2642-group-project$" in the terminal window. Then write the "git branch" followed by the name of the new branch. For instance "git branch newDesign". 

c. To checkout into a branch, write "git checkout" followed by the branch name. For instance "git checkout newDesign"

d. When you have created a new branch, you have to set the remote as upsteam, use this command "git push --set-upstream origin" followed by the branch name. For instance "git push --set-upstream origin newDesign"

e. When you make any changes, good practice is to use the following commands when commiting and pushing new code. First write the command "git add ." , this will add any new files and code and make it ready to be commited. Next write "git commit -m" followed by the commit message. For instance, " git commit -m "added new css design" ". Lastly, use the command "git push" to push it to the remote. 

f. To be able to work in a branch someone else in the group has created, use the command "git switch" followed by the branch name, for instace "git switch otherBranch"

g. To see all existing branches use the command "git branch -r"

h. When you have worked on your branch and created something you want to merge into "main" branch do the following. Make sure that all the changes have been commited and pushed. Checkout into "main", i.e use "git checkout main". Next, use "git pull" to make sure your local "main" is up to date with the remote. Next use the command "git merge" followed by the name of the branch you wish to merge into "main". For instance, "git merge newDesign". Be aware that there might be some merge conflict, in such a case you will see it in the explorer on the left window of visual studio code. In the files where there are merge conflicts, there will be an exclamation mark next to the file name. In the file you will see that for each conflict, you will have the option of either keeping the part of the code that already existed in the "main" branch, or to change it into the code that is coming from the "newDesign" branch. Make sure to pick the right codes. When all conflicts in all files are changed, follow the steps in point e.

i. When you have merged a branch to "main" and no longer have any use for the branch, you can delete the branch by writing the following commands:
1. "git branch -d" followed by the branch name, for instance "git branch -d newDesign"
2. "git push origin --delete" followed by the branch name, for instance "git push origin --delete newDesign"

j. To build the project use the command "npm start". Make sure you have changed into the iqFitness directory to run the command and that you have installed all the dependencies according to point a. 
