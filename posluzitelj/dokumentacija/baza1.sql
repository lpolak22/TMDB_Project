
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "adresa" TEXT,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "email" VARCHAR(45) NOT NULL,
  "tip_korisnika_id" INTEGER NOT NULL,
  "status" INTEGER,
  "broj_telefona" VARCHAR(15),
  "datum_rodenja" VARCHAR(20),
  "totp" VARCHAR(45),
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);

insert into tip_korisnika (naziv, opis) values ("administrator", "ima sve ovlasti, moze vidjeti podatke svvih korisnika, moze obrisati korisnika, moze dati ili oduzeti pristup ovisno o statusu");
insert into tip_korisnika (naziv,opis) values ("registrirani korisnik", "ima ovlasti registriranog korisnika, mora unijeti korisnicko ime, lozinku i email, ostali unosi su opcionalni");
insert into tip_korisnika (naziv,opis) values ("gost", "moze se samo prijaviti ili registrirati te pregledavati dokumentaciju");
select * from tip_korisnika;

INSERT into korisnik (ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id, status) values ("","","","admin", "rwa", "admin@gmail.com", 1, 1);
INSERT into korisnik (ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id, status, broj_telefona) values ("Registrirani", "Korisnik", "Korisnička 1","obican", "2317c5cc4e67b0cb5f55b26fdcf5fe0a24012503ae99d22b26f3c866d281be2b", "korisnik@gmail.com", 2, 0, "+385981231234");
INSERT into korisnik (ime, prezime, adresa, korime, lozinka, email, tip_korisnika_id, status, broj_telefona) values ("admin", "", " 1","admin", "2317c5cc4e67b0cb5f55b26fdcf5fe0a24012503ae99d22b26f3c866d281be2b", "admin@gmail.com", 1, 1, "+385981231234");


SELECT * from korisnik;
delete from korisnik;

UPDATE korisnik SET status=1 WHERE korime="lpolak22";