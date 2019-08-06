// Defintion der verwendeten Bibliotheken
const https = require('https');
const http = require('http');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const lineReader = require('line-reader');

// Variablendedeklaration Datum für Dateinamen und Zeitstempel
var datum = new Date();
// Datum für Eintrag in CSV Datei
var datum4CSV = datum.toISOString();
// Datum für Dateinamen, hier reicht Jahr,Monat und Tag
var datum4Filename = datum.getFullYear() + "-" + (datum.getMonth() + 1) + "-" + datum.getDate();

//dem Skript übergebener Wert für die Suchmaschine, https://stackabuse.com/command-line-arguments-in-node-js/
var suchmaschine = process.argv[3];
if (suchmaschine != null) {
  suchmaschine = suchmaschine.toLowerCase();
}

// dem Skript übergebener Wert für txt-Dateien. Enthalten Suchbegriffe, die abgefragt werden sollen
// sucht nach dauer.txt oder trends.txt im gleichen Verzeichnis
var suchbegriffListePfad = process.argv[2];
// splittet den mitgegeben String am Punkt zur weteren Verwendung im Dateinamen der neuen csv, liefert Array mit zwei Werten zurück (dauer, txt)
var suchbegriffListeName = suchbegriffListePfad.split(".")[0];

// Entscheidung, welche Suchmaschine verwendet werden soll.
if (suchmaschine == "ddg") {
  starteDuckDuckGo();
} else {
  if (suchmaschine == "bing") {
    starteBing();
  } else {
    if (suchmaschine == "google") {
      starteGoogle();
    } else {
      if (suchmaschine == "yahoo") {
        starteYahoo();
      } else {
        // Wenn keine Übergabe, dann starte alle Suchmaschinen
        starteDuckDuckGo();
        starteBing();
        starteGoogle();
      }
    }
  }
}


// DUCKDUCKGO //
function starteDuckDuckGo() {
  console.log("DUCKDUCKGO");
  // Filestream Writer, https://stackoverflow.com/questions/2496710/writing-files-in-node-js 
  var fs = require('fs'); 
  var stream = fs.createWriteStream("Suggestions/" + datum4Filename + "-DUCKDUCKGO_" + suchbegriffListeName + ".csv");
  stream.once('open', function (fd) {
    //Kopfzeile mit Zeilenumbruch in die neu angelegte CSV-Datei schreiben
    stream.write("Plattform, Suchbegriff, Datum, Vorschlag, Position\n"); 

    // Über jeden Eintrag (Suchbegriff) in der dauer oder trends Liste iterieren. https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
    lineReader.eachLine(suchbegriffListePfad, function (suchbegriff) { 
      console.log("https://api.duckduckgo.com/ac/?q=" + suchbegriff.toLowerCase() + "&kl=de-de&format=json&pretty=1");
      // API Aufruf https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html //resp = Antwort
      https.get('https://api.duckduckgo.com/ac/?q=' + suchbegriff.toLowerCase() + '&kl=de-de&format=json&pretty=1', (resp) => { 
         // Ausgabe aktuell betrachteter Suchbegriff
        console.log("" + suchbegriff);
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // Auf der Antwort resp weiterarbeiten
        resp.on('end', () => {

          // Antwort in Variable parsedData parsen , https://www.codementor.io/codementorteam/how-to-use-json-files-in-node-js-85hndqt32
          let parsedData = JSON.parse(data); 
          // Ergebnis auf der Konsole ausgeben
          console.log(parsedData);

          // Wenn kein Ergebnis vorliegt, wird "Kein Eintrag" in der CSV zum entsprechenden Suchbegriff hinterlegt
          if (parsedData.length == 0) {
            stream.write("DuckDuckGo, " + suchbegriff + ", " + datum4CSV + ", " + "###Kein Eintrag###, 1 \n");
          } else {
            for (var i = 0; i < parsedData.length; i++) {
              // Laufe über jede Antwortzeile
              var zeileneintrag = parsedData[i];
              // Umwandlung string in JSON-string
              var zeileineintragJson = JSON.stringify(zeileneintrag); 
              var parsed = JSON.parse(zeileineintragJson);
              // Hole den Wert zum Eintrag phrase
              var phraseWert = parsed.phrase;
              // phraseWert splitten (Enthält Suchbegriff und Vorschlag)
              var splittet = phraseWert.split(suchbegriff.toLowerCase()); 
              // Position in der csv-Liste
              var rang2suchbegriff = i + 1; 
              // Vorschläge mit Rank in CSV Datei schreiben
              stream.write("DuckDuckGo, " + suchbegriff + ", " + datum4CSV + ", " + splittet[1] + ", " + rang2suchbegriff + "\n");
            }
          }
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
  });
}

// BING //
function starteBing() {
  console.log("BING");
  // Filestream Writer, https://stackoverflow.com/questions/2496710/writing-files-in-node-js Hit 228 Upvotes
  var fs = require('fs');
  var stream = fs.createWriteStream("Suggestions/" + datum4Filename + "-BING_" + suchbegriffListeName + ".csv");
  stream.once('open', function (fd) {
    //Kopfzeile mit Zeilenumbruch in die neu angelegte CSV-Datei schreiben
    stream.write("Plattform, Suchbegriff, Datum, Vorschlag, Position\n");
    // Über jeden Eintrag (Suchbegriff) in der dauer oder trends Liste iterieren. https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
    lineReader.eachLine(suchbegriffListePfad, function (suchbgefriff) {
      console.log("http://api.bing.net/osjson.aspx?q=" + suchbgefriff.toLowerCase());
      // API Aufruf https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html //resp = Antwort
      http.get('http://api.bing.net/osjson.aspx?q=' + suchbgefriff.toLowerCase(), (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        
        resp.on('data', (chunk) => {
          data += chunk;
        });
        // Auf der Antwort resp weiterarbeiten
        resp.on('end', () => {

          // Antwort in Variable parsedData parsen , https://www.codementor.io/codementorteam/how-to-use-json-files-in-node-js-85hndqt32
          let parsedData = JSON.parse(data);
          // Ergebnis auf der Konsole ausgeben
          console.log(parsedData);
          let par = parsedData[1];

          for (var i = 1; i < par.length; i++) {
            // zeilenweise Durchlaufen des Ergebnis-Arrays 
            var zeileneintrag = par[i]; 
            // zeileneintrag splitten (Enthält Suchbegriff und Vorschlag)
            var splited = zeileneintrag.split(suchbgefriff.toLowerCase());
            // Vorschläge mit Rang in CSV Datei schreiben
            stream.write("Bing, " + suchbgefriff + ", " + datum4CSV + ", " + splited[1] + ", " + i + "\n"); // // splittet in Array Query [0], Suggestion [1]
          }
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
  });

}


// Google //
function starteGoogle() {
  console.log("GOOGLE");
  // Filestream Writer, https://stackoverflow.com/questions/2496710/writing-files-in-node-js
  var fs = require('fs');
  var stream = fs.createWriteStream("Suggestions/" + datum4Filename + "-GOOGLE_" + suchbegriffListeName + ".csv");
  stream.once('open', function (fd) {
    //Kopfzeile mit Zeilenumbruch in die neu angelegte CSV-Datei schreiben
    stream.write("Plattform, Suchbegriff, Datum, Vorschlag, Position\n");
    // Über jeden Eintrag (Suchbegriff) in der dauer oder trends Liste iterieren. https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
    lineReader.eachLine(suchbegriffListePfad, function (suchbegriff) {
      console.log("https://www.google.com/complete/search?q=" + suchbegriff + "&client=psy-ab");
      // API Aufruf https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html //resp = Antwort
      https.get('https://www.google.com/complete/search?q=' + suchbegriff + '&client=psy-ab', (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // Auf der Antwort resp weiterarbeiten
        resp.on('end', () => {
          let parsedData = JSON.parse(data);
          // Stufe "tiefer" ins Array mit [1], [0] liefert nicht das gewünschte Ergebnis-Array (öffnet eine zusätzliche eckicke Klammer)
          var par = parsedData[1]; 
          // Ergebnis auf der Konsole ausgeben
          console.log(parsedData);
          for (var i = 1; i < par.length; i++) {
            // zeilenweise Durchlaufen des Ergebnis-Arrays
            var zeileneintrag = par[i];
            // Google Besonderheit: Antwortzeile ist eigenes Array. Erstes Element enthält Suchvorschlag
            var splited = zeileneintrag[0].split("<b>"); 
            var vorschlagMitTag = splited[1];
            if (vorschlagMitTag != null) {
              // Säuberung </b> ist im Array [1], nur [0] ist von Interesse, weil der relevante Vorschlag
              var vorschlag = vorschlagMitTag.split("</b>"); 
               // Vorschläge mit Rang in CSV Datei schreiben
              stream.write("Google, " + suchbegriff + ", " + datum4CSV + ", " + vorschlag[0] + ", " + i + "\n");
            }
          }
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
  });
}

// Yahoo //
function starteYahoo() {
  console.log("Yahoo");
  // Filestream Writer, https://stackoverflow.com/questions/2496710/writing-files-in-node-js
  var fs = require('fs');
  var stream = fs.createWriteStream("Suggestions/" + datum4Filename + "-YAHOO_" + suchbegriffListeName + ".csv");
  stream.once('open', function (fd) {
    //Kopfzeile mit Zeilenumbruch in die neu angelegte CSV-Datei schreiben
    stream.write("Plattform, Suchbegriff, Datum, Vorschlag, Position\n");
    // Über jeden Eintrag (Suchbegriff) in der dauer oder trends Liste iterieren. https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
    lineReader.eachLine(suchbegriffListePfad, function (line) {
      // API Aufruf https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html //resp = Antwort
      // https://chromium.googlesource.com/chromium/src/+/master/components/search_engines/prepopulated_engines.json
      console.log("https://de.search.yahoo.com/sugg/chrome?output=fxjson&command=" + line.toLowerCase());
      https.get('https://de.search.yahoo.com/sugg/chrome?output=fxjson&command=' + line.toLowerCase(), (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
        // Auf der Antwort resp weiterarbeiten
        resp.on('end', () => {
          let parsedData = JSON.parse(data);
          console.log("Suchbegriff " + line.toLowerCase());
          // Ergebnis auf der Konsole ausgeben
          console.log(parsedData);

          var eintraege = parsedData[1];
          // Vorschläge ab Zeile 2, daher Laufzähler ab 1
          for (var i = 1; i < eintraege.length; i++) {
            // zeilenweise Durchlaufen des Ergebnis-Arrays 
            var zeileneintrag = eintraege[i]; 
            // splittet in Array Query [0], Suggestion [1]
            var splited = zeileneintrag.split(line.toLowerCase());
             // Vorschläge mit Rang in CSV Datei schreiben
            stream.write("Yahoo, " + line + ", " + datum4CSV + ", " + splited[1] + ", " + i + "\n"); // 
          }
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
  });

}