USE employeetracker_db;

INSERT INTO department
(name)

VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role 
(title,salary, department_id)

VALUES
("Sales Lead",100000,1),
("Salesperson",800000, 1),
("Lead Engineer",115000,2),
("Software Engineer",1200000,2),
("Account Manager", 1250000,3),
('Accountant',1400000, 3),
("Legal Team Lead",250000, 4),
("Lawyer",100000,4);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)

VALUES
('Ajay', 'Tamizh',1,NULL),
('Aria', 'Vivek',2,1),
('Priya', 'Selva',3,1),
('Tammi', 'Will',4,2),
('Vivek', 'chitta',5,3),
('Hannah', 'Tottum',6,3),
('Sam', 'Henderson',7,4),
('Tom','Holland',8,4)