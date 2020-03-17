var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "emp_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "addViewUpdate",
      type: "list",
      message: "What would you like yo do?",
      choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Role"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.addViewUpdate === "Add Department") {
        addDep();
      }
      else if(answer.addViewUpdate === "Add Role") {
        addRole();
      }
      else if(answer.addViewUpdate === "Add Employee") {
        addEmp();
      }
      else if(answer.addViewUpdate === "View Departments") {
        viewDep();
      }
      else if(answer.addViewUpdate === "View Roles") {
        viewRole();
      } 
      else if(answer.addViewUpdate === "View Employees") {
        viewEmp();
      }
      else if(answer.addViewUpdate === "Update Employee Role") {
        updateEmpRole();
      }
      else{
        connection.end();
      }
    });
}

// function to handle posting new items up for auction
function addDep() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department name?"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        function(err) {
          if (err) throw err;
          console.log("Department added successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function addRole() {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role title?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the role salary?"
        },
        {
          name: "dep",
          type: "input",
          message: "What is the role department id?"
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.dep,
          },
          function(err) {
            if (err) throw err;
            console.log("Role added successfully!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      });
  }

  function addEmp() {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is your first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is your last name?"
          },
          {
            name: "role",
            type: "input",
            message: "What is your role ID?"
          },
          {
            name: "manager",
            type: "input",
            message: "What is your manager ID?"
          },
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role,
            manager_id: answer.manager
          },
          function(err) {
            if (err) throw err;
            console.log("Employee added successfully!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      });
  }

  function viewRole() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
  }

  function viewEmp() {
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
  }
  function viewDep() {
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
  }
  
  
function updateEmpRole() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].first_name);
            }
            return choiceArray;
          },
          message: "Which employee do you want to update?"
        },
        {
          name: "roleID",
          type: "input",
          message: "what is the new Role ID?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].first_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.roleID
              },
              {
                first_name: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Employee role updated successfully!");
              start();
            }
          );
        });
      });
}
