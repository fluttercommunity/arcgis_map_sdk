package esri.arcgis.flutter_plugin

import com.esri.arcgisruntime.mapping.BasemapStyle
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.TypeAdapter
import com.google.gson.reflect.TypeToken
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter

val gson: Gson by lazy {
    val builder = GsonBuilder()
    builder.registerTypeAdapter(BasemapStyle::class.java, BasemapStyleAdapter())
    builder.create()
}

inline fun <reified O> Map<String, Any>.parseToClass(): O {
    val json = gson.toJson(this)
    return gson.fromJson(json, object : TypeToken<O>() {}.type)
}

fun toMap(data: Any): Map<Any, Any> {
    val jsonString = gson.toJson(data)
    return gson.fromJson(jsonString, object : TypeToken<Map<Any, Any>>() {}.type)
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
