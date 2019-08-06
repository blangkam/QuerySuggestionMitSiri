	# required packages, install them with install.packages("<name>")
	library(dplyr)
	library(lubridate)
	library(readr)

	# uncomment to install the rbo implementation from GitHub if you haven't allready
	# devtools::install_github("https://github.com/neverfox/rbo")

	# Einlesen der Daten, hier ist der absolute Pfad der einzulesenden CSV-Datei anzugeben
	dat <- read_csv("dauerthemen_gesamt.csv")

	daten <- c("2019-05-26", "2019-05-27", "2019-05-28", "2019-05-29", "2019-05-30", "2019-05-31", "2019-06-01", "2019-06-02", "2019-06-03", "2019-06-04", "2019-06-05", 
		"2019-06-06", "2019-06-07", "2019-06-08", "2019-06-09", "2019-06-10", "2019-06-11", "2019-06-12", "2019-06-13", "2019-06-14", "2019-06-15", "2019-06-16", 
		"2019-06-17", "2019-06-18", "2019-06-19", "2019-06-20", "2019-06-21", "2019-06-22", "2019-06-23")

	suchbegriffe <- c("Instagram", "Cristiano Ronaldo", "Ariana Grande", "Selena Gomez", "The Rock", "Kim Kardashian West", "Kylie Jenner", "Beyoncé", "Taylor Swift", 
		"Leo Messi", "Neymar jr", "Kendall Jenner", "Justin Bieber", "National Geographic", "Barbie", "Khloe Kardashian", "Jennifer Lopez", "Miley Cyrus", "Nike", 
		"Katy Perry")

	for (suchbegriff in suchbegriffe) {
		rbo2suchbegriff <- character()
		print(suchbegriff)
		rbo2suchbegriff <- c(rbo2suchbegriff, suchbegriff)
		for (datum in daten) {
			# ranking 1 Auswahl der zu vergleichenden Plattform
			ranking1 <- dat %>% filter(Plattform == "siri_tab", Datum == as_datetime(datum), Suchbegriff == suchbegriff) %>% pull(Vorschlag)

			# ranking 2 Auswahl der zu vergleichenden Plattform
			ranking2 <- dat %>% filter(Plattform == "siri_simulator", Datum == as_datetime(datum), Suchbegriff == suchbegriff) %>% pull(Vorschlag)

			# Rbo berechnen			
			print(rbo::rbo_ext(ranking1, ranking2, p = 1))
			rbo2suchbegriff <- c(rbo2suchbegriff, rbo::rbo_ext(ranking1, ranking2, p = 1))
		}
		# Ergebnis in CSV speichern. Absoluten Pfad für Speicherort angeben
		write.table(rbind(rbo2suchbegriff), file = "rbo_Siri_Tab-siri_simulator-1.0.csv", row.names = FALSE, col.names = FALSE, 
			sep = ",", append = TRUE)
	}
