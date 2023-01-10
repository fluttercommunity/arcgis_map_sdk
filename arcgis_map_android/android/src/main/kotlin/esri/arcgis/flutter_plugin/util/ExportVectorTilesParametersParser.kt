package esri.arcgis.flutter_plugin.util

import com.esri.arcgisruntime.tasks.vectortilecache.ExportVectorTilesParameters


class ExportVectorTilesParametersParser {
    companion object {
        fun parse(map: Map<String, Any>): ExportVectorTilesParameters {
            val areaOfInterest = EnvelopeParser.parse(map["areaOfInterest"] as Map<String, Any>)
            val maxLevel = map["maxLevel"] as Int

            val parameters = ExportVectorTilesParameters()
            parameters.maxLevel = maxLevel
            parameters.areaOfInterest = areaOfInterest
            return parameters
        }
    }
}
