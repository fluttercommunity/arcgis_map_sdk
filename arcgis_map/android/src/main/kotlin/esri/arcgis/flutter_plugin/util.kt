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

// TODO 
class BasemapStyleAdapter : TypeAdapter<BasemapStyle>() {
    override fun write(out: JsonWriter, value: BasemapStyle) {
        out.value(BasemapStyle.OSM_STANDARD_RELIEF.name)
    }

    override fun read(reader: JsonReader): BasemapStyle {
        return BasemapStyle.OSM_STANDARD_RELIEF
    }
}