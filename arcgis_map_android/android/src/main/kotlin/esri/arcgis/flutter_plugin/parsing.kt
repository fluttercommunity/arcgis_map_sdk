package esri.arcgis.flutter_plugin

import com.esri.arcgisruntime.mapping.BasemapStyle
import com.esri.arcgisruntime.mapping.view.AnimationCurve
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.symbology.StrokeSymbolLayer
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.TypeAdapter
import com.google.gson.reflect.TypeToken
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter
import esri.arcgis.flutter_plugin.model.symbol.JoinStyle
import esri.arcgis.flutter_plugin.model.symbol.MarkerStyle
import esri.arcgis.flutter_plugin.model.symbol.PolylineStyle

val gson: Gson by lazy {
    GsonBuilder()
        .registerTypeAdapter(BasemapStyle::class.java, BasemapStyleAdapter())
        .registerTypeAdapter(AnimationCurveAdapter::class.java, AnimationCurveAdapter())
        .registerTypeAdapter(CapStyleAdapter::class.java, CapStyleAdapter())
        .registerTypeAdapter(MarkerPlacementAdapter::class.java, MarkerPlacementAdapter())
        .registerTypeAdapter(JoinStyleAdapter::class.java, JoinStyleAdapter())
        .registerTypeAdapter(MarkerStyleAdapter::class.java, MarkerStyleAdapter())
        .registerTypeAdapter(PolylineStyleAdapter::class.java, PolylineStyleAdapter())
        .create()
}

inline fun <reified O> Map<String, Any>.parseToClass(): O {
    val json = gson.toJson(this)
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

class CapStyleAdapter : TypeAdapter<StrokeSymbolLayer.CapStyle>() {
    override fun write(out: JsonWriter, value: StrokeSymbolLayer.CapStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): StrokeSymbolLayer.CapStyle {
        val jsonValue = reader.nextString()
        return StrokeSymbolLayer.CapStyle.values().first { it.getJsonValue() == jsonValue }
    }
}

fun StrokeSymbolLayer.CapStyle.getJsonValue(): String {
    return when (this) {
        StrokeSymbolLayer.CapStyle.BUTT -> "butt"
        StrokeSymbolLayer.CapStyle.ROUND -> "round"
        StrokeSymbolLayer.CapStyle.SQUARE -> "square"
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

class JoinStyleAdapter : TypeAdapter<JoinStyle>() {
    override fun write(out: JsonWriter, value: JoinStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): JoinStyle {
        val jsonValue = reader.nextString()
        return JoinStyle.values().first { it.getJsonValue() == jsonValue }
    }
}

fun JoinStyle.getJsonValue(): String {
    return when (this) {
        JoinStyle.miter -> "miter"
        JoinStyle.round -> "round"
        JoinStyle.bevel -> "bevel"
    }
}

class MarkerStyleAdapter : TypeAdapter<MarkerStyle>() {
    override fun write(out: JsonWriter, value: MarkerStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): MarkerStyle {
        val jsonValue = reader.nextString()
        return MarkerStyle.values().first { it.getJsonValue() == jsonValue }
    }
}

fun MarkerStyle.getJsonValue(): String {
    return when (this) {
        MarkerStyle.arrow -> "arrow"
        MarkerStyle.circle -> "circle"
        MarkerStyle.square -> "square"
        MarkerStyle.diamond -> "diamond"
        MarkerStyle.cross -> "cross"
        MarkerStyle.x -> "x"
    }
}

class PolylineStyleAdapter : TypeAdapter<PolylineStyle>() {
    override fun write(out: JsonWriter, value: PolylineStyle) {
        out.value(value.getJsonValue())
    }

    override fun read(reader: JsonReader): PolylineStyle {
        val jsonValue = reader.nextString()
        return PolylineStyle.values().first { it.getJsonValue() == jsonValue }
    }
}

fun PolylineStyle.getJsonValue(): String {
    return when (this) {
        PolylineStyle.dash -> "dash"
        PolylineStyle.dashDot -> "dashDot"
        PolylineStyle.dot -> "dot"
        PolylineStyle.longDash -> "longDash"
        PolylineStyle.longDashDot -> "longDashDot"
        PolylineStyle.longDashDotDot -> "longDashDotDot"
        PolylineStyle.none -> "none"
        PolylineStyle.shortDash -> "shortDash"
        PolylineStyle.shortDashDot -> "shortDashDot"
        PolylineStyle.shortDashDotDot -> "shortDashDotDot"
        PolylineStyle.shortDot -> "shortDot"
        PolylineStyle.solid -> "solid"
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
