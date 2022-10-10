package de.tollcollect.sv.smartmv.map

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

val gson = Gson()
inline fun <reified O> Map<String, Any>.parseToClass(): O {
    val json = gson.toJson(this)
    return gson.fromJson(json, object : TypeToken<O>() {}.type)
}

fun toMap(data: Any): Map<Any, Any> {
    val jsonString = gson.toJson(data)
    return gson.fromJson(jsonString, object : TypeToken<Map<Any, Any>>() {}.type)
}
