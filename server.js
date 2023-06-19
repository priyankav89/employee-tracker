const inquirer = require('inquirer');
const mysql = require('mysql2');


// Connecting server to the database with credentials.
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'appuser',
    password: 'appuser123',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);
//displayDepartment function displays all the department
async function displayDepartment(){
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    console.log('inside the department');
      if (err) throw err;
      console.table(res);
  })};

  async function displayRoles(){
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })};

    async function displayEmployees(){
      const query = 'SELECT * FROM employee';
      connection.query(query, (err, res) => {
          if (err) throw err;
          console.table(res);
      })};

      async function addDepartment(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Enter new department name'
            },
        ])
        .then((answer) => {
            connection.query('INSERT INTO department ?',
                {
                    name: answer.newDepartment,
                },
                function (err) {
                    if (err) throw err;
                }
            );
            console.log('New department added to database')
           displayDepartment();
        });
};
connection.connect((err) => {
    if (err) throw err;
      });

      async function addaRole(){
      
       connection.query(`SELECT * FROM department;`, (err, res) => {
      if (err) throw err;
      let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
      inquirer.prompt([
          {
          name: 'title',
          type: 'input',
          message: 'What is the name of the role you want to add?'   
          },
          {
          name: 'salary',
          type: 'input',
          message: 'What is the salary of the role you want to add?'   
          },
          {
          name: 'departmentName',
          type: 'rawlist',
          message: 'Which department do you want to add the new role to?',
          choices: departments
          },
      ]).then((res) => {
          connection.query(`INSERT INTO role SET ?`, 
          {
              title: res.title,
              salary: res.salary,
              department_id: res.departmentName,
          },
          (err, res) => {
              if (err) throw err;
              console.log('Sucessfully added new employee role!')
              displayRoles();
          })
      })
  })
};

async function addEmployee(){
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) console.log(err);
    roles = roles.map((role) => {
        return {
            name: role.title,
            value: role.id,
        };
    });
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter first name of new employee:'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter last name of new employee:'
            },
            {
                type: 'list',
                name: 'role',
                message: 'Enter new employee role:',
                choices: roles,
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'select a manager id:',
                choices: [1, 2, 3, 4, 5]
            }
        ])
        .then((res) => {
            console.log(res.role);
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: res.firstName,
                    last_name: res.lastName,
                    role_id: res.role,
                    manager_id: res.managerId
                },
                (err) => {
                    if (err) throw err;
                    console.log('Sucessfully added an employee;');
                    displayEmployees();

                }
            );
        });

});

};
async function updateEmployeeRole(){
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) console.log(err);
    departments = departments.map((department) => {
        return {
            name: department.name,
            value: department.id,
        };
    });
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addRole',
                message: 'Enter title of new role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter salary of new role:',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Enter department of new role:',
                choices: departments,
            },
        ])
        .then((res) => {
            connection.query(
                'INSERT INTO role ?',
                {
                    title: res.addRole,
                    salary: res.salary,
                    department_id: res.departmentId,
                },
                function (err) {
                    if (err) throw err;
                }
            );
            console.log('Successfully added new employee role!')
            addaRole();
        });

});
};


async function handleOptions(){
    const options = [
'View All Departments',
'View All Roles',
'View All Employees',
'Add a Department',
'Add a Role',
'Add an Employee',
'Update an Employee Role'
]
const results = await inquirer.prompt([{
    message:'what would you like to do?',
    name: 'command',
    type:'list',
    choices : options
}])
console.log(results.command);
if (results.command == 'View All Departments'){
  console.log("in here");
  displayDepartment();
  handleOptions();
} else if (results.command == 'View All Roles'){
  displayRoles();
  handleOptions();
} else if(results.command == 'View All Employees'){
  displayEmployees();
  handleOptions();
} else if (results.command == 'Add a Department'){
  addDepartment();
  handleOptions();
} else if (results.command == 'Add a Role'){
  addaRole();
  handleOptions();
} else if ( results.command == 'Add an Employee'){
  addEmployee();
  handleOptions();
} else if (results.command == 'Update an Employee Role'){
  updateEmployeeRole();
  handleOptions();
}
//  inquirer.prompt();
}
handleOptions();