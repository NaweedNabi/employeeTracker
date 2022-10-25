const inquirer = require('inquirer')
const mysql = require('mysql2');

require('dotenv').config() 


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6224',
    database: 'teammembers_db'
});


const questionsPrompt = () => { 
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View all departments?', 'View all roles?','View all employees?','Add a department?','Add a role?', 'Add an employee?', 'Update an employee?']
        }).then((answers) => {
        if (answers.choice === 'View all departments?') {
            viewDepartment();
        } else if (answers.choice === 'View all roles?') {
            viewRoles();
        } else if (answers.choice === 'View all employees?') {
            console.log('View all employees');
            viewEmployees();
        } else if (answers.choice === 'Add a department?') {
            console.log('Add a department');
            addDepartment();
        } else if (answers.choice === 'Add a role?') {
            console.log('Add a role');
            addRole();
        } else if (answers.choice === 'Add an employee?') {
            console.log('Add an employee');
            addEmployee();
        } else if (answers.choice === 'Update an employee?') {
            console.log('Update an employee')
            updateEmployee();
        }
    });
}
questionsPrompt();

const viewDepartment = () => {
    connection.query(
        'SELECT * FROM department',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.log(results);
            endingPrompt();
        }
    );
}

const viewRoles = () => {
    connection.query(
        'SELECT * FROM role',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.log(results);
            endingPrompt();
        }
    );
}

const viewEmployees = () => {
    connection.query(
        'SELECT * FROM employee',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.log(results);
            endingPrompt();

        }
    );
}

const addDepartment = () => {
    inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'What is the department name?',
    },
    ])
    .then((answers) => { 
    console.log(answers);
        connection.query('INSERT INTO department SET ?', {name: answers.name},
        function(err, results) {
            if (err){
                throw err;
            }
            console.log(results);
            endingPrompt();

        }
    );
    });
}

const addRole = () => {

    connection.query(
        'SELECT name, id FROM department',
        function(err, department){
            if (err){
                throw err;
            }
            let departmentList = department.map((departmentInfo) => {
                return{
                    name: departmentInfo.name,
                    value: departmentInfo.id
                }
            })
    inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'What is the title for this role?',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department will this role be in?',
        choices: departmentList
    }
    ])
    .then((answers) => {
    console.log(answers);
        connection.query('INSERT INTO role SET ?', {
            title: answers.title,
            salary: answers.salary, 
            department_id: parseInt(answers.department),
        },
        function(err, results) {
            if (err){
                console.log(err)
            } else {
            console.log(`ROLE HAS BEEN ADDED! ${results}`);
        }
            questionsPrompt();
        }
    );
    })
})
}

const addEmployee = () => {
    inquirer.prompt([
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the employees first name?',
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the employees last name?',
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the role id?',
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the employee\'s managers id?',
    },
    ])
    .then((answers) => {
    console.log(answers);
        connection.query('INSERT INTO employee SET ?', {
            first_name: answers.first_name,
            last_name: answers.last_name, 
            role_id: answers.role_id,
            manager_id: answers.manager_id
        },
          (err, results) => {
            if (err){
                throw err;} 
            console.log(results);
            questionsPrompt();

        }
    );
    })
}

const updateEmployee = () => {
    connection.query(
        'SELECT id, first_name, last_name FROM employee',
        function(err, results) {
            if (err){
                throw err;
            }
            let employeeList = results.map((employeeInfo)=>{
                return {
                    name: employeeInfo.first_name,
                    value: employeeInfo.id
                }
            })
            console.log(employeeList)

            connection.query(
                'SELECT id, title FROM role',
                function(err, role) {
                    if (err){
                        throw err;
                    }
            let roleList = role.map((roleInfo) => {
                return {
                    name: roleInfo.title,
                    value: roleInfo.id
                }
            })

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'who',
                    message: 'which employee would you like to update?',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What role would you like to give this employee?',
                    choices: roleList
                }
            ]).then((answers) => {
                console.log(answers);
                connection.query( 
                    `UPDATE employee SET role_id = ${answers.role} WHERE id = ${answers.who}`,
                    function(err, results) {
                        if (err){
                            throw err;}
                        console.log('Successfully updated');
                        endingPrompt();
                    }
                    )
            })
        });
    }
    )};



 
const endingPrompt = () => { 
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Would you like to do anything else?',
        choices: ['No', 'Yes']
        
    }).then((answers) => {
        if (answers.choice === 'No') {
            
            console.log('Thanks dude! Take it easy on me on the grade! ');
            return
        } else if (answers.choice === 'Yes') {
            questionsPrompt();
        }
    });
}