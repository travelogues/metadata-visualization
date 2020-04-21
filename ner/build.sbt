name := "stanford-ner-trial"

organization := "ait.ac.at"

version := "0.1"

scalaVersion := "2.12.10"

ensimeIgnoreScalaMismatch in ThisBuild := true

mainClass in (Compile, packageBin) := Some("travelogues.ner.RunNER")

libraryDependencies ++= Seq(
  "com.nrinaudo" %% "kantan.csv" % "0.6.0",
  "com.nrinaudo" %% "kantan.csv-commons" % "0.6.0",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.9.1",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.9.1" classifier "models",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.9.1" classifier "models-german",
  "ch.qos.logback" % "logback-classic" % "1.2.3"
)