INSERT INTO department (id, name)
VALUES (1,"Engineering"),
       (2,"Management"),
       (3,"Support"),
       (4,"Sales");

INSERT INTO role (id, title, salary, department_id)
VALUES (432,"Lead Engineer", "100000", 1),
       (312,"Manager", "80000", 2),
       (654,"Engineer", "60000",1),
       (532,"R&D", "50000", 1),
       (933,"Tech Support", "50000", 3),
       (934,"Support", "40000", 3),
       (777,"Sales", "30000", 4);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (123,"Bob", "The Builder", 777, 789),
       (456,"Thor", "Odinson", 532, 789),
       (789,"Loki", "Laufeyson", 312, 789),
       (012,"Peter", "Parker", 654, 678),
       (345,"Steve", "Rodgers", 312, 678),
       (678,"Tony", "Stark", 432, 901),
       (901,"Kang", "The Conqueror", 312, 901),
       (489,"Rick", "Sanchez", 933, 901),
       (751,"Morty", "Sanchez", 934, 901);