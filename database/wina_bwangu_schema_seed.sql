-- =====================================================================
-- Wina Bwangu Database — Schema + Seed Data
-- Generated for Assignment Exercise 3 (Server-Side / Database)
-- MySQL / MySQL Workbench version
-- =====================================================================

CREATE DATABASE IF NOT EXISTS wina_bwangu;
USE wina_bwangu;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS booth_services;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS booths;
DROP TABLE IF EXISTS users;

-- Table 1: User's Table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role  VARCHAR(20) NOT NULL DEFAULT 'agent',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

-- Table 2: Mobile Booths and their Locations
CREATE TABLE booths (
  booth_code   VARCHAR(10) PRIMARY KEY,
  location     VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Table 3: Services, Monthly Limits and Revenue per Kwacha
CREATE TABLE services (
  service_name VARCHAR(30) PRIMARY KEY,
  month_limit  DECIMAL(12,2) NOT NULL,
  rate         DECIMAL(6,4) NOT NULL   -- revenue per kwacha
) ENGINE=InnoDB;

-- Which services each booth is allowed to offer (many-to-many)
CREATE TABLE booth_services (
  booth_code   VARCHAR(10) NOT NULL,
  service_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (booth_code, service_name),
  FOREIGN KEY (booth_code)   REFERENCES booths(booth_code),
  FOREIGN KEY (service_name) REFERENCES services(service_name)
) ENGINE=InnoDB;

-- Table 3: Transactions (Appendix 1)
CREATE TABLE transactions (
  transaction_id     VARCHAR(15) PRIMARY KEY,
  booth_code         VARCHAR(10) NOT NULL,
  service_name       VARCHAR(30) NOT NULL,
  transaction_amount DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (booth_code)   REFERENCES booths(booth_code),
  FOREIGN KEY (service_name) REFERENCES services(service_name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed: users
-- ---------------------------------------------------------------------
INSERT INTO users(username, password_hash, role) VALUES('Wina', 'WinaBwangu', 'agent');
INSERT INTO users(username, password_hash, role) VALUES('Choolwe', 'sep2407', 'admin');

-- ---------------------------------------------------------------------
-- Seed: booths
-- ---------------------------------------------------------------------
INSERT INTO booths (booth_code, location) VALUES ('Wina1', 'Lusaka CPD');
INSERT INTO booths (booth_code, location) VALUES ('Wina2', 'Libala');
INSERT INTO booths (booth_code, location) VALUES ('Wina3', 'Kabwata');
INSERT INTO booths (booth_code, location) VALUES ('Wina4', 'Mandevu');
INSERT INTO booths (booth_code, location) VALUES ('Wina5', 'Woodlands');
INSERT INTO booths (booth_code, location) VALUES ('Wina6', 'Matero East');

-- ---------------------------------------------------------------------
-- Seed: services
-- ---------------------------------------------------------------------
INSERT INTO services (service_name, month_limit, rate) VALUES ('Airtel Money', 350000, 0.05);
INSERT INTO services (service_name, month_limit, rate) VALUES ('MTN Money', 160000, 0.06);
INSERT INTO services (service_name, month_limit, rate) VALUES ('Zamtel Money', 70000, 0.045);
INSERT INTO services (service_name, month_limit, rate) VALUES ('Zanaco', 80000, 0.035);
INSERT INTO services (service_name, month_limit, rate) VALUES ('FNB', 80000, 0.04);

-- ---------------------------------------------------------------------
-- Seed: booth_services (catalogue — which booth sells which service)
-- ---------------------------------------------------------------------
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina1', 'Airtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina1', 'MTN Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina1', 'Zamtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina1', 'Zanaco');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina1', 'FNB');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina2', 'Airtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina2', 'MTN Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina2', 'Zamtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina2', 'FNB');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina3', 'Airtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina3', 'MTN Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina3', 'Zamtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina3', 'Zanaco');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina3', 'FNB');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina4', 'Airtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina4', 'MTN Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina4', 'Zamtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina5', 'Airtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina5', 'MTN Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina5', 'Zanaco');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina5', 'FNB');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina6', 'Airtel Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina6', 'MTN Money');
INSERT INTO booth_services (booth_code, service_name) VALUES ('Wina6', 'Zamtel Money');

-- ---------------------------------------------------------------------
-- Seed: transactions (308 rows, Appendix 1)
-- ---------------------------------------------------------------------
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000001', 'Wina1', 'Airtel Money', 964);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000002', 'Wina1', 'MTN Money', 220);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000003', 'Wina2', 'MTN Money', 582);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000004', 'Wina3', 'Zamtel Money', 349);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000005', 'Wina4', 'Airtel Money', 328);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000006', 'Wina3', 'MTN Money', 192);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000007', 'Wina3', 'Zanaco', 1519);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000008', 'Wina4', 'Zamtel Money', 1113);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000009', 'Wina1', 'FNB', 1999);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000010', 'Wina3', 'Airtel Money', 3810);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000011', 'Wina6', 'Zamtel Money', 3270);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000012', 'Wina3', 'Zanaco', 1092);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000013', 'Wina2', 'Airtel Money', 1056);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000014', 'Wina3', 'Airtel Money', 509);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000015', 'Wina5', 'FNB', 34);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000016', 'Wina2', 'MTN Money', 1658);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000017', 'Wina5', 'Zamtel Money', 2167);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000018', 'Wina3', 'Airtel Money', 2594);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000019', 'Wina4', 'Airtel Money', 3656);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000020', 'Wina3', 'Airtel Money', 4030);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000021', 'Wina3', 'Zanaco', 989);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000022', 'Wina3', 'Airtel Money', 4081);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000023', 'Wina4', 'Airtel Money', 925);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000024', 'Wina2', 'MTN Money', 2312);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000025', 'Wina3', 'Zanaco', 3280);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000026', 'Wina4', 'Airtel Money', 90);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000027', 'Wina5', 'FNB', 2556);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000028', 'Wina3', 'Zanaco', 673);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000029', 'Wina4', 'MTN Money', 4185);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000030', 'Wina1', 'Zanaco', 412);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000031', 'Wina1', 'MTN Money', 310);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000032', 'Wina2', 'MTN Money', 4248);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000033', 'Wina3', 'Airtel Money', 4105);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000034', 'Wina4', 'Airtel Money', 1147);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000035', 'Wina3', 'Zamtel Money', 1815);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000036', 'Wina3', 'Zanaco', 1653);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000037', 'Wina4', 'Airtel Money', 1045);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000038', 'Wina1', 'FNB', 4364);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000039', 'Wina3', 'MTN Money', 2822);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000040', 'Wina6', 'Airtel Money', 2046);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000041', 'Wina3', 'Zamtel Money', 1985);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000042', 'Wina2', 'MTN Money', 3023);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000043', 'Wina3', 'Airtel Money', 3728);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000044', 'Wina5', 'MTN Money', 58);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000045', 'Wina2', 'Airtel Money', 2744);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000046', 'Wina5', 'FNB', 1654);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000047', 'Wina3', 'Airtel Money', 1331);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000048', 'Wina4', 'Airtel Money', 801);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000049', 'Wina3', 'MTN Money', 967);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000050', 'Wina3', 'MTN Money', 1988);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000051', 'Wina3', 'Airtel Money', 3646);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000052', 'Wina4', 'Airtel Money', 54);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000053', 'Wina2', 'Zamtel Money', 2121);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000054', 'Wina3', 'Zanaco', 564);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000055', 'Wina4', 'Airtel Money', 1011);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000056', 'Wina5', 'FNB', 2950);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000057', 'Wina3', 'Zanaco', 57);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000058', 'Wina4', 'Airtel Money', 2382);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000059', 'Wina1', 'MTN Money', 349);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000060', 'Wina1', 'Airtel Money', 2479);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000061', 'Wina2', 'Airtel Money', 1537);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000062', 'Wina3', 'Zamtel Money', 2802);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000063', 'Wina4', 'Airtel Money', 1290);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000064', 'Wina3', 'MTN Money', 4331);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000065', 'Wina3', 'Zanaco', 1338);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000066', 'Wina4', 'Airtel Money', 1477);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000067', 'Wina1', 'Airtel Money', 3430);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000068', 'Wina3', 'MTN Money', 451);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000069', 'Wina6', 'Airtel Money', 80);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000070', 'Wina3', 'Zanaco', 2002);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000071', 'Wina2', 'Airtel Money', 3235);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000072', 'Wina3', 'MTN Money', 4156);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000073', 'Wina5', 'Airtel Money', 22);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000074', 'Wina2', 'Airtel Money', 2156);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000075', 'Wina5', 'MTN Money', 2267);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000076', 'Wina3', 'Zamtel Money', 2419);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000077', 'Wina4', 'Airtel Money', 1691);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000078', 'Wina3', 'Airtel Money', 2736);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000079', 'Wina3', 'MTN Money', 4282);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000080', 'Wina3', 'Zamtel Money', 2331);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000081', 'Wina4', 'Airtel Money', 1405);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000082', 'Wina2', 'Airtel Money', 945);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000083', 'Wina3', 'Zanaco', 688);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000084', 'Wina4', 'Airtel Money', 189);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000085', 'Wina5', 'FNB', 3787);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000086', 'Wina3', 'Zanaco', 3407);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000087', 'Wina4', 'Airtel Money', 1105);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000088', 'Wina6', 'Airtel Money', 174);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000089', 'Wina2', 'MTN Money', 1440);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000090', 'Wina6', 'Airtel Money', 3344);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000091', 'Wina2', 'Airtel Money', 2676);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000092', 'Wina2', 'Airtel Money', 812);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000093', 'Wina3', 'Zanaco', 4224);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000094', 'Wina3', 'Airtel Money', 592);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000095', 'Wina3', 'Airtel Money', 1662);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000096', 'Wina2', 'Airtel Money', 1915);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000097', 'Wina3', 'Airtel Money', 1866);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000098', 'Wina6', 'MTN Money', 4320);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000099', 'Wina2', 'Airtel Money', 228);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000100', 'Wina6', 'Airtel Money', 3318);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000101', 'Wina2', 'Airtel Money', 3615);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000102', 'Wina2', 'Airtel Money', 4156);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000103', 'Wina3', 'Zamtel Money', 1401);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000104', 'Wina3', 'Airtel Money', 2014);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000105', 'Wina3', 'MTN Money', 3475);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000106', 'Wina2', 'MTN Money', 2452);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000107', 'Wina3', 'Zanaco', 1720);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000108', 'Wina2', 'Airtel Money', 118);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000109', 'Wina3', 'MTN Money', 779);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000110', 'Wina4', 'Airtel Money', 1623);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000111', 'Wina3', 'Airtel Money', 2679);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000112', 'Wina3', 'Zanaco', 1976);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000113', 'Wina4', 'Airtel Money', 974);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000114', 'Wina1', 'Airtel Money', 2911);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000115', 'Wina3', 'Zanaco', 279);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000116', 'Wina6', 'Airtel Money', 3646);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000117', 'Wina3', 'MTN Money', 855);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000118', 'Wina2', 'Airtel Money', 1412);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000119', 'Wina3', 'Airtel Money', 2137);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000120', 'Wina5', 'FNB', 1800);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000121', 'Wina2', 'Airtel Money', 1219);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000122', 'Wina5', 'FNB', 3582);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000123', 'Wina3', 'Airtel Money', 760);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000124', 'Wina4', 'MTN Money', 2308);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000125', 'Wina1', 'Zamtel Money', 1941);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000126', 'Wina3', 'Airtel Money', 2068);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000127', 'Wina6', 'MTN Money', 4242);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000128', 'Wina3', 'Airtel Money', 2587);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000129', 'Wina2', 'Zamtel Money', 4196);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000130', 'Wina3', 'Airtel Money', 1463);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000131', 'Wina5', 'FNB', 2199);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000132', 'Wina2', 'Airtel Money', 2956);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000133', 'Wina5', 'FNB', 1663);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000134', 'Wina3', 'Airtel Money', 2525);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000135', 'Wina4', 'Airtel Money', 4404);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000136', 'Wina3', 'MTN Money', 1012);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000137', 'Wina3', 'Airtel Money', 69);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000138', 'Wina3', 'Airtel Money', 4241);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000139', 'Wina4', 'MTN Money', 3379);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000140', 'Wina2', 'MTN Money', 3255);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000141', 'Wina3', 'Zanaco', 1705);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000142', 'Wina4', 'Airtel Money', 1039);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000143', 'Wina5', 'FNB', 254);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000144', 'Wina3', 'MTN Money', 870);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000145', 'Wina4', 'MTN Money', 772);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000146', 'Wina1', 'Zamtel Money', 1791);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000147', 'Wina3', 'Airtel Money', 3320);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000148', 'Wina4', 'Airtel Money', 4185);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000149', 'Wina1', 'MTN Money', 100);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000150', 'Wina3', 'MTN Money', 3794);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000151', 'Wina6', 'Airtel Money', 498);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000152', 'Wina3', 'Airtel Money', 2566);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000153', 'Wina2', 'Airtel Money', 4459);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000154', 'Wina3', 'Airtel Money', 3916);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000155', 'Wina5', 'FNB', 528);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000156', 'Wina2', 'FNB', 2067);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000157', 'Wina5', 'FNB', 1119);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000158', 'Wina3', 'Airtel Money', 1209);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000159', 'Wina4', 'Airtel Money', 1950);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000160', 'Wina3', 'MTN Money', 1268);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000161', 'Wina3', 'Zanaco', 1066);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000162', 'Wina3', 'Airtel Money', 4419);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000163', 'Wina4', 'Airtel Money', 2065);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000164', 'Wina2', 'FNB', 2663);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000165', 'Wina3', 'Airtel Money', 2075);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000166', 'Wina4', 'Zamtel Money', 3284);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000167', 'Wina5', 'Airtel Money', 425);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000168', 'Wina3', 'Zanaco', 1856);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000169', 'Wina4', 'Airtel Money', 405);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000170', 'Wina1', 'FNB', 608);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000171', 'Wina1', 'Zamtel Money', 4143);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000172', 'Wina3', 'Airtel Money', 681);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000173', 'Wina6', 'MTN Money', 4405);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000174', 'Wina3', 'Airtel Money', 3980);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000175', 'Wina2', 'Zamtel Money', 2510);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000176', 'Wina3', 'Airtel Money', 2807);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000177', 'Wina5', 'FNB', 474);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000178', 'Wina2', 'Airtel Money', 75);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000179', 'Wina5', 'FNB', 2581);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000180', 'Wina3', 'Airtel Money', 3938);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000181', 'Wina4', 'Airtel Money', 3419);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000182', 'Wina3', 'MTN Money', 1047);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000183', 'Wina3', 'Airtel Money', 205);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000184', 'Wina3', 'Airtel Money', 495);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000185', 'Wina4', 'MTN Money', 3107);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000186', 'Wina2', 'MTN Money', 2597);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000187', 'Wina3', 'Zanaco', 3049);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000188', 'Wina4', 'Airtel Money', 2713);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000189', 'Wina5', 'FNB', 1727);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000190', 'Wina3', 'MTN Money', 2060);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000191', 'Wina4', 'MTN Money', 268);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000192', 'Wina1', 'Zamtel Money', 2327);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000193', 'Wina3', 'Airtel Money', 3027);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000194', 'Wina4', 'Airtel Money', 897);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000195', 'Wina1', 'MTN Money', 2275);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000196', 'Wina3', 'MTN Money', 1246);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000197', 'Wina6', 'Airtel Money', 2768);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000198', 'Wina3', 'Airtel Money', 3082);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000199', 'Wina2', 'Airtel Money', 4307);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000200', 'Wina3', 'Airtel Money', 3664);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000201', 'Wina5', 'FNB', 3274);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000202', 'Wina2', 'FNB', 2854);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000203', 'Wina5', 'FNB', 1253);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000204', 'Wina3', 'Airtel Money', 812);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000205', 'Wina4', 'Airtel Money', 962);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000206', 'Wina3', 'MTN Money', 2219);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000207', 'Wina3', 'Zanaco', 4407);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000208', 'Wina3', 'Airtel Money', 3825);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000209', 'Wina4', 'Airtel Money', 2162);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000210', 'Wina2', 'FNB', 883);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000211', 'Wina3', 'Airtel Money', 1506);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000212', 'Wina4', 'Zamtel Money', 394);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000213', 'Wina5', 'Airtel Money', 4272);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000214', 'Wina3', 'Zanaco', 4187);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000215', 'Wina4', 'Airtel Money', 913);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000216', 'Wina1', 'FNB', 3651);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000217', 'Wina1', 'Zamtel Money', 1000);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000218', 'Wina3', 'Airtel Money', 839);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000219', 'Wina6', 'MTN Money', 1851);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000220', 'Wina3', 'Airtel Money', 1341);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000221', 'Wina2', 'Zamtel Money', 3150);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000222', 'Wina3', 'Airtel Money', 3050);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000223', 'Wina5', 'FNB', 4489);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000224', 'Wina2', 'Airtel Money', 3432);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000225', 'Wina5', 'FNB', 136);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000226', 'Wina3', 'Airtel Money', 2318);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000227', 'Wina4', 'Airtel Money', 4327);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000228', 'Wina3', 'MTN Money', 1653);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000229', 'Wina3', 'Airtel Money', 20);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000230', 'Wina3', 'Airtel Money', 1219);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000231', 'Wina4', 'MTN Money', 1508);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000232', 'Wina2', 'MTN Money', 1205);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000233', 'Wina3', 'Zanaco', 1589);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000234', 'Wina4', 'Airtel Money', 1280);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000235', 'Wina5', 'FNB', 335);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000236', 'Wina3', 'MTN Money', 2268);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000237', 'Wina4', 'MTN Money', 2815);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000238', 'Wina1', 'Zamtel Money', 4414);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000239', 'Wina3', 'Airtel Money', 654);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000240', 'Wina4', 'Airtel Money', 2180);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000241', 'Wina1', 'MTN Money', 2869);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000242', 'Wina3', 'MTN Money', 3757);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000243', 'Wina6', 'Airtel Money', 2038);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000244', 'Wina3', 'Airtel Money', 1344);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000245', 'Wina2', 'Airtel Money', 526);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000246', 'Wina3', 'Airtel Money', 192);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000247', 'Wina5', 'FNB', 866);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000248', 'Wina2', 'FNB', 3568);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000249', 'Wina5', 'FNB', 729);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000250', 'Wina3', 'Airtel Money', 3331);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000251', 'Wina4', 'Airtel Money', 336);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000252', 'Wina3', 'MTN Money', 976);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000253', 'Wina3', 'Zanaco', 89);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000254', 'Wina3', 'Airtel Money', 630);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000255', 'Wina4', 'Airtel Money', 3161);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000256', 'Wina2', 'FNB', 4200);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000257', 'Wina3', 'Airtel Money', 3887);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000258', 'Wina4', 'Zamtel Money', 4421);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000259', 'Wina5', 'Airtel Money', 1863);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000260', 'Wina3', 'Zanaco', 2465);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000261', 'Wina4', 'Airtel Money', 3775);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000262', 'Wina1', 'FNB', 2897);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000263', 'Wina1', 'Zamtel Money', 3994);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000264', 'Wina3', 'Airtel Money', 586);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000265', 'Wina6', 'MTN Money', 2562);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000266', 'Wina3', 'Airtel Money', 3867);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000267', 'Wina2', 'Zamtel Money', 4208);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000268', 'Wina3', 'Airtel Money', 4471);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000269', 'Wina5', 'FNB', 303);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000270', 'Wina2', 'Airtel Money', 4261);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000271', 'Wina5', 'FNB', 1122);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000272', 'Wina3', 'Airtel Money', 1396);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000273', 'Wina4', 'Airtel Money', 905);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000274', 'Wina3', 'MTN Money', 4002);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000275', 'Wina3', 'Airtel Money', 1591);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000276', 'Wina3', 'Airtel Money', 3353);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000277', 'Wina4', 'MTN Money', 3364);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000278', 'Wina2', 'MTN Money', 4129);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000279', 'Wina3', 'Zanaco', 1003);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000280', 'Wina4', 'Airtel Money', 2475);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000281', 'Wina5', 'FNB', 3597);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000282', 'Wina3', 'MTN Money', 1659);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000283', 'Wina4', 'MTN Money', 4163);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000284', 'Wina1', 'Zamtel Money', 487);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000285', 'Wina3', 'Airtel Money', 3790);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000286', 'Wina4', 'Airtel Money', 2186);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000287', 'Wina1', 'MTN Money', 1894);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000288', 'Wina3', 'MTN Money', 1458);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000289', 'Wina6', 'Airtel Money', 875);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000290', 'Wina3', 'Airtel Money', 189);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000291', 'Wina2', 'Airtel Money', 4479);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000292', 'Wina3', 'Airtel Money', 3733);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000293', 'Wina5', 'FNB', 640);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000294', 'Wina2', 'FNB', 413);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000295', 'Wina5', 'FNB', 880);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000296', 'Wina3', 'Airtel Money', 2921);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000297', 'Wina4', 'Airtel Money', 3428);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000298', 'Wina3', 'MTN Money', 4103);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000299', 'Wina3', 'Zanaco', 2610);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000300', 'Wina3', 'Airtel Money', 3813);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000301', 'Wina4', 'Airtel Money', 1899);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000302', 'Wina2', 'FNB', 1284);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000303', 'Wina3', 'Airtel Money', 2928);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000304', 'Wina4', 'Zamtel Money', 301);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000305', 'Wina5', 'Airtel Money', 3672);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000306', 'Wina3', 'Zanaco', 1542);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000307', 'Wina4', 'Airtel Money', 2001);
INSERT INTO transactions (transaction_id, booth_code, service_name, transaction_amount) VALUES ('WB0000308', 'Wina1', 'FNB', 3166);
