CREATE TABLE "film"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "jezik" VARCHAR(45) NOT NULL,
  "originalni_naslov" VARCHAR(100) NOT NULL,
  "naslov" VARCHAR(100) NOT NULL,
  "popularnost" DECIMAL,
  "slikica_postera" VARCHAR(1000),
  "datum_izdavanja" VARCHAR(45) NOT NULL,
  "opis" VARCHAR(1000)
);
CREATE TABLE "osoba"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "ime_prezime" VARCHAR(150) NOT NULL,
  "poznat_po" VARCHAR(45) NOT NULL,
  "slika" VARCHAR(1000) NOT NULL,
  "popularnost" DECIMAL
);
CREATE TABLE "slika"(
  "id" INTEGER NOT NULL,
  "slika_putanja" VARCHAR(45) NOT NULL,
  "osoba_id" INTEGER NOT NULL,
  PRIMARY KEY("id","osoba_id"),
  CONSTRAINT "fk_slika_osoba1"
    FOREIGN KEY("osoba_id")
    REFERENCES "osoba"("id")
);
CREATE TABLE "osoba_film"(
  "osoba_id" INTEGER NOT NULL,
  "film_id" INTEGER NOT NULL,
  "lik" VARCHAR(150),
  PRIMARY KEY("osoba_id","film_id"),
  CONSTRAINT "fk_osoba_Film_osoba1"
    FOREIGN KEY("osoba_id")
    REFERENCES "osoba"("id"),
  CONSTRAINT "fk_osoba_Film_film1"
    FOREIGN KEY("film_id")
    REFERENCES "film"("id")
);

CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "email" TEXT NOT NULL,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "tip_korisnika_id" INTEGER NOT NULL,
  "adresa" TEXT,
  "status" INTEGER,
  "broj_telefona" VARCHAR(15),
  "datum_rodenja" VARCHAR(45),
  CONSTRAINT "id_UNIQUE"
    UNIQUE("id"),
  CONSTRAINT "fk_korisnik_tip_korisnika1"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);


insert into tip_korisnika (id, naziv) VALUES (1, "administrator");
insert into tip_korisnika (id,naziv) VALUES (2, "registrirani korisnik");
select * from tip_korisnika;


INSERT into korisnik (id, korime, lozinka, email, tip_korisnika_id) values (1, "admin", "rwa", "admin@gmail.com", 1);
INSERT into korisnik (id, ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id) values (2, "Registrirani", "Korisnik", "Korisnička 1","registrirani korisnik", "rwa", "korisnik@gmail.com", 2);
INSERT into korisnik (id, ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id) values ("Lucija", "Polak", "Korisnička 1","lpolak22", "lp", "lpolak22@foi.hr", 2);

select * from korisnik;

INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (2, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (3, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (6, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (7, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (9, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (8, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (10, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);

SELECT * from osoba;

INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (23, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (34, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (4634, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (53645, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (6324, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (7352, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (823, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (9342, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (10325, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (11532, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1223, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (13354, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (14234, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1554, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1634, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1735, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1834, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1924, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (2054, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (2123, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (2234, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (231, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (341, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (46314, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (536415, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (63241, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (73512, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (8213, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (93142, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (101325, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (115132, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (12213, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (133154, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (142134, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (15514, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (16314, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (17315, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (18314, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (19124, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (20514, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (21213, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (22134, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (231, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (341, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (46314, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (536415, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (63241, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (73512, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (8231, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (93412, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (103225, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (115322, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (12232, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (133524, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (142324, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (15542, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (16342, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (17352, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (18342, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (19242, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (20542, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (21232, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (22342, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");

INSERT into film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) values (1, "HR", "Družba pere kvržice", "Družba pere kvržice", 10, "/putanja", "2023-12-03", "dug i opsiran opis");
SELECT * from film;

INSERT INTO film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis) VALUES
(40, 'HR', 'Družba pere kvržice', 'Družba pere kvržice', 8, '/putanja1', '2023-12-01', 'Opis filma koji govori o grupi prijatelja koji preživljavaju kroz razne avanture.'),
(41, 'HR', 'Pohlepni zec', 'Pohlepni zec', 7, '/putanja2', '2023-12-02', 'Film o zecu koji je neumorno trčao za bogatstvom, ali je zaboravio na prijateljstvo.'),
(42, 'HR', 'Noćna mora', 'Noćna mora', 9, '/putanja3', '2023-12-03', 'Tenzije rastu kada se grupa prijatelja nađe u napuštenoj kući s tajnama iz prošlosti.'),
(43, 'HR', 'Posljednja želja', 'Posljednja želja', 6, '/putanja4', '2023-12-04', 'Film o mladiću koji se suočava s vlastitim strahovima kako bi ispunio posljednju želju svog djedu.'),
(44, 'HR', 'Tajna grada', 'Tajna grada', 7, '/putanja5', '2023-12-05', 'Detektiv istražuje seriju misteroznih događaja u starom dijelu grada.'),
(45, 'HR', 'Krug života', 'Krug života', 8, '/putanja6', '2023-12-06', 'Priča o obitelji koja se suočava s gubicima i ponovnim pronalaženjem smisla života.'),
(46, 'HR', 'Zvjezdane staze', 'Zvjezdane staze', 9, '/putanja7', '2023-12-07', 'Povratak u svemir u kojem putnici na svemirskom brodu otkrivaju novi svemir.'),
(47, 'HR', 'Kamen mudrosti', 'Kamen mudrosti', 7, '/putanja8', '2023-12-08', 'Mladi junak kreće na put da pronađe tajni artefakt koji bi mogao promijeniti sudbinu svijeta.'),
(48, 'HR', 'Zadnji dah', 'Zadnji dah', 6, '/putanja9', '2023-12-09', 'Film o medicinskoj sestri koja se bori za život pacijenta, dok sama gubi svoje.'),
(49, 'HR', 'Skrivena istina', 'Skrivena istina', 8, '/putanja10', '2023-12-10', 'Misteriozni film o novinaru koji istražuje zločine koji su bili zaboravljeni.'),
(50, 'HR', 'Putovanje kroz vrijeme', 'Putovanje kroz vrijeme', 7, '/putanja11', '2023-12-11', 'Grupa znanstvenika otkriva putovanje kroz vrijeme, ali svaki njihov pokušaj ima neočekivane posljedice.'),
(51, 'HR', 'Dug put kući', 'Dug put kući', 8, '/putanja12', '2023-12-12', 'Film o ženi koja se vraća kući nakon dugih godina, suočavajući se s prošlim traumama.'),
(52, 'HR', 'Posljednji dan', 'Posljednji dan', 9, '/putanja13', '2023-12-13', 'Film o svijetu pred kraj, gdje ljudi pokušavaju živjeti normalno, iako je apokalipsa neizbježna.'),
(53, 'HR', 'Dječji svijet', 'Dječji svijet', 7, '/putanja14', '2023-12-14', 'Priča o skupini djece koja pokušavaju zaštititi svoj svijet od nadolazeće opasnosti.'),
(54, 'HR', 'Tajni vrt', 'Tajni vrt', 6, '/putanja15', '2023-12-15', 'Djevojčica otkriva zaboravljeni vrt koji skriva mnoge tajne prošlih vremena.');


insert into osoba_film (osoba_id, film_id, lik) VALUES (20, 5, "Pero");
insert into osoba_film (osoba_id, film_id, lik) VALUES (20, 6, "Franjo");
insert into osoba_film (osoba_id, film_id, lik) VALUES (19, 4, "Ivica");
insert into osoba_film (osoba_id, film_id, lik) VALUES (18, 4, "Milo Dijete");
insert into osoba_film (osoba_id, film_id, lik) VALUES (6, 4, "Ivica");
insert into osoba_film (osoba_id, film_id, lik) VALUES (6, 3, "Milo Dijete");
insert into osoba_film (osoba_id, film_id, lik) VALUES (6, 5, "Ivica");
insert into osoba_film (osoba_id, film_id, lik) VALUES (7, 4, "Milo Dijete");

SELECT * from osoba_film;

DELETE FROM korisnik WHERE korime = "test";

delete from osoba_film where osoba_id = 1;