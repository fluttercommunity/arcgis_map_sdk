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

fun BasemapStyle.getJsonValue(): String? {
    return when (this) {
        BasemapStyle.ArcGISImagery -> "arcgisImagery"
        BasemapStyle.ArcGISImageryStandard -> "arcgisImageryStandard"
        BasemapStyle.ArcGISImageryLabels -> "arcgisImageryLabels"
        BasemapStyle.ArcGISLightGray -> "arcgisLightGray"
        BasemapStyle.ArcGISLightGray -> null
        BasemapStyle.ArcGISLightGrayLabels -> null
        BasemapStyle.ArcGISDarkGray -> "arcgisDarkGray"
        BasemapStyle.ArcGISDarkGrayBase -> null
        BasemapStyle.ArcGISDarkGrayLabels -> null
        BasemapStyle.ArcGISNavigation -> "arcgisNavigation"
        BasemapStyle.ArcGISNavigationNight -> "arcgisNavigationNight"
        BasemapStyle.ArcGISStreets -> "arcgisStreets"
        BasemapStyle.ArcGISStreetsNight -> "arcgisStreetsNight"
        BasemapStyle.OsmStreetsRelief -> "arcgisStreetsRelief"
        BasemapStyle.ArcGISTopographic -> "arcgisTopographic"
        BasemapStyle.ArcGISOceans -> "arcgisOceans"
        BasemapStyle.ArcGISOceansBase -> null
        BasemapStyle.ArcGISOceansLabels -> null
        BasemapStyle.ArcGISTerrain -> "arcgisTerrain"
        BasemapStyle.ArcGISTerrainBase -> null
        BasemapStyle.ArcGISTerrainDetail -> null
        BasemapStyle.ArcGISCommunity -> "arcgisCommunity"
        BasemapStyle.ArcGISChartedTerritory -> "arcgisChartedTerritory"
        BasemapStyle.ArcGISColoredPencil -> "arcgisColoredPencil"
        BasemapStyle.ArcGISNova -> "arcgisNova"
        BasemapStyle.ArcGISModernAntique -> "arcgisModernAntique"
        BasemapStyle.ArcGISMidcentury -> "arcgisMidcentury"
        BasemapStyle.ArcGISNewspaper -> "arcgisNewspaper"
        BasemapStyle.ArcGISHillshadeLight -> "arcgisHillshadeLight"
        BasemapStyle.ArcGISHillshadeDark -> "arcgisHillshadeDark"
        BasemapStyle.ArcGISStreetsReliefBase -> null
        BasemapStyle.ArcGISTopographicBase -> null
        BasemapStyle.ArcGISChartedTerritoryBase -> null
        BasemapStyle.ArcGISModernAntiqueBase -> null
        BasemapStyle.OsmStandard -> "osmStandard"
        BasemapStyle.OsmStandardRelief -> "osmStandardRelief"
        BasemapStyle.OsmStandardReliefBase -> null
        BasemapStyle.OsmStreets -> "osmStreets"
        BasemapStyle.OsmStreetsRelief -> "osmStreetsRelief"
        BasemapStyle.OsmStreetsReliefBase -> null
        BasemapStyle.OsmLightGray -> "osmLightGray"
        BasemapStyle.OsmLightGrayBase -> null
        BasemapStyle.OsmLightGrayLabels -> null
        BasemapStyle.OsmDarkGray -> "osmDarkGray"
        BasemapStyle.OsmDarkGrayBase -> null
        BasemapStyle.OsmDarkGrayLabels -> null
        BasemapStyle.OsmHybrid -> "hybrid"
        else -> null
    }
}

fun parseBasemapStyle(value: String): BasemapStyle? {
    return when (value) {
        "arcgisImagery" -> BasemapStyle.ArcGISImagery
        "arcgisImageryStandard" -> BasemapStyle.ArcGISImageryStandard
        "arcgisImageryLabels" -> BasemapStyle.ArcGISImageryLabels
        "arcgisLightGray" -> BasemapStyle.ArcGISLightGray
        "arcgisDarkGray" -> BasemapStyle.ArcGISDarkGray
        "arcgisNavigation" -> BasemapStyle.ArcGISNavigation
        "arcgisNavigationNight" -> BasemapStyle.ArcGISNavigationNight
        "arcgisStreets" -> BasemapStyle.ArcGISStreets
        "arcgisStreetsNight" -> BasemapStyle.ArcGISStreetsNight
        "arcgisStreetsRelief" -> BasemapStyle.OsmStreetsRelief
        "arcgisTopographic" -> BasemapStyle.ArcGISTopographic
        "arcgisOceans" -> BasemapStyle.ArcGISOceans
        "arcgisTerrain" -> BasemapStyle.ArcGISTerrain
        "arcgisCommunity" -> BasemapStyle.ArcGISCommunity
        "arcgisChartedTerritory" -> BasemapStyle.ArcGISChartedTerritory
        "arcgisColoredPencil" -> BasemapStyle.ArcGISColoredPencil
        "arcgisNova" -> BasemapStyle.ArcGISNova
        "arcgisModernAntique" -> BasemapStyle.ArcGISModernAntique
        "arcgisMidcentury" -> BasemapStyle.ArcGISMidcentury
        "arcgisNewspaper" -> BasemapStyle.ArcGISNewspaper
        "arcgisHillshadeLight" -> BasemapStyle.ArcGISHillshadeLight
        "arcgisHillshadeDark" -> BasemapStyle.ArcGISHillshadeDark
        "osmStandard" -> BasemapStyle.OsmStandard
        "osmStandardRelief" -> BasemapStyle.OsmStandardRelief
        "osmStreets" -> BasemapStyle.OsmStreets
        "osmStreetsRelief" -> BasemapStyle.OsmStreetsRelief
        "osmLightGray" -> BasemapStyle.OsmLightGray
        "osmDarkGray" -> BasemapStyle.OsmDarkGray
        "hybrid" -> BasemapStyle.OsmHybrid
        else -> null
    }
}
