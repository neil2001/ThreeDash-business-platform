# WCW Business Hub

This project is a business/workflow management application for my startup Windy City Woodwinds, which sells 3D printed woodwind mouthpieces and accessories.

WCW Business Hub has the following features/capabilities:

- Login and Logout
- New Order Creation
- Order Assignment
- Order Archives
- 3D Printer Status monitoring
- Note Keeping

This application was created in order to better keep track of orders and enable our business to operate even when our team is spread across the country for college. Though there are still some capabilities I would like to add, this application is currently able to handle most of the business management necessary for WCW.

# Tech

- React
- Express
- MySQL
- node.js

### Installation

Frontend

```sh
$ cd frontend
$ npm install
$ npm start
```

Backend

```sh
$ cd backend
$ npm install
```

If you do not have MySQL Community Server installed, download MySQL here: https://dev.mysql.com/downloads/mysql/ and start up the server

Then run the following command to create the wcw database with all the tables using your root username and password

```sh
$ mysql wcw -u root -p < wcw.sql
```

If you are not using the default port for MySQL server (3306), please modify index2.js under the "backend" folder to set the MySQL port to your port.

Start Express server

```sh
$ node index.js
```

# Usage

Follow these stepts to demo this application:

1. Enter the following username and password into the login page:

- Username: wcw
- Password: wcw

2. Navigate to the order management page:

3. Click the "Create New Order" button to input a new order:

- Select a Mouthpiece
- Select a Genre
- Select a Tip Opening
- Select a Color
- Write a note if you would like
- Submit

4. Click the "Assign" button next to the order you just created

5. Enter your name in the "Assign To:" form and click assign

6. Click on the "Fulfill" button

7. Click the "Done Button" in the "Retrieve STL" row

8. Go to the Printer Status tab

9. Input the order number of the order you just created, select "Tenor", and click "Start Print"

10. For the sake of demoing, click the end print button

11. Navigate to the Assigned Orders page under the Manage Orders tab, and continue to fulfill the order. Once all the tasks are done, click the "Move to Shipped" button

12. Navigate to the Notes tab and add a note with your Name as the title and the Message as "Just finished order **\_\_**(order number of the order you processed)"

### Thank you for checking out WCW Business Hub!
