var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const dotenv = require('dotenv')
const result = dotenv.config()

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: process.env.DB_PORT,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: process.env.DB
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

function addDep() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department name?"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        function(err) {
          if (err) throw err;
          console.log("Department added successfully!");
          start();
        }
      );
    });
}

function addRole() {
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
            start();
          }
        );
      });
  }

  function addEmp() {
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
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
  }
  
  
function updateEmpRole() {
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
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
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].first_name === answer.choice) {
            chosenItem = results[i];
          }
        }

          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.roleID
              },
              {
                first_name: chosenItem.first_name
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
