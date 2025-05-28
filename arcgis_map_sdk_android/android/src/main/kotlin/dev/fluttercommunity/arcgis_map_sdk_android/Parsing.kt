package dev.fluttercommunity.arcgis_map_sdk_android

import com.arcgismaps.mapping.BasemapStyle
import com.arcgismaps.mapping.symbology.SimpleLineSymbolMarkerPlacement
import com.arcgismaps.mapping.symbology.SimpleLineSymbolMarkerStyle
import com.arcgismaps.mapping.symbology.SimpleLineSymbolStyle
import com.arcgismaps.mapping.view.AnimationCurve
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.TypeAdapter
import com.google.gson.reflect.TypeToken
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter

val gson: Gson by lazy {
    GsonBuilder()
        .registerTypeAdapter(BasemapStyleAdapter())
        .registerTypeAdapter(AnimationCurveAdapter())
        .registerTypeAdapter(MarkerPlacementAdapter())
        .registerTypeAdapter(MarkerStyleAdapter())
        .registerTypeAdapter(PolylineStyleAdapter())
        .create()
}

private inline fun <reified T> GsonBuilder.registerTypeAdapter(typeAdapter: TypeAdapter<T>) =
    registerTypeAdapter(T::class.java, typeAdapter)

inline fun <reified O> Map<String, Any>.parseToClass(): O = parseToClass(this)

inline fun <reified O> parseToClass(payload: Any): O {
    val json = gson.toJson(payload)
    return gson.fromJson(json, object : TypeToken<O>() {}.type)
}

fun toMap(data: Any): Map<Any, Any> {
    val jsonString = gson.toJson(data)
    return gson.fromJson(jsonString, object : TypeToken<Map<Any, Any>>() {}.type)
}

class AnimationCurveAdapter : TypeAdapter<AnimationCurve>() {
    override fun write(out: JsonWriter, value: AnimationCurve) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): AnimationCurve {
        val jsonValue = reader.nextString()
        return parseAnimationCurve(jsonValue)
    }
}

class BasemapStyleAdapter : TypeAdapter<BasemapStyle>() {
    override fun write(out: JsonWriter, value: BasemapStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): BasemapStyle? {
        val jsonValue = reader.nextString()
        return parseBasemapStyle(jsonValue)
    }
}

class MarkerPlacementAdapter : TypeAdapter<SimpleLineSymbolMarkerPlacement>() {
    override fun write(out: JsonWriter, value: SimpleLineSymbolMarkerPlacement) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): SimpleLineSymbolMarkerPlacement {
        val jsonValue = reader.nextString()
        return parseSimpleLineSymbolMarkerPlacement(jsonValue)
    }
}

fun SimpleLineSymbolMarkerPlacement.getJsonValue(): String {
    return when (this) {
        SimpleLineSymbolMarkerPlacement.Begin -> "begin"
        SimpleLineSymbolMarkerPlacement.End -> "end"
        SimpleLineSymbolMarkerPlacement.BeginAndEnd -> "beginEnd"
    }
}

fun parseSimpleLineSymbolMarkerPlacement(jsonValue: String): SimpleLineSymbolMarkerPlacement {
    return when (jsonValue.lowercase()) {
        "begin" -> SimpleLineSymbolMarkerPlacement.Begin
        "end" -> SimpleLineSymbolMarkerPlacement.End
        "beginEnd" -> SimpleLineSymbolMarkerPlacement.BeginAndEnd
        else -> SimpleLineSymbolMarkerPlacement.Begin
    }
}

class MarkerStyleAdapter : TypeAdapter<SimpleLineSymbolMarkerStyle>() {
    override fun write(out: JsonWriter, value: SimpleLineSymbolMarkerStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): SimpleLineSymbolMarkerStyle {
        val jsonValue = reader.nextString()
        return if (jsonValue == "arrow") {
            SimpleLineSymbolMarkerStyle.Arrow
        } else {
            SimpleLineSymbolMarkerStyle.None
        }
    }
}

fun SimpleLineSymbolMarkerStyle.getJsonValue(): String {
    return when (this) {
        SimpleLineSymbolMarkerStyle.None -> "none"
        SimpleLineSymbolMarkerStyle.Arrow -> "arrow"
    }
}

class PolylineStyleAdapter : TypeAdapter<SimpleLineSymbolStyle>() {
    override fun write(out: JsonWriter, value: SimpleLineSymbolStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): SimpleLineSymbolStyle {
        val jsonValue = reader.nextString()
        return parseSimpleLineSymbolStyle(jsonValue)
    }
}

fun SimpleLineSymbolStyle.getJsonValue(): String {
    return when (this) {
        SimpleLineSymbolStyle.Dash -> "dash"
        SimpleLineSymbolStyle.DashDot -> "dashDot"
        SimpleLineSymbolStyle.Dot -> "dot"
        SimpleLineSymbolStyle.DashDotDot -> "dashDotDot"
        SimpleLineSymbolStyle.LongDash -> "longDash"
        SimpleLineSymbolStyle.LongDashDot -> "longDashDot"
        SimpleLineSymbolStyle.Null -> "none"
        SimpleLineSymbolStyle.ShortDash -> "shortDash"
        SimpleLineSymbolStyle.ShortDashDot -> "shortDashDot"
        SimpleLineSymbolStyle.ShortDashDotDot -> "shortDashDotDot"
        SimpleLineSymbolStyle.ShortDot -> "shortDot"
        SimpleLineSymbolStyle.Solid -> "solid"
    }
}

fun parseSimpleLineSymbolStyle(value: String): SimpleLineSymbolStyle {
    return when (value) {
        "dash" -> SimpleLineSymbolStyle.Dash
        "dashDot" -> SimpleLineSymbolStyle.DashDot
        "dot" -> SimpleLineSymbolStyle.Dot
        "dashDotDot" -> SimpleLineSymbolStyle.DashDotDot
        "longDash" -> SimpleLineSymbolStyle.LongDash
        "longDashDot" -> SimpleLineSymbolStyle.LongDashDot
        "none" -> SimpleLineSymbolStyle.Null
        "shortDash" -> SimpleLineSymbolStyle.ShortDash
        "shortDashDot" -> SimpleLineSymbolStyle.ShortDashDot
        "shortDashDotDot" -> SimpleLineSymbolStyle.ShortDashDotDot
        "shortDot" -> SimpleLineSymbolStyle.ShortDot
        "solid" -> SimpleLineSymbolStyle.Solid
        else -> SimpleLineSymbolStyle.Dash
    }
}


fun AnimationCurve.getJsonValue(): String {
    return when (this) {
        AnimationCurve.Linear -> "linear"
        AnimationCurve.EaseInExpo -> "easy"
        AnimationCurve.EaseInCirc -> "easeIn"
        AnimationCurve.EaseOutCirc -> "easeOut"
        AnimationCurve.EaseInOutCirc -> "easeInOut"
        else -> "linear"
    }
}

fun parseAnimationCurve(value: String): AnimationCurve {
    return when (value.lowercase()) {
        "linear" -> AnimationCurve.Linear
        "easy" -> AnimationCurve.EaseInExpo
        "easein" -> AnimationCurve.EaseInCirc
        "easeout" -> AnimationCurve.EaseOutCirc
        "easeinout" -> AnimationCurve.EaseInOutCirc
        else -> AnimationCurve.Linear
    }
}

private val basemapStyleMapping = mapOf(
    BasemapStyle.ArcGISImagery to "arcgisImagery",
    BasemapStyle.ArcGISImageryStandard to "arcgisImageryStandard",
    BasemapStyle.ArcGISImageryLabels to "arcgisImageryLabels",
    BasemapStyle.ArcGISLightGray to "arcgisLightGray",
    BasemapStyle.ArcGISLightGrayBase to "arcgisLightGrayBase",
    BasemapStyle.ArcGISLightGrayLabels to "arcgisLightGrayLabels",
    BasemapStyle.ArcGISDarkGray to "arcgisDarkGray",
    BasemapStyle.ArcGISDarkGrayBase to "arcgisDarkGrayBase",
    BasemapStyle.ArcGISDarkGrayLabels to "arcgisDarkGrayLabels",
    BasemapStyle.ArcGISNavigation to "arcgisNavigation",
    BasemapStyle.ArcGISNavigationNight to "arcgisNavigationNight",
    BasemapStyle.ArcGISStreets to "arcgisStreets",
    BasemapStyle.ArcGISStreetsRelief to "arcgisStreetsRelief",
    BasemapStyle.ArcGISStreetsReliefBase to "arcgisStreetsReliefBase",
    BasemapStyle.ArcGISStreetsNight to "arcgisStreetsNight",
    BasemapStyle.ArcGISTopographic to "arcgisTopographic",
    BasemapStyle.ArcGISTopographicBase to "arcgisTopographicBase",
    BasemapStyle.ArcGISOceans to "arcgisOceans",
    BasemapStyle.ArcGISOceansBase to "arcgisOceansBase",
    BasemapStyle.ArcGISOceansLabels to "arcgisOceansLabels",
    BasemapStyle.ArcGISTerrain to "arcgisTerrain",
    BasemapStyle.ArcGISTerrainBase to "arcgisTerrainBase",
    BasemapStyle.ArcGISTerrainDetail to "arcgisTerrainDetail",
    BasemapStyle.ArcGISCommunity to "arcgisCommunity",
    BasemapStyle.ArcGISChartedTerritory to "arcgisChartedTerritory",
    BasemapStyle.ArcGISChartedTerritoryBase to "arcgisChartedTerritoryBase",
    BasemapStyle.ArcGISColoredPencil to "arcgisColoredPencil",
    BasemapStyle.ArcGISNova to "arcgisNova",
    BasemapStyle.ArcGISModernAntique to "arcgisModernAntique",
    BasemapStyle.ArcGISModernAntiqueBase to "arcgisModernAntiqueBase",
    BasemapStyle.ArcGISMidcentury to "arcgisMidcentury",
    BasemapStyle.ArcGISNewspaper to "arcgisNewspaper",
    BasemapStyle.ArcGISHillshadeLight to "arcgisHillshadeLight",
    BasemapStyle.ArcGISHillshadeDark to "arcgisHillshadeDark",
    BasemapStyle.ArcGISOutdoor to "arcgisOutdoor",
    BasemapStyle.ArcGISHumanGeography to "arcgisHumanGeography",
    BasemapStyle.ArcGISHumanGeographyBase to "arcgisHumanGeographyBase",
    BasemapStyle.ArcGISHumanGeographyDetail to "arcgisHumanGeographyDetail",
    BasemapStyle.ArcGISHumanGeographyLabels to "arcgisHumanGeographyLabels",
    BasemapStyle.ArcGISHumanGeographyDark to "arcgisHumanGeographyDark",
    BasemapStyle.ArcGISHumanGeographyDarkBase to "arcgisHumanGeographyDarkBase",
    BasemapStyle.ArcGISHumanGeographyDarkDetail to "arcgisHumanGeographyDarkDetail",
    BasemapStyle.ArcGISHumanGeographyDarkLabels to "arcgisHumanGeographyDarkLabels",
    BasemapStyle.OsmStandard to "osmStandard",
    BasemapStyle.OsmStandardRelief to "osmStandardRelief",
    BasemapStyle.OsmStandardReliefBase to "osmStandardReliefBase",
    BasemapStyle.OsmStreets to "osmStreets",
    BasemapStyle.OsmStreetsRelief to "osmStreetsRelief",
    BasemapStyle.OsmStreetsReliefBase to "osmStreetsReliefBase",
    BasemapStyle.OsmLightGray to "osmLightGray",
    BasemapStyle.OsmLightGrayBase to "osmLightGrayBase",
    BasemapStyle.OsmLightGrayLabels to "osmLightGrayLabels",
    BasemapStyle.OsmDarkGray to "osmDarkGray",
    BasemapStyle.OsmDarkGrayBase to "osmDarkGrayBase",
    BasemapStyle.OsmDarkGrayLabels to "osmDarkGrayLabels",
    BasemapStyle.OsmBlueprint to "osmBlueprint",
    BasemapStyle.OsmHybrid to "osmHybrid",
    BasemapStyle.OsmHybridDetail to "osmHybridDetail",
    BasemapStyle.OsmNavigation to "osmNavigation",
    BasemapStyle.OsmNavigationDark to "osmNavigationDark"
)

fun BasemapStyle.getJsonValue(): String {
    return basemapStyleMapping[this]!!
}

fun parseBasemapStyle(value: String): BasemapStyle? {
    return basemapStyleMapping.entries.firstOrNull { it.value == value }?.key
}
