	# required packages, install them with install.packages("<name>")
	
	library(dplyr)
	library(lubridate)
	library(readr)

	# Einlesen der Daten, hier ist der absolute Pfad der einzulesenden CSV-Datei anzugeben
	dat <- read.csv2("bereinigteGesamtScoring.csv")

	daten <- c("2019-05-26", "2019-05-27", "2019-05-28", "2019-05-29", "2019-05-30", "2019-05-31", "2019-06-01", "2019-06-02", "2019-06-03", "2019-06-04", "2019-06-05", 
		"2019-06-06", "2019-06-07", "2019-06-08", "2019-06-09", "2019-06-10", "2019-06-11", "2019-06-12", "2019-06-13", "2019-06-14", "2019-06-15", "2019-06-16", 
		"2019-06-17", "2019-06-18", "2019-06-19", "2019-06-20", "2019-06-21", "2019-06-22", "2019-06-23")

	suchbegriffe <- c("Instagram", "Cristiano Ronaldo", "Ariana Grande", "Selena Gomez", "The Rock", "Kim Kardashian West", "Kylie Jenner", "Beyoncé", "Taylor Swift", 
		"Leo Messi", "Neymar jr", "Kendall Jenner", "Justin Bieber", "National Geographic", "Barbie", "Khloe Kardashian", "Jennifer Lopez", "Miley Cyrus", "Nike", 
		"Katy Perry")

	suchmaschinen <- c("siri_simulator", "siri_tab", "DuckDuckGo", "Bing", "Google")

	katScore = 0
	summeKatScore = 0
	kategorie <- c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
	ergebnisCSV = character()
	
	# Kopfzeile schreiben
	ergebnisCSV <- c(ergebnisCSV, paste0("Plattform;Suchbegriff;Kat1;Kat2;Kat3;Kat4;Kat5;Kat6;Kat7;Kat8;Kat9;Kat10"))

	for (suchmaschine in suchmaschinen) {
		print(suchmaschine)
		for (suchbegriff in suchbegriffe) {
			print(suchbegriff)

			#Definition Array der Ergebnisse für Durchschnittsscores über den gesamten Betrachtungszeitraum für einen Suchbegriff
			alle2Kat = character()
			for (katNr in kategorie) {
				summeKatScore = 0
				for (datum in daten) {

					# Rückgabe der Kategorien für einen Tag, Suchmaschine, Suchbegriff
					kategorien2tag <- select(filter(dat, Plattform == suchmaschine, Suchbegriff == suchbegriff, Datum == datum), c(Kategorie))

					# katScore repräsentiert einen Laufzähler zur Ermittlung ob betrachtete Kategorie zutrifft
					katScore = 0
					for (rang in 1:nrow(kategorien2tag)) {
						# Falls Kategorie zutrifft, wird der Laufzähler um 1 erhöht
						if (kategorien2tag[rang, 1] == katNr) {
							katScore = katScore + 1
						}
					}
					# Der Laufzähler wird nach jedem Durchlauf (Tag) durch die Anzahl der gegebenen Ränge geteilt.
					# Das Ergebnis wird zur Summe des Kategorienscore addiert.
summeKatScore = summeKatScore + (katScore/nrow(kategorien2tag))
				}
				# Durchschnittsscore zu einer Kategorie über den gesamten Erhebungszeitraum von 29 Tagen
				meanScore = format(round((summeKatScore/29), 3), nsmall = 3)
				alle2Kat <- c(alle2Kat, meanScore)

				print(paste0("Suchbegriff: ", suchbegriff, " Kategorie: ", katNr, " Score: ", meanScore))
			}
			# Name der Suchmaschine, Suchbegriff und Sammlung der errechneten Scores zu den 10 Kategorien in Ergebnisliste schreiben
			ergebnisCSV <- c(ergebnisCSV, paste(c(suchmaschine, suchbegriff, alle2Kat), sep = ";", collapse = ";"))
		}
	}
	# Ergebnisse in CSV-Datei schreiben, hier absoluten Speicherort für CSV-Datei angeben
	write.table(ergebnisCSV, file = "ScoringErgebnis.csv", row.names = FALSE, na = "", col.names = FALSE, 
		sep = ",")




