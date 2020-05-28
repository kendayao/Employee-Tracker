var mysql = require("mysql");
var inquirer=require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  
});

startapp();


function startapp(){
  console.log("WELCOME TO THE EMPLOYEE MANAGER APPLICATION")
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["View all employees", "View all employees by department", "View all employees by roles", "Add employee", "Add department", "Add role", "Update employee role"]
    }
  ]).then(function(answer){
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all employees by department":
          multiSearch();
          break;

        case "View all employees by roles":
          rangeSearch();
          break;

        case "Add employee":
          songSearch();
          break;
        
        case "Add department":
          songSearch();
          break;

        case "Add role":
          songSearch();
          break;

        case "Update employee role":
          songSearch();
          break;

        case "exit":
          connection.end();
          break;
        }
    });
}





function viewAllEmployees(){
    const query="SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM role INNER JOIN employee ON role.id=employee.role_id INNER JOIN department ON  role.department_id=department.id"
    connection.query(query, function(err,res){
      if (err) throw err;
        console.table(res)
    })
}

function viewDepartment(){
  const query=
}