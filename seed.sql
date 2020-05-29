DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE department (
    id  INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    role_title VARCHAR(30),
    salary DECIMAL (10,2),
    department_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE manager (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    department_id INT,
    PRIMARY KEY(id)
);

INSERT INTO department (department_name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (role_title, salary, department_id)
VALUES ("Sales Lead", 80000, 1), ("Salesperson", 60000, 1), ("Lead Engineer", 100000, 2), ("Software Engineer",80000, 2), ("Lead Accountant", 100000, 3), ("Accountant",80000, 3), ("Legal Team Lead", 90000, 4), ("Lawyer", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Snow", 1, null), ("Chris", "Numan", 2, 1), ("Mario", "Chase", 2, 1), ("Kaeneth", "Dayao", 3, null), ("Alex", "Lee", 4, 2), ("Julian", "Fernandez", 4, 2), ("Tiffany", "Tsan", 5, null), ("George", "Frank", 6, 3), ("Anderson", "Keeper", 6, 3), ("Dan", "King", 7, null), ("Michael", "Bolt", 8, 4);

INSERT INTO manager (first_name, last_name, department_id)
VALUES ("John", "Snow", 1), ("Kaeneth", "Dayao", 2), ("Tiffany", "Tsan", 3), ("Dan", "King", 4);



