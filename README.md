# plant-store
Online Plant Store

Installation guide:



1) Make sure you have the latest version of Node.js 
installed, and make sure it's on your path. 
A version of Node.js >= 20.11.0 should be enough.


2) Go to the backend subfolder and run 

"npm i"
or
"npm.cmd i"


3) Go to the frontend subfolder and run 

"npm i"
or
"npm.cmd i"


4) Make sure you have MongoDB installed,
e.g. "MongoDB Community Server version 7.0.12"
or a later version.
By default the connection string will be 
something like this
"mongodb://localhost:27017"


5) Make sure you have the MongoShell installed (mongosh)


6) Make sure MongoDB Compass is installed,
this is the MongoDB UI client.


7) From MongoDB Compass create a database
named "Store" (capitalized), and also create two 
collections in it (named "accounts" and "offers").


8) Import the contents of these two collections
from the files "Store.accounts.json" and 
"Store.offers.json" which are available in the root
folder of this Git repo.


9) Stop the MongoDB service in your task manager
under the Service tab


10) Go to the bin folder of the directory in which
you installed MongoDB e.g 	
"C:\Program Files\MongoDB\Server\7.0\bin"


11) Open "mongod.cfg" and copy its content


12) Delete "mongod.cfg" and create a new file with the same name


13) Paste the previous "mongod.cfg" contents in the new "mongod.cfg"


14) In the newly created file replace "#replication" with 
"
replication:
  replSetName: rs0
"

15) Start the MongoDB Service


16) Open a CMD and type "mongosh mongodb://your_connection_string/Store"
e.g. "mongosh mongodb://localhost:27017/Store" 


17) Run "rs.initiate()"


18) Go to the backend subfolder and run 
"npm start"


19) Go to the frontend subfolder and run 
"npm start"


20) The project should be now successfully setup and found running on the port that's displayed after doing the last step; 


To login as an admin: username: 'Metodi', password: 'm'