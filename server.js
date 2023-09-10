const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'appuser',
    //  MySQL password 
    password: 'appuser123',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);


async function queryDb(sql){
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if(err) return reject(err);
            resolve(results);
        })
    });
}

function init(){
    console.log("\n \x1b[1m\x1b[41m Main Menu\x1b[0m \n");
    // prompt to user with choices to choose
    inquirer.prompt([
        {
            name: "init",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee's Role", "Exit"]
        }
        //switch cases for each selection
    ]).then((res) => {
        switch(res.init){
            case "View Departments":
                viewAllDepartments(true);
                break;
            case "View Roles":
                viewAllRoles();
                break;
            case "View Employees":
                viewAllEmployees();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee's Role":
                updateEmployeeRole();
                break;
            case "Exit":
                db.end();
                break;
            default:
                break;
        }
    });
}

//function that displays all the departments in the database
async function viewAllDepartments(runInit){
    //query all departments
    const departments = await queryDb("SELECT * FROM department");

    console.log("\x1b[1m\x1b[44m Viewing All Departments: \x1b[0m");
    console.table(departments);
    runInit ? init() : null;
};

//function that displays the roles  in the database
async function viewAllRoles(){
    //query all roles
    const roles = await queryDb(`
        SELECT
        r1.id AS ID,
        r1.title AS Title,
        r1.salary AS Salary,
        d1.name as Department
        
        FROM role r1
        INNER JOIN department d1 ON r1.department_id = d1.id
        `);

    console.log("\n \x1b[44m Viewing All Roles: \x1b[0m");
    console.table(roles);
    init();
};

//function that displays the employees in the database
async function viewAllEmployees(){
    //query all employees using joins to display easy to read info
    const employees = await queryDb(`
        SELECT 
        e1.id AS ID,
        CONCAT(e1.first_name, ' ', e1.last_name) AS Employee,
        r1.salary AS Salary,  
        r1.title AS Role,
        d1.name AS Department,
        CONCAT(e2.first_name,' ', e2.last_name) AS Manager

        FROM employee e1
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        INNER JOIN role r1 ON e1.role_id = r1.id
        INNER JOIN department d1 ON r1.department_id = d1.id
    `);

    console.log("\n \x1b[44m Viewing All Employees: \x1b[0m");
    console.table(employees);
    init();
};

//function to add  department
function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter the new department name:"
        }
    ]).then((res) => {
        //query the database to add a department
        queryDb(`INSERT INTO department (name) VALUES ("${res.name}")`);
        console.log(`\n \x1b[5m\x1b[44m ${res.name} added to departments! \x1b[0m \n`);
        init();
    });
};

//function to add a role
async function addRole(){ 
    //query all departments
    const departments = await queryDb("SELECT * FROM department");

    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Enter the title of the role:"
        },
        {
            name: "salary",
            type: "input",
            message: "Enter the salary of the role:"
        },
        {
            name: "dept_id",
            type: "list",
            message: "Select the department this role falls under:",
            choices: departments.map((department) => ({name: department.name, value: department.id}))
        }
    ]).then((res) => {
        //query the databse to add the role
        queryDb(`INSERT INTO role (title, salary, department_id) 
            VALUES ("${res.title}", ${res.salary}, ${res.dept_id})`);
        console.log(`\n \x1b[5m\x1b[44m ${res.title} added to roles! \x1b[0m \n`);

        init();
    })
};

//function to add an employee
async function addEmployee(){
    const roles = await queryDb("SELECT * FROM role");
    const employees = await queryDb("SELECT * FROM employee");

    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter the first name:"
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter the last name:"
        },
        {
            name: "role_id",
            type: "list",
            message: "Select the role:",
            choices: roles.map((role) => ({name: role.title, value: role.id}))
        },
        {
            name: "manager_id",
            type: "list",
            message: "Select the manager:",
            choices: () => {
                let final = employees.map((employee) => ({name: employee.first_name + " " + employee.last_name, value: employee.id}));
                final.push({name: "None", value: null});
                return final;
            }
            
        }
    ]).then((res) => {
        //query the database to 
        queryDb(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            Values ("${res.first_name}", "${res.last_name}", ${res.role_id}, ${res.manager_id})`)
        console.log(`\n \x1b[5m\x1b[44m ${res.first_name} has been added to the employee directory! \x1b[0m \n`);

        init();
    });
};

//function that updates an employee
async function updateEmployeeRole(){
    const employees = await queryDb("SELECT * FROM employee");
    const roles = await queryDb("SELECT * FROM role");

    inquirer.prompt([
        {
            name: "employee_id",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
        },
        {
            name: "role_id",
            type: "list",
            message: "Select the role to change this employee to:",
            choices: roles.map((role) => ({name: role.title, value: role.id}))
        }
    ]).then((res) => {
        db.query("UPDATE employee SET ? WHERE ?", [{role_id: res.role_id}, {id: res.employee_id}]);
        console.log(`\n \x1b[5m\x1b[44m Updated employee ${res.employee_id}'s role to role id ${res.role_id} \x1b[0m \n`);

        init();
    });
};

init();