# Open311 Analytics Proxy Server

![Mou icon](http://codeforamerica.org/wp-content/themes/cfawp2012/images/logo.png)

#### What is the meaning of this?

Open311 Analytics is powered by a MongoHQ MongoDB. As such, there is a RESTful API provided by MongoHQ that allows for a more expressive means of querying Open311 data as compared to using a raw Open311 endpoint. This is because Open311 as a specification is focused more on request input by citizens and less on data reading and analysis.

This proxy server is used to insulate the MongoHQ instance (and private account information) from users of the service.

**This project is in beta and may change significantly in the future!**

#### Setup and Deployment

The proxy server is easy to run locally and deploy to Heroku. You will need to have node and npm installed on your machine before continuing however. For Heroku, you will need to have a Heroku account - this app can run in the free tier.

##### Running locally

Clone the project:

	$ git clone git@github.com:codeforamerica/mongoprox.git 

Go to the proxy directory and install the dependancies:

	$ cd mongoprox 
    $ npm install

Run the application like this:

	APIkey=your_mongohq_api_key node proxy.js
	
**Note:** You can also set the APIkey environment variable by exporting it or, if you are using foreman, you can create a .env file.

##### Deploy to Heroku

Create a Heroku app and repo:

	$ heroku create [app-name] --stack cedar

Set the APIkey environment variable on the Heroku app instance:

    $ heroku config:add APIkey=your_mongohq_api_key

Push to the heroku repo and spin up the web worker:

	$ git push heroku master
    $ heroku ps:scale web=1

You should now be able run queries against your MongoHQ database using the REST API.

#### Usage

Whether running locally or on heroku, you pass [MongoHQ API](http://support.mongohq.com/api) queries (you can use the other features like sort, too) like normal except you append the call parameters to your local or Heroku host and DO NOT include the apikey param. 

For example:

##### On Heroku:     
    http://mongoprox.herokuapp.com/databases/chicago/collections/requests/documents?limit=1

##### Localhost:     
    http://localhost:3000/databases/chicago/collections/requests/documents?limit=1
