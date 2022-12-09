package esri.arcgis.flutter_plugin.model

data class MapColor(
    val red: Int,
    val green: Int,
    val blue: Int,
) {

    // Impl taken from https://stackoverflow.com/a/18037185/4648625
    fun toHexInt(): Int {
        val newRed = red shl 16 and 0x00FF0000 // Shift red 16-bits and mask out other stuff
        val newGreen = green shl 8 and 0x0000FF00 // Shift Green 8-bits and mask out other stuff
        val newBlue = blue and 0x000000FF // Mask out anything not blue.
        return -0x1000000 or newRed or newGreen or newBlue // 0xFF000000 for 100% Alpha. Bitwise OR everything together.
    }
}
