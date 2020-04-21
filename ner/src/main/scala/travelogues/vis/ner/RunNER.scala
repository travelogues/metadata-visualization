package travelogues.vis.ner

import kantan.csv.CsvConfiguration
import kantan.csv.CsvConfiguration.{Header, QuotePolicy}
import kantan.csv.ops._
import kantan.csv.engine.commons._
import edu.stanford.nlp.pipeline.{CoreDocument, StanfordCoreNLP}
import edu.stanford.nlp.util.StringUtils
import edu.stanford.nlp.ling.{CoreAnnotations, CoreLabel}
import java.io.{File, FileInputStream, PrintWriter}
import org.slf4j.LoggerFactory
import scala.collection.JavaConverters._
import scala.io.Source

case class Entity(chars: String, tag: String) {

  def append(entity: Entity) = 
    Entity(s"${chars} ${entity.chars}", tag)

 override def equals(other: Any): Boolean = other match {
   case o : Entity => chars == o.chars && tag == o.tag
   case _ => false
 }

}

object Entity {

  def fromToken(token: CoreLabel) = Entity(
    token.get(classOf[CoreAnnotations.TextAnnotation]),
    token.get(classOf[CoreAnnotations.NamedEntityTagAnnotation]))

}

object RunNER {

  private val log = LoggerFactory.getLogger(this.getClass)

  private lazy val props = {
    val props = StringUtils.argsToProperties(Seq("-props", "StanfordCoreNLP-german.properties"):_*)
    props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner")
    props
  }

  private lazy val pipeline = {
    log.info("Initializing NER pipeline")
    val pipeline = new StanfordCoreNLP(props)
    log.info("Pipeline initialized")
    pipeline
  }

  /** Gets a PrintWriter to the outfile, first removing the file if it exists already **/
  def openOutfile(path: String): PrintWriter = {
    val f = new File(path)
    if (f.exists)
      f.delete()

    new PrintWriter(new File(path))
  }

  def loadRows(csv: String) = {
    // Comma-separated, optionally quoted cells
    val headerConfig = CsvConfiguration(',', '"', QuotePolicy.WhenNeeded, Header.None)
    new FileInputStream(new File(csv)).asCsvReader[Seq[String]](headerConfig)
  }

  def normalize(text: String) = 
    text.replaceAll("/", " ")
        .replaceAll("\\-\\\\n", "")
        .replaceAll("[,.!?:;]\\\\n", "")
        .replaceAll("\\n", "")

  def main(args: Array[String]): Unit = {

    val CSV = "../data/TravelogueD16_filtered.csv"
    val OUT = "../data/TravelogueD16_filtered_entities.csv"

    val outfile = openOutfile(OUT)
    outfile.write("Systemnummer,Locations,Persons\n")

    loadRows(CSV).foreach({ _ match {
      case Right(row) => 
        val title = normalize(row(row.size - 2))
        val longTitle = normalize(row(row.size - 1))

        val document = new CoreDocument(s"${title} ${longTitle}")
        pipeline.annotate(document)

        val tokens = document.tokens().asScala.foldLeft(Seq.empty[Entity]) { (result, token) =>
          val entity = Entity.fromToken(token)

          result.headOption match {
            case Some(prev) if prev.tag == entity.tag =>
              // Append to previous phrase if entity tag is the same
              prev.append(entity) +: result.tail

            case _ =>
              // Either this is the first token or a new phrase
              entity +: result
          }
        }

        val entities = tokens.filter(_.tag != "O").distinct
        if (entities.size > 0) {
          val locations = entities.filter(_.tag == "LOCATION").map(_.chars).mkString(";")
          val people = entities.filter(_.tag == "PERSON").map(_.chars).mkString(";")
          outfile.write(row(0) + ",\"" + locations + "\",\"" + people + "\"\n")
        }

      case _ =>
        println("Error parsing row")
    }})

    outfile.close()
  }

}

