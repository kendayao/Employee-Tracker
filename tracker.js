// required packages
const mysql = require("mysql");
const inquirer=require("inquirer");
const cTable = require('console.table');

// mysql connection setup
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

// function to start the app
startapp();

// function that renders what user wants to do
function startapp(){
  console.log("EMPLOYEE TRACKER APPLICATION")
  inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "What would you like to do?",
      choices: ["View all employees", "View all employees by department", "View all employees by roles", "View all employees by manager", "View all departments", "View all roles", "Add manager", "Add employee", "Add department", "Add role", "Update employee manager", "Update employee role", "Exit"]
    }
  ]).then(function(answer){
    
    // runs function based on user selection
      switch (answer.selection) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all employees by department":
          getDepartment();
          break;

        case "View all employees by roles":
          getRoles();
          break;
        
        case "View all employees by manager":
          getManagers();
          break;

        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;


        case "Add manager":
          getEmployeesForManagers();
          break;

        case "Add employee":
          getNewEmployeesManagers();
          break;
        
        case "Add department":
          addDepartment();
          break;

        case "Add role":
          getNewRole();
          break;
        
        case "Update employee manager":
          getManagersForUpdateManager()
          break;

        case "Update employee role":
          getEmployees();
          break;

        case "Exit":
          connection.end();
          break;
        }
    });
}

// function to view all departments
function viewAllDepartments(){
  console.log("List of All Company Departments")
  connection.query("SELECT * FROM department", function(err,res){
    if (err) throw err;
        console.table(res)
          startapp();
    });
}

// function to view all roles
function viewAllRoles(){
  console.log("List of All Company Roles")
  connection.query("SELECT * FROM role", function(err,res){
    if (err) throw err;
        console.table(res)
          startapp();
    });
}

// function to view all employees
function viewAllEmployees(){
  console.log("List Of All Company Employees")
    const query="SELECT employee.id, employee.first_name, employee.last_name, role.role_title, department.department_name, role.salary FROM role INNER JOIN employee ON role.id=employee.role_id INNER JOIN department ON role.department_id=department.id"
      connection.query(query, function(err,res){
        if (err) throw err;
          console.table(res)
          startapp();
      });
}

// get all of the current departments and put them in an array to be used for inquirer prompt
var dept =[];
function getDepartment(){
  connection.query("SELECT department_name FROM department", function(error, response){
    for (var i=0; i < response.length; i++){
        dept.push(response[i].department_name);
      }
      viewDepartment();
    });
  
}

// function to view employees by department
function viewDepartment(){
    inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: "Choose the department",
        choices: dept
      }
    ]).then(function(answer){
      console.log("The " +answer.department + " Department")
        const query="SELECT employee.id, employee.first_name, employee.last_name, role.role_title, department.department_name, role.salary FROM role INNER JOIN employee ON role.id=employee.role_id INNER JOIN department ON role.department_id=department.id WHERE ?"
          connection.query(query, {department_name: answer.department},function(err,res){
            if (err) throw err;           
            console.table(res)
              startapp();
            });
        });
}

// get all of the current roles and put them in an array to be used for inquirer prompt to view employees based on roles
var roles =[];
function getRoles(){
  connection.query("SELECT role_title FROM role", function(error, response){
    for (var i=0; i < response.length; i++){
        roles.push(response[i].role_title);
      }
      viewRoles();
    });
  
}

//function to view employees based on roles
function viewRoles(){
  inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "Choose the role",
      choices: roles
    }
  ]).then(function(answer){
    console.log("List of "+answer.role+"s")
      const query="SELECT employee.id, employee.first_name, employee.last_name, role.role_title, department.department_name, role.salary FROM role INNER JOIN employee ON role.id=role_id INNER JOIN department ON role.department_id=department.id WHERE?"
        connection.query(query, {role_title: answer.role}, function(err,res){
          if(err) throw err;
          console.table(res)
          startapp();
        });
    })
}

// get all of the current managers and put them in an array to be used for inquirer prompt to view employees based on managers
var managers =[];
function getManagers(){
  connection.query("SELECT manager_name FROM manager", function(error, response){
    for (var i=0; i < response.length; i++){
        managers.push(response[i].manager_name);
      }
      viewManagers();
    });
}

//function to view employees based on managers
function viewManagers(){
  inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Choose the manager",
      choices: managers
    }
  ]).then(function(answer){
    console.log("List of Employees Managed by " + answer.manager)
    let query="SELECT employee.id, employee.first_name, employee.last_name, role_title, manager_name FROM employee INNER JOIN manager ON employee.manager_id=manager.id INNER JOIN role ON role.id=role_id WHERE manager_name=?"
    connection.query(query, [answer.manager], function(err,res){
      if(err) throw err;
          console.table(res)
          startapp();
    });
    });
}

//get all current employees and put them on an array to be used for inquirer prompt to add a new manager
var employeesForManagersArry=[];
function getEmployeesForManagers(){
  connection.query("SELECT first_name, last_name FROM employee", function(err, response){
    for (var i=0; i < response.length; i++){
        var firstName=response[i].first_name;
        var lastName=response[i].last_name;
        var fullName=firstName + " "+ lastName;
        employeesForManagersArry.push(fullName);
      }
    addManager();
  });
}

//function to add a new manager
function addManager(){
  inquirer.prompt([
    {
      type: "list",
      name: "name",
      message: "What is the name of the new manager",
      choices: employeesForManagersArry
    }
  ]).then(function(answer){
    let query="INSERT INTO manager (manager_name) VALUES (?)"
    connection.query(query, [answer.name], function(err, data){
      if (err) throw err;
      console.log("New Manager Successfully Added!")
        startapp();
    });
  });
}

//get all current managers and put them in array to be used for inquirer prompt to add new employee
var newemployeemanagersArry=[]
function getNewEmployeesManagers(){
  connection.query("SELECT manager_name FROM manager", function(err, response){
    for (var i=0; i < response.length; i++){
      newemployeemanagersArry.push(response[i].manager_name);
    }
    newemployeemanagersArry.push("None")
    getNewEmployeeRoles()
  });
}

//get all current roles and put them in array to be used for inquirer prompt to add new employee
var newemployeerolesArry =[];
function getNewEmployeeRoles(){
  connection.query("SELECT role_title FROM role", function(error, response){
    for (var i=0; i < response.length; i++){
        newemployeerolesArry.push(response[i].role_title);
      }
      addEmployee();
    });
  
}

// function to add new employee
function addEmployee(){
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: newemployeerolesArry
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employees manager?",
      choices: newemployeemanagersArry
    }

  ]).then(function(answer){
      // get role id based on role chosen
      connection.query("SELECT id FROM role WHERE ?", {role_title: answer.role}, function(err, data){
        if(err) throw err;
        var roleId= data[0].id

        if (answer.manager==="None"){
          managerId=null
          const query= "INSERT INTO employee SET ?"
          connection.query(query,[{first_name: answer.firstName, last_name: answer.lastName, role_id: roleId, manager_id: managerId}], function(err,data){
            if (err) throw err;
            console.log("New Employee Successfully Added!")
            startapp();
          });
        }else{
          connection.query("SELECT id FROM manager WHERE ?", {manager_name: answer.manager}, function(err, data){
            if(err) throw err;
            var managerId= data[0].id
              const query= "INSERT INTO employee SET ?"
              connection.query(query,[{first_name: answer.firstName, last_name: answer.lastName, role_id: roleId, manager_id: managerId}], function(err,data){
                if (err) throw err;
                console.log("New Employee Successfully Added!")
                startapp();
              });
            });
          }
        });
    });
}

//function to add new department
function addDepartment(){
  inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of the new department?"
    }
  ]).then(function(answer){
      let query="INSERT INTO department (department_name) VALUES (?)"
        connection.query(query, [answer.department], function(err, data){
          if (err) throw err;
          console.log("New Department Sucessfully Added!")
          startapp();
      });
    });
}

//get all current department and put them in an array to be used in inquier prompt to add a new role
var getDeptRoleArry =[];
function getNewRole(){
  connection.query("SELECT department_name FROM department", function(error, response){
    for (var i=0; i < response.length; i++){
        getDeptRoleArry.push(response[i].department_name);
      }
      addRole();
    });
  
}

//function to add a new role
function addRole(){
  inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "What is the name of the new role?"
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the new role?"
    },
    {
      type: "list",
      name: "department",
      message: "What department is the new role under?",
      choices: getDeptRoleArry
    }
  ]).then(function(answer){
      let query = "SELECT id FROM department WHERE department_name = ?"
      connection.query(query, [answer.department], function(err, data){
        if(err) throw error
          const departmentId=data[0].id


          connection.query("INSERT INTO role (role_title, salary, department_id) VALUES(?, ?, ?)", [answer.role, answer.salary, departmentId], function(err, data){
            if (err) throw err;
            console.log("New Role Successfully Added!")
            startapp();
          })
      });
    });
}


//get all current managers and push them in an array to be used in inquirer prompt to update employee manager
var managersupdatemanagerArry=[]
function getManagersForUpdateManager(){
  connection.query("SELECT manager_name FROM manager", function(err, response){
    for (var i=0; i < response.length; i++){
      managersupdatemanagerArry.push(response[i].manager_name);
    }
    getEmployeesForUpdateManager()
  });
}

//get all current employees in and push them in an array to be used in inquirer prompt to update employee manager
var employeesupdatemanagerArry=[]
function getEmployeesForUpdateManager(){
  connection.query("SELECT first_name, last_name FROM employee", function(err, response){
    for (var i=0; i < response.length; i++){
      var firstName=response[i].first_name;
        var lastName=response[i].last_name;
        var fullName=firstName + " "+ lastName;
        employeesupdatemanagerArry.push(fullName)
    }
    updateEmployeeManager()
  });
}

//function to update employee manager
function updateEmployeeManager(){
  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Name of employee you would like to update their manager?",
      choices: employeesupdatemanagerArry
    },
    {
      type: "list",
      name: "manager",
      message: "Who is their new manager?",
      choices: managersupdatemanagerArry
    },
  ]).then(function(answer){
    var name =answer.employee
    var nameArry= name.split(" ",2)
    
    connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [nameArry[0],nameArry[1]], function(err, data){
      employeeId=data[0].id
        connection.query("SELECT id FROM manager WHERE manager_name = ? ", [answer.manager], function(err, data){
          let managerId=data[0].id
          connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId],function(err,data){
            if (err) throw err;
              console.log("Employee Manager Successfully Updated!")
              startapp();
          });
      });
    });
  });
  }


// get all current employees and push them in an arry to be used in inquirer prompt to update employee role
var employees =[];
function getEmployees(){
  connection.query("SELECT first_name, last_name FROM employee", function(error, response){
    
    for (var i=0; i < response.length; i++){
        var firstName=response[i].first_name;
        var lastName=response[i].last_name;
        var fullName=firstName + " "+ lastName;
        employees.push(fullName);
      }
  });
  getRolesForUpdate();
}

// get all current roles and push them in an arry to be used in inquirer prompt to update employee role
var rolesForUpdateArry =[];
function getRolesForUpdate(){
  connection.query("SELECT role_title FROM role", function(error, response){
    for (var i=0; i < response.length; i++){
        rolesForUpdateArry.push(response[i].role_title);
      }
      updateEmployeeRole();
    });
  
}

// function to update employee role
function updateEmployeeRole(){
  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Name of employee you would like to update?",
      choices: employees
    },
    {
      type: "list",
      name: "role",
      message: "What is their new role?",
      choices: rolesForUpdateArry
    },
  ]).then(function(answer){
      var name =answer.employee
      //puts employee name in array to be accessed in employee table
      var nameArry= name.split(" ",2)
      
      connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [nameArry[0],nameArry[1]], function(err, data){
        employeeId=data[0].id
          connection.query("SELECT id FROM role WHERE role_title = ? ", [answer.role], function(err, data){
            let roleId=data[0].id
               connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId],function(err,data){
                  if (err) throw err;
                    console.log("Employee Role Successfully Updated!")
                    startapp();
                });
          }); 
      });
    });
}





























































