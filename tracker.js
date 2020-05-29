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
    
      switch (answer.choice) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all employees by department":
          getDepartment();
          break;

        case "View all employees by roles":
          getRoles();
          break;

        case "Add employee":
          getNewEmployeeRoles();
          break;
        
        case "Add department":
          addDepartment();
          break;

        case "Add role":
          getNewRole();
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
    const query="SELECT employee.id, employee.first_name, employee.last_name, role.role_title, department.department_name, role.salary FROM role INNER JOIN employee ON role.id=employee.role_id INNER JOIN department ON role.department_id=department.id"
      connection.query(query, function(err,res){
        if (err) throw err;
          console.table(res)
          startapp();
      });
}

var dept =[];
function getDepartment(){
  connection.query("SELECT department_name FROM department", function(error, response){
    for (var i=0; i < response.length; i++){
        dept.push(response[i].department_name);
      }
      viewDepartment();
    });
  
}

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

var roles =[];
function getRoles(){
  connection.query("SELECT role_title FROM role", function(error, response){
    for (var i=0; i < response.length; i++){
        roles.push(response[i].role_title);
      }
      viewRoles();
    });
  
}


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



var newemployeerolesArry =[];
function getNewEmployeeRoles(){
  connection.query("SELECT role_title FROM role", function(error, response){
    for (var i=0; i < response.length; i++){
        newemployeerolesArry.push(response[i].role_title);
      }
     
      addEmployee();
    });
  
}
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
      choices: ["John Snow", "Kaeneth Dayao", "Tiffany Tsan", "Dan King", "None"]
    }

  ]).then(function(answer){
      connection.query("SELECT id FROM role WHERE ?", {role_title: answer.role}, function(err, data){
        if(err) throw err;

        var roleId= data[0].id

        if(answer.manager==="John Snow"){
            answer.manager=1
          }else if(answer.manager==="Kaeneth Dayao"){
            answer.manager=2
          }else if(answer.manager==="Tiffany Tsan"){
            answer.manager=3
          }else if(answer.manager==="Dan King"){
            answer.manager=4
          }else if(answer.manager==="None"){
            answer.manager="Null"
          }
      
        const query= "INSERT INTO employee SET ?"
          connection.query(query,[{first_name: answer.firstName, last_name: answer.lastName, role_id: roleId, manager_id: answer.manager}], function(err,data){
          if (err) throw err;
          console.log("New Employee added")
        });
      });
    });
}

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
          console.log("New Department added")
      });
    });
}



var getDeptRoleArry =[];
function getNewRole(){
  connection.query("SELECT department_name FROM department", function(error, response){
    for (var i=0; i < response.length; i++){
        getDeptRoleArry.push(response[i].department_name);
      }
      addRole();
    });
  
}


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
            console.log("New Role Added")

          })

        
      });










      // const query="INSERT INTO department (department_name) VALUES (?)"
      //   connection.query(query, [answer.deparment], function(err, data){
      //     if (err) throw error;
      //     console.log("New Deparment added")
      // });
    });
}

















































































// if(answer.role==="Sales Lead"){
//   answer.role=1
//   console.log(answer.role)
// }else if(answer.role==="Salesperson"){
//   answer.role=2
// }else if(answer.role==="Lead Engineer"){
//   answer.role=3
// }else if(answer.role==="Software Engineer"){
//   answer.role=4
// }else if(answer.role==="Lead Accountant"){
//   answer.role=5
// }else if(answer.role==="Accountant"){
//   answer.role=6
// }else if(answer.role==="Legal Team Lead"){
//   answer.role=7
// }else if(answer.role==="Lawyer"){
//   answer.role=8
// }
// 

// async function addEmployee(){
//   const query="SELECT employee.id, employee.first_name, employee.last_name, role.role_title, department.department_name, role.salary FROM role INNER JOIN employee ON role.id=role_id INNER JOIN department ON role.department_id=department.id"
//   const data = await connection.query(query)
//   const choices = data.reduce((a,b)=>(a[b.role_title]=b.id,a),{})
//   inquirer.prompt([
//     {
//       type: "input",
//       name: "firstName",
//       message: "What is the employee's first name?",
//     },
//     {
//       type: "input",
//       name: "lastName",
//       message: "What is the employee's last name?",
//     },
//     {
//       type: "list",
//       name: "role",
//       message: "What is the employee's role?",
//       choices: Object.keys(choices)
//     },
//     {
//       type: "list",
//       name: "manager",
//       message: "Who is the employees manager?",
//       choices: ["John Snow", "Kaeneth Dayao", "Tiffany Tsan", "Dan King", "None"]
//     }

//   ]).then(function(answer){
//     console.log('this is your role id ', choices[answer.role])
//       if(answer.role==="Sales Lead"){
//         answer.role=1
//         console.log(answer.role)
//       }else if(answer.role==="Salesperson"){
//         answer.role=2
//       }else if(answer.role==="Lead Engineer"){
//         answer.role=3
//       }else if(answer.role==="Software Engineer"){
//         answer.role=4
//       }else if(answer.role==="Lead Accountant"){
//         answer.role=5
//       }else if(answer.role==="Accountant"){
//         answer.role=6
//       }else if(answer.role==="Legal Team Lead"){
//         answer.role=7
//       }else if(answer.role==="Lawyer"){
//         answer.role=8
//       }
//       if(answer.manager==="John Snow"){
//         answer.manager=1
//       }else if(answer.manager==="Kaeneth Dayao"){
//         answer.manager=2
//       }else if(answer.manager==="Tiffany Tsan"){
//         answer.manager=3
//       }else if(answer.manager==="Dan King"){
//         answer.manager=4
//       }else if(answer.manager==="None"){
//         answer.manager="Null"
//       }
//       const query= "INSERT INTO employee SET ?"
//       connection.query(query,[{first_name: answer.firstName, last_name: answer.lastName, role_id: answer.role, manager_id: answer.manager}], function(err,res){
//         if (err) throw err;
//         console.log("New Employee added")
//       });
//     });
// }