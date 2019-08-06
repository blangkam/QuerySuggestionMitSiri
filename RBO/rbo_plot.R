	# required packages, install them with install.packages("<name>")
	library(dplyr)
	library(lubridate)
	library(readr)

	# Einlesen der Daten, hier ist der absolute Pfad der einzulesenden CSV-Datei anzugeben
	dat <- read.csv(file = "rbo_Siri_Tab-siri_simulator-0.75.csv", header = FALSE)
	#dat <- read.csv(file = "rbo_Siri_Tab-Google-0.75.csv", header = FALSE)
	#dat <- read.csv(file = "rbo_Siri_Tab-DuckDuckGo-0.75.csv", header = FALSE)
	#dat <- read.csv(file = "rbo_Siri_Tab-Bing-0.75.csv", header = FALSE)
	#dat <- read.csv(file = "rbo_Siri_Simulator-Google-0.75.csv", header = FALSE)
	#dat <- read.csv(file = "rbo_Siri_Simulator-DuckDuckGo-0.75.csv", header = FALSE)
	#dat <- read.csv(file = "rbo_Siri_Simulator-Bing-0.75.csv", header = FALSE)

	# Array mit Datum Einträgen über Erhebungszeitraum
	daten <- c("2019-05-26", "2019-05-27", "2019-05-28", "2019-05-29", "2019-05-30", "2019-05-31", "2019-06-01", "2019-06-02", "2019-06-03", "2019-06-04", 
		"2019-06-05", "2019-06-06", "2019-06-07", "2019-06-08", "2019-06-09", "2019-06-10", "2019-06-11", "2019-06-12", "2019-06-13", "2019-06-14", "2019-06-15", 
		"2019-06-16", "2019-06-17", "2019-06-18", "2019-06-19", "2019-06-20", "2019-06-21", "2019-06-22", "2019-06-23")

	# Plotte in Tiff standardmäßig in Benutzerverzeichnis
	tiff("rplot.tiff", units = "in", width = 10, height = 8, res = 150)
	
	# Für Achsenbeschriftung muss dateArray in Datum umgewandelt werden
	daten4plot <- as.Date(daten)
	
	# Anordnung der Fenster und Rahmengröße
	par(mfrow = c(4, 5), mar = c(7, 4, 2.5, 2))
	
	# Iterierrt über Suchbegriffe
	for (i in 1:20) {
		# Lädt RBO über Betrachtungstage zu einem Suchbegriff
		rbo <- as.numeric(dat[i, 2:30])
	
		# Plotte Ergebnis in Main steht der jeweilige Suchbegriff als Titel
		plot(daten4plot, rbo, type = "l", ylim = c(0, 1), ylab = "Rbo", xlab = "", yaxt = "n", xaxt = "n")
		
		# Achsenabschnitte selbst definiert. 1 steht für X-Achse, 2 für Y-Achse
		axis(2, seq(0, 1, by = 0.1), seq(0, 1, by = 0.1), las = 2)
		axis(1, seq(daten4plot[1], daten4plot[29], by = 4), seq(daten4plot[1], daten4plot[29], by = 4), las = 3)
		mtext(paste(dat[i, 1]), side = 3, line = 1, cex = 1)
		mtext("Siri_Sim / Siri_Tab p=0.75", cex = 0.5, side = 3)
	}
	dev.off()
