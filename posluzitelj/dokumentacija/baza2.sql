CREATE TABLE "film"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "jezik" VARCHAR(45) NOT NULL,
  "originalni_naslov" VARCHAR(100) NOT NULL,
  "naslov" VARCHAR(100) NOT NULL,
  "popularnost" DECIMAL,
  "slikica_postera" VARCHAR(1000),
  "datum_izdavanja" VARCHAR(45),
  "opis" VARCHAR(1000)
);
CREATE TABLE "osoba"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "ime_prezime" VARCHAR(150) NOT NULL,
  "poznat_po" VARCHAR(45),
  "slika" VARCHAR(1000),
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
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "osoba_id" INTEGER NOT NULL,
  "film_id" INTEGER NOT NULL,
  "lik" VARCHAR(45),
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
INSERT into korisnik (id, ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id) values (2, "Registrirani", "Korisnik", "Korisnička 1","obican", "rwa", "korisnik@gmail.com", 2);
INSERT into korisnik (id, ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id) values ("Lucija", "Polak", "Korisnička 1","lpolak22", "lp", "lpolak22@foi.hr", 2);

select * from korisnik;

INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (2, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (3, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (6, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (7, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (9, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (8, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);
INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (10, 'Nasumicna Slika', 'SLika', 'https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid', 10);

INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (11, 'Bud Spencer', 'Gluma', '/cVbBoKxRDFOdDKwdpRmxVazDWlE.jpg', 10);


DELETE FROM osoba where id=514;

SELECT 
    f.id, 
    f.naslov, 
    f.originalni_naslov, 
    f.jezik, 
    f.popularnost, 
    f.slikica_postera, 
    f.datum_izdavanja, 
    f.opis,
    ofi.lik
FROM film f
INNER JOIN osoba_film ofi ON f.id = ofi.film_id
WHERE ofi.osoba_id = 4724
LIMIT 20 OFFSET 0;

