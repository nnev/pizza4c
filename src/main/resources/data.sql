merge into Known_Restaurant
    (id, version, human_Readable_Name, lieferando_Name)
KEY(lieferando_Name)
VALUES
    (1, 1, 'Pizza Rapido', 'pizza-rapido-eppelheim'),
    (2, 1, 'Pizza Bananana', '3Q3N1P2');
-- select 1;