import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
val lines = sc.textFile("twitter.edges")

val followed = lines.flatMap { l =>
	val p = l.split(": ")
	p(1).split(",").map( u => (u, 1) )
}

val topUsers = followed.reduceByKey((a, b) => a + b).filter { case (u, c) => c > 1000 }
topUsers.saveAsTextFile("output")

System.exit(0)

