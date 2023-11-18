package dev.fluttercommunity.arcgis_map_sdk_android

import com.esri.arcgisruntime.mapping.BasemapStyle
import com.esri.arcgisruntime.mapping.view.AnimationCurve
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
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
        return AnimationCurve.values().first { it.getJsonValue() == jsonValue }
    }
}

class BasemapStyleAdapter : TypeAdapter<BasemapStyle>() {
    override fun write(out: JsonWriter, value: BasemapStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): BasemapStyle {
        val jsonValue = reader.nextString()
        return BasemapStyle.values().first { it.getJsonValue() == jsonValue }
    }
}

class MarkerPlacementAdapter : TypeAdapter<SimpleLineSymbol.MarkerPlacement>() {
    override fun write(out: JsonWriter, value: SimpleLineSymbol.MarkerPlacement) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): SimpleLineSymbol.MarkerPlacement {
        val jsonValue = reader.nextString()
        return SimpleLineSymbol.MarkerPlacement.values().first { it.getJsonValue() == jsonValue }
    }
}

fun SimpleLineSymbol.MarkerPlacement.getJsonValue(): String {
    return when (this) {
        SimpleLineSymbol.MarkerPlacement.BEGIN -> "begin"
        SimpleLineSymbol.MarkerPlacement.END -> "end"
        SimpleLineSymbol.MarkerPlacement.BEGIN_AND_END -> "beginEnd"
    }
}

class MarkerStyleAdapter : TypeAdapter<SimpleLineSymbol.MarkerStyle>() {
    override fun write(out: JsonWriter, value: SimpleLineSymbol.MarkerStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): SimpleLineSymbol.MarkerStyle {
        val jsonValue = reader.nextString()
        return SimpleLineSymbol.MarkerStyle.values().firstOrNull { it.getJsonValue() == jsonValue }
            ?: SimpleLineSymbol.MarkerStyle.NONE
    }
}

fun SimpleLineSymbol.MarkerStyle.getJsonValue(): String {
    return when (this) {
        SimpleLineSymbol.MarkerStyle.NONE -> "none"
        SimpleLineSymbol.MarkerStyle.ARROW -> "arrow"
    }
}

class PolylineStyleAdapter : TypeAdapter<SimpleLineSymbol.Style>() {
    override fun write(out: JsonWriter, value: SimpleLineSymbol.Style) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): SimpleLineSymbol.Style {
        val jsonValue = reader.nextString()
        return SimpleLineSymbol.Style.values().firstOrNull { it.getJsonValue() == jsonValue }
            ?: SimpleLineSymbol.Style.DASH
    }
}

fun SimpleLineSymbol.Style.getJsonValue(): String {
    return when (this) {
        SimpleLineSymbol.Style.DASH -> "dash"
        SimpleLineSymbol.Style.DASH_DOT -> "dashDot"
        SimpleLineSymbol.Style.DOT -> "dot"
        SimpleLineSymbol.Style.DASH_DOT_DOT -> "dashDotDot"
        SimpleLineSymbol.Style.LONG_DASH -> "longDash"
        SimpleLineSymbol.Style.LONG_DASH_DOT -> "longDashDot"
        SimpleLineSymbol.Style.NULL -> "none"
        SimpleLineSymbol.Style.SHORT_DASH -> "shortDash"
        SimpleLineSymbol.Style.SHORT_DASH_DOT -> "shortDashDot"
        SimpleLineSymbol.Style.SHORT_DASH_DOT_DOT -> "shortDashDotDot"
        SimpleLineSymbol.Style.SHORT_DOT -> "shortDot"
        SimpleLineSymbol.Style.SOLID -> "solid"
    }
}


fun AnimationCurve.getJsonValue(): String {
    return when (this) {
        AnimationCurve.LINEAR -> "linear"
        AnimationCurve.EASE_IN_EXPO -> "easy"
        AnimationCurve.EASE_IN_CIRC -> "easeIn"
        AnimationCurve.EASE_OUT_CIRC -> "easeOut"
        AnimationCurve.EASE_IN_OUT_CIRC -> "easeInOut"
        else -> "linear"
    }
}

fun BasemapStyle.getJsonValue(): String? {
    return when (this) {
        BasemapStyle.ARCGIS_IMAGERY -> "arcgisImagery"
        BasemapStyle.ARCGIS_IMAGERY_STANDARD -> "arcgisImageryStandard"
        BasemapStyle.ARCGIS_IMAGERY_LABELS -> "arcgisImageryLabels"
        BasemapStyle.ARCGIS_LIGHT_GRAY -> "arcgisLightGray"
        BasemapStyle.ARCGIS_LIGHT_GRAY_BASE -> null
        BasemapStyle.ARCGIS_LIGHT_GRAY_LABELS -> null
        BasemapStyle.ARCGIS_DARK_GRAY -> "arcgisDarkGray"
        BasemapStyle.ARCGIS_DARK_GRAY_BASE -> null
        BasemapStyle.ARCGIS_DARK_GRAY_LABELS -> null
        BasemapStyle.ARCGIS_NAVIGATION -> "arcgisNavigation"
        BasemapStyle.ARCGIS_NAVIGATION_NIGHT -> "arcgisNavigationNight"
        BasemapStyle.ARCGIS_STREETS -> "arcgisStreets"
        BasemapStyle.ARCGIS_STREETS_NIGHT -> "arcgisStreetsNight"
        BasemapStyle.ARCGIS_STREETS_RELIEF -> "arcgisStreetsRelief"
        BasemapStyle.ARCGIS_TOPOGRAPHIC -> "arcgisTopographic"
        BasemapStyle.ARCGIS_OCEANS -> "arcgisOceans"
        BasemapStyle.ARCGIS_OCEANS_BASE -> null
        BasemapStyle.ARCGIS_OCEANS_LABELS -> null
        BasemapStyle.ARCGIS_TERRAIN -> "arcgisTerrain"
        BasemapStyle.ARCGIS_TERRAIN_BASE -> null
        BasemapStyle.ARCGIS_TERRAIN_DETAIL -> null
        BasemapStyle.ARCGIS_COMMUNITY -> "arcgisCommunity"
        BasemapStyle.ARCGIS_CHARTED_TERRITORY -> "arcgisChartedTerritory"
        BasemapStyle.ARCGIS_COLORED_PENCIL -> "arcgisColoredPencil"
        BasemapStyle.ARCGIS_NOVA -> "arcgisNova"
        BasemapStyle.ARCGIS_MODERN_ANTIQUE -> "arcgisModernAntique"
        BasemapStyle.ARCGIS_MIDCENTURY -> "arcgisMidcentury"
        BasemapStyle.ARCGIS_NEWSPAPER -> "arcgisNewspaper"
        BasemapStyle.ARCGIS_HILLSHADE_LIGHT -> "arcgisHillshadeLight"
        BasemapStyle.ARCGIS_HILLSHADE_DARK -> "arcgisHillshadeDark"
        BasemapStyle.ARCGIS_STREETS_RELIEF_BASE -> null
        BasemapStyle.ARCGIS_TOPOGRAPHIC_BASE -> null
        BasemapStyle.ARCGIS_CHARTED_TERRITORY_BASE -> null
        BasemapStyle.ARCGIS_MODERN_ANTIQUE_BASE -> null
        BasemapStyle.OSM_STANDARD -> "osmStandard"
        BasemapStyle.OSM_STANDARD_RELIEF -> "osmStandardRelief"
        BasemapStyle.OSM_STANDARD_RELIEF_BASE -> null
        BasemapStyle.OSM_STREETS -> "osmStreets"
        BasemapStyle.OSM_STREETS_RELIEF -> "osmStreetsRelief"
        BasemapStyle.OSM_LIGHT_GRAY -> "osmLightGray"
        BasemapStyle.OSM_LIGHT_GRAY_BASE -> null
        BasemapStyle.OSM_LIGHT_GRAY_LABELS -> null
        BasemapStyle.OSM_DARK_GRAY -> "osmDarkGray"
        BasemapStyle.OSM_DARK_GRAY_BASE -> null
        BasemapStyle.OSM_DARK_GRAY_LABELS -> null
        BasemapStyle.OSM_STREETS_RELIEF_BASE -> null
    }
}
