const { response } = require('express');
const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
console.log('#######################################');
console.log('\n');
console.log('\tEmployee Tracker');
console.log('\n');
console.log('#######################################');


const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'PasswordWoof1!',
    database: 'employees_db'
  },
  console.log(`Connected to the courses_db database.`)
);
/**
 * menuPrompts()
 * - Will prompt user
 * @typedef {object} r - A Object that will return what the user want to do
 */
async function menuPrompts(){
  let x;
  await inquirer.prompt({
    type: 'list',
    message: 'What do you want to do?',
    name: 'userChoice',
    choices: [
      "View All Employees?",
      "Add Employee?",
      "Remove Employee?",
      "Update Employee Role?",
      "View All Roles?",
      "Add Roles?",
      "View All Departments?",
      "Add Department?",
      "Update Manager?",
      "View Manager?",
      "View Employee by Department?",
      "Delete Department?",
      "Delete Role?",
      "Budget?", 
      "Quit?"
    ]})
    .then((r) => {
      x = r;
      console.log(  'Prompt');
    })
    console.log('return');
    console.log(x.userChoice);

    switchCases(x.userChoice);
}
/**
 * switchCases()
 * - Will execute correct switch case for user
 * @param x - User choice for what to do
 */
function switchCases(x){
  switch(x){
    case "View All Employees?":
      return view_all_employees();
    case "Add Employee?":
      return add_employee();
    case "Remove Employee?":
      return remove_employee();
    case "Update Employee Role?":
      return update_employee_role();
    case "View All Roles?":
      return view_all_roles();
    case "Add Roles?":
      return add_roles();
    case "View All Departments?":
      return view_all_departments();
    case "Add Department?":
      return add_departments();
    case "Update Manager?":
      return update_manager();
    case "View Manager?":
      return view_managers();
    case "View Employee by Department?":
      return view_employee_by_department();
    case "Delete Department?":
      return delete_department();
    case "Delete Role?":
      return delete_role();
    case "Budget?":
      return budget();
    case "Quit?":
      return quit();
  }
}
/**
 * view_all_employees()
 * - Will execute query call
 * - Return the value
 * - display in console.table()
 * @typedef {Object} result - The result of the query call.
 * @property {string} err - A string containing the error caught, is caught. 
 */
function view_all_employees(){
  db.query(`SELECT * FROM employees_db.employee`,  (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table('\n');
    console.table(result);
  });
  menuPrompts();
}
/**
 * add_employee()
 * - Will execute query call for all roles that will be used for prompt list
 * - Return the value, that return will be parsed into a map. 
 * - Will execute another query call for all Managers that will be used for prompt
 * - Prompt User on Employe credentials 
 * - Execute another query call that will add new employee with correct/existing roles and existing manager
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} all_Roles - A Parsed query result
 * @typedef {Object} manage_result - The result of the query call
 * @typedef {Map} all_Managers - A Parsed query result
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 */
function add_employee(){
  //Get Roles
  db.query(`SELECT * FROM role`,  (err, result) => {
      if (err) {
        console.log(err);
      }
      //Parse
      const all_Roles = result.map(role => ({ value: role.id, name: role.title }));
      //Get Manager
      db.query(`SELECT * FROM employee WHERE employee.role_id = 312;`, (error, manage_result) =>{
        if(error){
          console.log(error);
        }
        //Parse
        const all_Managers = manage_result.map(employee => ({ value: employee.id, name: employee.first_name + " " + employee.last_name }));
        //prompt
        inquirer.prompt([
        {
          type: 'input',
          message: 'What is your ID',
          name: 'id',
        },
        {
          type: 'input',
          message: 'What is your First Name',
          name: 'first_name',
        },
        {
          type: 'input',
          message: 'What is your Last Name',
          name: 'last_name',
        },
        {
          type: 'list',
          message: 'What is your Role',
          name: 'role_id',
          choices: all_Roles
        },
        {
          type: 'list',
          message: 'Who is the Manager',
          name: 'manager_id',
          choices: all_Managers,
        }])
        //Insert new Employee
        .then((r) => {
          db.query(`INSERT INTO employee SET ?`, r,  (err, setR) => {
            if (err) {
              console.log(err);
            }
            //Make for sure line was affected
            if(setR.affectedRows == 1){
              console.log("Successfully Added");
            }
            else{
              console.log("Not Added");
            }
            console.table('\n');
            menuPrompts();
          });
        })
      });
    });
}
/**
 * remove_employee()
 * - Will execute query call for all employees that will be used for prompt list
 * - Prompt User on who to remove
 * - Execute another query call that will remove employee
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} employee_id - A Parsed query result
 * @typedef {Object} deleteResult - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 */
function remove_employee(){
  db.query(`SELECT * FROM employee;`,(err, result) =>{
    if (err) {
      console.log(err);
    }
    //Generate a Map with name and ID
    const employee_id = result.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));
    inquirer.prompt([
      {
        type: 'list',
        message: 'Who do you want to remove',
        name: 'employee',
        choices: employee_id
      }
    ])
    .then((r) => {
      ///Run Query
      db.query('DELETE FROM employees_db.employee WHERE id = ?', r.employee,  (error, deleteResult) => {
        if (err) {
          console.log(err);
        }
        //Check if row was affected
        if(deleteResult.affectedRows == 1){
          console.log("Successfully Deleted");
        }
        else{
          console.log("Not Added");
        }
        console.table('\n');
        menuPrompts();
      });
    })
  });
}
/**
 * update_employee_role()
 * - Will execute query call for all employees that will be used for prompt list
 * - Parse employee's in map
 * - Execute another query call that will get all roles
 * - Will parse roles into map
 * - WIll prompt() user to choose an  employee and choose a role to change them too. 
 * - Then use the information gathered and execute another query that will change the information
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} employee_id - A Parsed query result
 * @typedef {Object} res - The result of the query call
 * @typedef {Map} roles - A Parsed query result
 * @typedef {Object} resolve - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 * @property {string} e - A string containing the error caught, is caught.
 */
function update_employee_role(){
  //Employee Query
  db.query(`SELECT * FROM employee;`,(err, result) =>{
    if (err) {
      console.log(err);
    }
    //Generate a Map with name and ID
    const employee_id = result.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));
    console.table(employee_id);
    //Role query
    db.query(`SELECT * FROM role;`, (error, res) =>{
      if(error){
        console.log(error);
      }
      //Get All Roles
      const roles = res.map(role => ({ name: role.title, value: role.id }));
      console.table(roles);
      inquirer.prompt([
        {
          type: 'list',
          message: 'Whos role do you want to update',
          name: 'employee',
          choices: employee_id
        },
        {
          type: 'list',
          message: 'What role do you want to replace',
          name: 'role',
          choices: roles
        }
      ])
      .then((r) => {
        ///Run Query
        db.query('UPDATE employees_db.employee SET role_id = ? WHERE id = ?', [r.role, r.employee],  (e, resolve) => {
          if (e) {
            console.log(e);
          }
          //Check if row was affected/success
          if(resolve.affectedRows == 1){
            console.log("Successfully Updated");
          }
          else{
            console.log("Not Updated");
          }
          console.table('\n');
          menuPrompts();
        });
      })
    })

  });
}
/**
 * view_all_roles()
 * - Will execute query call for all roles that will display
 * @typedef {Object} result - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 */
function view_all_roles(){
  db.query(`SELECT * FROM employees_db.role`,  (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('\n');
    console.table(result);
  });
  menuPrompts();
}
/**
 * add_roles()
 * - Will execute query call for all departments that will be used for prompt list
 * - Parse department's in map
 * - WIll prompt() user to enter new role data and choose a department that exists 
 * - Then use the information gathered and execute another query that will change add to database
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} departmentMap - A Parsed query result
 * @typedef {Object} res - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 */
function add_roles(){
  let randomID = Math.floor(Math.random()*(999-100+1)+100);
  db.query(`SELECT * FROM employees_db.department;`, (err, result) =>{
    if(err){
      console.log(err);
    }
    const departmentMap = result.map(department => ({ name: department.name, value: department.id }));
    inquirer.prompt([
      {
        type: 'input',
        message: 'New Role Title',
        name: 'title',
      },
      {
        type: 'input',
        message: 'New Role Salary',
        name: 'salary',
      },
      {
        type: 'list',
        message: 'What Department does this role belong to?',
        name: 'department_id',
        choices: departmentMap
      }
    ])
    .then((r) => {
      ///Run Query
      db.query('INSERT INTO employees_db.role (id, title, salary, department_id) VALUES (?,?,?,?)', [randomID, r.title, r.salary, r.department_id],  (error, res) => {
        if (err) {
          console.log(err);
        }
        if(res.affectedRows == 1){
          console.log("Successfully Added");
        }
        else{
          console.log("Not Added");
        }
        console.table('\n');
        menuPrompts();
      });
    })
  })

}
/**
 * view_all_departments()
 * - Will execute query call for all departments that will display
 * @typedef {Object} result - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 */
function view_all_departments(){
  db.query(`SELECT * FROM employees_db.department`,  (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('\n');
    console.table(result);
  });
  menuPrompts();
}
/**
 * add_departments()
 * - Will execute query call for all departments that will be used for prompt list
 * - Parse department's in map
 * - WIll then find the largest id value in department and increment it for the new department
 * - Then use the information gathered and execute another query that will change add to database
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} depart - A Parsed query result
 * @typedef {Object} res - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 * @property {int} id_max - Next department id
 */
function add_departments(){
  db.query(`SELECT * FROM employees_db.department`,  (err, result) => {
    if (err) {
      console.log(err);
    }
    //Parse
    const depart = result.map(department => ({ name: department.name, value: parseInt(department.id)}));
    let id_max = (1 + Math.max.apply(Math, depart.map(function(x) { return x.value; })));
    //Prompt user
    inquirer.prompt([
      {
        type: 'input',
        message: 'New Department Name',
        name: 'name'
      }
    ])
    .then((r) => {
      db.query(`INSERT INTO employees_db.department (id, name) VALUES (?,?)`, [id_max, r.name], (error, res) => {
        if (error) {
          console.log(error);
        }
        //check if sucess
        if(res.affectedRows == 1){
          console.log("Successfully Added");
        }
        else{
          console.log("Not Added");
        }
        console.table('\n');
        menuPrompts();
      })
    })
  });
}
/**
 * update_manager()
 * - Will execute query call for all employees that are managers this will be used for prompt list
 * - Parse department's in map 
 * - Will execute query call for all roles this will be used for prompt list
 * - Parse department's in map 
 * - Prompt user for new role for manager
 * - Then use the information gathered and execute another query that will change the employee in database. 
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} mangers - A Parsed query result
 * @typedef {Object} res - The result of the query call
 * @typedef {Map} roles - A Parsed query result
 * @typedef {Object} resolve - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 * @property {string} e - A string containing the error caught, is caught. 
 */
function update_manager(){
  db.query(`SELECT * FROM employees_db.employee WHERE role_id = 312;`, (err, result) =>{
    if(err){
      console.log(err);
    }
    const mangers = result.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));
    db.query(`SELECT * FROM employees_db.role`, (error, res) =>{
      if(error){
        console.log(error);
      }
      const roles = res.map(role => ({ name: role.title, value: role.id }));
      inquirer.prompt([
        {
          type: 'list',
          message: 'Who do you want to edit?',
          name: 'department_id',
          choices: mangers
        },
        {
          type: 'list',
          message: 'Pick Role ID Change?',
          name: 'new_role',
          choices: roles
        }
      ])
      .then((r) => {
        ///Run Query
        db.query('UPDATE employees_db.employee SET role_id = ? WHERE id = ?', [r.new_role, r.department_id],  (r, resolve) => {
          if (r) {
            console.log(r);
          }
          if(res.affectedRows == 1){
            console.log("Successfully Updated");
          }
          else{
            console.log("Not Updated");
          }
          console.table('\n');
          menuPrompts();
        });
      })
    })
  })
}
/**
 * view_managers()
 * - Will execute query call for all managers that will display
 * @typedef {Object} result - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 */
function view_managers(){
  db.query(`SELECT * FROM employees_db.employee WHERE role_id = 312;`, (err, result) =>{
    if(err){
      console.log(err);
    }
    console.table(result);
    menuPrompts();
  })
}
/**
 * view_employee_by_department()
 * - Will execute query call for all departments, this will be used for prompt list
 * - Parse department's in map 
 * - Prompt user for what department to see
 * - Then use the information gathered and execute another query that will change the employee in database. 
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} departmentMap - A Parsed query result
 * @typedef {Object} res - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 */
function view_employee_by_department(){
  db.query(` SELECT * FROM employees_db.department`, (err, result) =>{
    if(err){
      console.log(err);
    }
    const departmentMap = result.map(department => ({ name: department.name, value: department.id }));

    inquirer.prompt([
      {
        type: 'list',
        message: 'What Department do you want to see?',
        name: 'depart',
        choices: departmentMap,
      }
    ])
    .then((r) => {
      ///Run Query
      console.log(r);
      db.query(`
      SELECT * 
      FROM employees_db.role, employees_db.employee
      WHERE role.department_id = ? AND employee.role_id = role.id;
      `, r.depart, (err, res) =>{
        if(err){
          console.log(err);
        }
        console.table(res);
        menuPrompts();
      })
    })
  })
}
/**
 * delete_department()
 * - Will execute query call for all departments, this will be used for prompt list
 * - Parse department's in map 
 * - Prompt user for what department to see who to delete
 * - Then use the information gathered and execute another query that will change the employee in database. 
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} department - A Parsed query result
 * @typedef {Object} deleteResult - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 */
function delete_department(){
  db.query(`SELECT * FROM department;`,(err, result) =>{
    if (err) {
      console.log(err);
    }
    //Generate a Map with name and ID
    const department = result.map(department => ({ name: department.name, value: department.id }));
    //Get deleteEmployee
    console.table(department);
    inquirer.prompt([
      {
        type: 'list',
        message: 'Who do you want to remove',
        name: 'department_id',
        choices: department
      }
    ])
    .then((r) => {
      ///Run Query
      db.query('DELETE FROM employees_db.department WHERE id = ?', r.department_id,  (error, deleteResult) => {
        if (err) {
          console.log(err);
        }
        if(deleteResult.affectedRows == 1){
          console.log("Successfully Deleted");
        }
        else{
          console.log("Not Added");
        }
        console.table('\n');
        menuPrompts();
      });
    })
  });
}
/**
 * delete_role()
 * - Will execute query call for all roles, this will be used for prompt list
 * - Parse department's in map 
 * - Prompt user for removeing a role
 * - Then use the information gathered and execute another query that will remove the role in database. 
 * @typedef {Object} result - The result of the query call
 * @typedef {Map} load_role - A Parsed query result
 * @typedef {Object} deleteResult - The result of the query call
 * @property {string} err - A string containing the error caught, is caught. 
 * @property {string} error - A string containing the error caught, is caught. 
 */
function delete_role(){
  db.query(`SELECT * FROM role;`,(err, result) =>{
    if (err) {
      console.log(err);
    }
    //Generate a Map with name and ID
    const load_role = result.map(role => ({ name: role.title, value: role.id }));
    //Get deleteEmployee
    inquirer.prompt([
      {
        type: 'list',
        message: 'Who do you want to remove',
        name: 'role_id',
        choices: load_role
      }
    ])
    .then((r) => {
      ///Run Query
      db.query('DELETE FROM employees_db.role WHERE id = ?', r.role_id,  (error, deleteResult) => {
        if (error) {
          console.log(error);
        }
        //check for sucess
        if(deleteResult.affectedRows == 1){
          console.log("Successfully Deleted");
        }
        else{
          console.log("Not Added");
        }
        console.table('\n');
        menuPrompts();
      });
    })
  });
}
/**
 * budget()
 * - Will execute query call for all employees and their salaries, this will be used for prompt list
 * - Parse department's in map 
 * - Calculate the total sum of salaries or budget
 * - Then display the value
 * @typedef {Object} res - The result of the query call
 * @typedef {Map} employees - A Parsed query result
 * @property {string} error - A string containing the error caught, is caught. 
 */
function budget(){
  db.query(`SELECT * FROM employees_db.role
  LEFT JOIN employees_db.employee ON
  role.id = employee.role_id`, (error, res) =>{
    if(error){
      console.log(error);
    }
    //Get All Roles
    const employees = res.map(emp => ({ name: emp.first_name + " " + emp.last_name  , value: emp.salary }));
    console.log("#####################################################");
    console.table(employees);
    console.log("#####################################################");

    let sum = 0;
    for (let x = 0; x < employees.length; x++){
      sum += parseInt(employees[x].value);
    }
    console.log('\n');

    console.log("#####################################################");
    console.log("Current Budget: " + sum);
    console.log("#####################################################");
    menuPrompts();
  })
}
/**
 * quit()
 * - Will stop the prompts
 */
function quit(){
  return;
}
//Driver Code
function main(){
  menuPrompts(); 
}
//Driver Call
main();