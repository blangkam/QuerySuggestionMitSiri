# QuerySuggestionMitSiri

Material zur Datensammlung und Suchmaschinenvergleich von Query Auto Completion im Rahmen einer Bachelorarbeit zu Query Suggestion mit Siri

Ordner Skript_Datenerhebung:
* suchmaschinenAbfrage.js --> Anfrageskript an API-URL 
* dauer.txt --> txt mit verwendeten Anfragetermen
* dauerthemen_gesamt.csv --> Datei mit allen gesammelten Daten zu o.g. Termen

Ordner Frequenz_Schnittmengenanalyse: 
* FrequenzSchnittmengenAnalyse.xlsx --> Auswertung von Gesamtdaten zu Frequenz und Schnittmenge

Ordner RBO (Rank-biased Overlap) - basierend auf "A Similarity Measure for Indefinite Rankings" (Webber et al.):
* dauerthemen_gesamt.csv --> gleichnamige Datei für Input zur RBO Berechnung
* rbo.R --> Skript zur Berechnung RBO
* rbo_plot.R --> R-Skript um ermittlelte RBO-Werte graphisch darzustellen
Ergebnisse RBO-Berechung (können mit o.g. Dateien reprodutuiert werden)
* rbo_Siri_Tab-Bing-0.75.csv
* rbo_Siri_Tab-Bing-1.0.csv
* rbo_Siri_Tab-DuckDuckGo-0.75.csv
* rbo_Siri_Tab-DuckDuckGo-1.0.csv
* rbo_Siri_Tab-Google-0.75.csv
* rbo_Siri_Tab-Google-1.0.csv
* rbo_Siri_Tab-siri_simulator-0.75.csv	
* rbo_Siri_Tab-siri_simulator-1.0.csv
* rbo_Siri_Simulator-Bing-0.75.csv
* rbo_Siri_Simulator-Bing-1.0.csv		
* rbo_Siri_Simulator-DuckDuckGo-0.75.csv	
* rbo_Siri_Simulator-DuckDuckGo-1.0.csv	
* rbo_Siri_Simulator-Google-0.75.csv	
* rbo_Siri_Simulator-Google-1.0.csv"

Ordner Scoring: 
* scoring.R --> R-Skript zur Score-Berechnung der Kategorie 1-10
* bereinigteGesamtScoring.csv --> Sammlung der um die Kategorie erweiterte Datenerhebung
* ScoringErgebnis.csv --> Ergebnisse Score Berechnung in R, die während der Bachelorarbeit durchgeführt wurde (können mittels der o.g. Dateien reproduziert werden)

